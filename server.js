const http = require("http");
const fs = require("fs");
const path = require("path");

const START_PORT = Number(process.env.PORT || 4177);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "leaderboard.json");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function readScores() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(data.rows) ? data.rows : [];
  } catch {
    return [];
  }
}

function writeScores(rows) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ rows }, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(text);
}

function cleanScore(body) {
  return {
    name: String(body.name || "Gardener").replace(/[^\w .-]/g, "").trim().slice(0, 24) || "Gardener",
    coins: Math.max(0, Math.floor(Number(body.coins) || 0)),
    coinsEarned: Math.max(0, Math.floor(Number(body.coinsEarned) || 0)),
    seedsPlanted: Math.max(0, Math.floor(Number(body.seedsPlanted) || 0)),
    updatedAt: new Date().toISOString()
  };
}

function ranked(rows) {
  return rows
    .sort((a, b) =>
      b.coins - a.coins ||
      b.coinsEarned - a.coinsEarned ||
      b.seedsPlanted - a.seedsPlanted ||
      String(a.name).localeCompare(String(b.name))
    )
    .slice(0, 25);
}

function sendJson(res, data) {
  res.writeHead(200, {
    "Content-Type": TYPES[".json"],
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 4096) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function serveFile(req, res) {
  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.resolve(ROOT, cleanUrl === "/" ? "index.html" : cleanUrl.slice(1));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const route = req.url.split("?")[0];
  if (req.method === "OPTIONS") {
    sendJson(res, { ok: true });
    return;
  }
  if (route === "/api/health") {
    sendJson(res, { ok: true, name: "Sprout Market Garden", rows: readScores().length });
    return;
  }
  if (route === "/api/leaderboard") {
    if (req.method === "GET") {
      sendJson(res, { rows: ranked(readScores()) });
      return;
    }
    if (req.method === "POST") {
      try {
        const score = cleanScore(await readBody(req));
        const rows = readScores().filter(row => row.name.toLowerCase() !== score.name.toLowerCase());
        rows.push(score);
        const best = ranked(rows);
        writeScores(best);
        sendJson(res, { rows: best });
      } catch {
        sendText(res, 400, "Bad leaderboard score");
      }
      return;
    }
    sendText(res, 405, "Method not allowed");
    return;
  }
  serveFile(req, res);
});

function listen(port, attemptsLeft) {
  server.once("error", error => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    console.error(error.message);
    process.exit(1);
  });
  server.listen(port, HOST, () => {
    console.log(`Sprout Market Garden server running at http://${HOST}:${port}/`);
    console.log("Open that URL in your browser. Press Ctrl+C here to stop the server.");
  });
}

listen(START_PORT, 20);

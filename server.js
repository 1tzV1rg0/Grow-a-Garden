const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4177);
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
  res.writeHead(200, { "Content-Type": TYPES[".json"], "Cache-Control": "no-store" });
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
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url.split("?")[0] === "/api/leaderboard") {
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
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Bad leaderboard score");
      }
      return;
    }
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }
  serveFile(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Sprout Market Garden server running at http://127.0.0.1:${PORT}/`);
});

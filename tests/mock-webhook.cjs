const fs = require("fs");
const http = require("http");

const logPath = process.env.MOCK_WEBHOOK_LOG_PATH;

function writeLog(entry) {
  if (!logPath) {
    return;
  }

  fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`, "utf8");
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok");
    return;
  }

  if (req.method === "POST" && req.url === "/") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      writeLog({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: body ? JSON.parse(body) : null
      });
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, received: Boolean(body) }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("not found");
});

server.listen(3999, "127.0.0.1");

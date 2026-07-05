const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Common CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("Incoming request:", req.method, req.url);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log("Handled OPTIONS preflight for", req.url);
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // Handle frame upload
  if (req.method === "POST" && req.url === "/upload") {
    console.log("Upload request received");
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      console.log("Received chunk:", chunk.length, "bytes");
    });
    req.on("end", () => {
      console.log("Upload body length:", body.length);
      try {
        const parsed = JSON.parse(body);
        const frameData = parsed.frame;
        if (!frameData) {
          console.warn("Upload missing frame data");
          res.writeHead(400);
          return res.end("No frame");
        }

        const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, "");
        const filePath = path.join(__dirname, "frame.jpg");
        fs.writeFileSync(filePath, base64Data, "base64");

        console.log("Frame saved successfully:", filePath);
        res.writeHead(200);
        res.end("OK");
      } catch (err) {
        console.error("Upload error:", err);
        res.writeHead(500);
        res.end("Error: " + err.message);
      }
    });

  // Handle frame retrieval (with or without query string)
  } else if (req.method === "GET" && req.url.startsWith("/frame.jpg")) {
    const filePath = path.join(__dirname, "frame.jpg");
    if (fs.existsSync(filePath)) {
      console.log("Serving frame.jpg");
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      console.warn("Frame not found yet");
      res.writeHead(404);
      res.end("No frame yet");
    }

  } else {
    console.warn("Unknown route:", req.method, req.url);
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

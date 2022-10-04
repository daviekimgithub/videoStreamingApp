const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Request Range Header");
  }

  const videoPath = "national_unity.mp4";
  const videoSize = fs.statSync("national_unity.mp4").size;

  // Parse Range
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
    "Accept-Range": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  console.log(res.en);
  videoStream.pipe(res);
});

app.listen(8000, function () {
  console.log("listening on port 8000");
});

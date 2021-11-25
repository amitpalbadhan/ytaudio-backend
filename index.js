var execSync = require('child_process');

const express = require("express");
const fs = require('fs');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const app = express();
let port = process.env.PORT || 3000;

const ffmpeg = createFFmpeg({ log: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
});

function findLeastIndex(lst, start, end) {
  if (start > end)
    return end + 1;

  if (start != lst[start])
    return start;

  let mid = ~~((start + end) / 2);

  if (lst[mid] == mid)
    return findLeastIndex(lst, mid + 1, end)

  return findLeastIndex(lst, start, mid);
}

let downloadQueue = [0, 1, 3, 4];

app.get('/api', async (req, res) => {
  const file = findLeastIndex(downloadQueue, 0, downloadQueue.length - 1);
  downloadQueue.splice(file, 0, file);
  console.log(downloadQueue);

  require('child_process').execSync(`yt-dlp.exe -o "${file}.%(ext)s" -P "./data/" -x --audio-format ${req.query.format} https://www.youtube.com/watch?v=${req.query.id}`);

  res.download(`${__dirname}/data/${file + '.' + req.query.format}`);

  require('child_process').execSync(`${__dirname}/data/${file + '.' + req.query.format}`);

  downloadQueue.splice(downloadQueue.indexOf(file));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
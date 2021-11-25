const execSync = require('child_process');
const cors = require('cors')

const express = require("express");

const app = express();
app.use(cors());
let port = process.env.PORT || 3000;

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

let downloadQueue = [];

app.get('/api', async (req, res) => {
  const file = findLeastIndex(downloadQueue, 0, downloadQueue.length - 1);
  downloadQueue.splice(file, 0, file);
  console.log(downloadQueue);

  require('child_process').execSync(`./yt-dlp/yt-dlp.sh -o "${req.query.id}.%(ext)s" -P "./data/" -x --audio-format ${req.query.format} https://www.youtube.com/watch?v=${req.query.id}`);

  res.download(`${__dirname}/data/${req.query.id + '.' + req.query.format}`);

  await sleep(20000)
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  require('child_process').execSync(`rm ${__dirname}/data/${req.query.id + '.' + req.query.format}`);

  downloadQueue.splice(downloadQueue.indexOf(file));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

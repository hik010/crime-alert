const router = require('express').Router();
const { spawn } = require('child_process');
const path = require('path');

module.exports = router;

const pythonPromise = data => {
  let scriptPath = path.join(__dirname, '..', '..', 'script', 'scrape.py');
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath, ...data]);

    python.stdout.on('data', data => {
      resolve(data.toString());
    });

    python.stderr.on('data', data => {
      reject(data.toString());
    });
  });
};

router.post('/', async (req, res, next) => {
  try {
    let dataFromPython = await pythonPromise([req.body.links]);
    res.send(dataFromPython);
  } catch (err) {
    console.log(err)
    next(err);
  }
});

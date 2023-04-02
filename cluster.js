const cluster = require('cluster');
const os = require('os');

const pid = process.pid;

if (cluster.isPrimary) {
  const cpusCount = os.cpus().length;

  for (let i = 0; i < cpusCount - 1; i++) {
    const worker = cluster.fork();

    worker.send('Hello from server');
    worker.on('message', (msg) => {
      console.log(`message from worker: ${worker.process.pid} : ${JSON.stringify(msg)}`);
    });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker died! Pid: ${worker.process.pid}`);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  require('./worker.js');

  process.on('message', (msg) => {
    console.log(`message from master: ${msg}`);
  });

  process.send({ text: 'Hello', pid });
}

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const server = require('./index');

if (cluster.isMaster && process.env.NODE_ENV !== 'development') {
    console.log(`Master ${process.pid} is running`);

    cluster.on('exit', (worker, code, signal) => {
        if (worker.exitedAfterDisconnect) {
            console.log(`worker id: ${worker.id}, pid: ${worker.process.pid} died – I killed it`);
        } else {
            console.log(`worker id: ${worker.id}, pid: ${worker.process.pid} died - Who did?`);
        }
        cluster.fork(); // 重启
    });
    cluster.on('fork', (worker) => {
        console.log(`worker id: ${worker.id}, pid: ${worker.process.pid} forked`);
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

} else {
    server();
}
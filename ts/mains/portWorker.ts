import { Worker } from 'worker_threads';
import path from 'path';
import { app } from 'electron';
let portWorker: Worker | null = null;
export function getPortWorker(): Worker {
  if (portWorker) return portWorker;
  const workerPath = app.isPackaged
    ? path.join(process.resourcesPath, 'ts/webworker/workers/node/portKiller.worker.js')
    : path.join(__dirname, '../webworker/workers/node/portKiller.worker.js');
  console.log('Starting PortWorker from', workerPath);
  portWorker = new Worker(workerPath);
  portWorker.on('message', msg => {
    console.log('[PortWorker result]', msg);
  });
  portWorker.on('error', err => {
    console.error('[PortWorker error]', err);
  });
  portWorker.on('exit', code => {
    console.error('[PortWorker exited]', code);
    portWorker = null;
  });
  return portWorker;
}

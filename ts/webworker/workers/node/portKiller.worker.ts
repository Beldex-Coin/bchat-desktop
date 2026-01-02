import { parentPort } from 'worker_threads';
import { exec } from 'child_process';
import os from 'os';

function execWithTimeout(command: string, timeoutMs = 2000): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(command, { windowsHide: true }, err => (err ? reject(err) : resolve()));

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Command timeout'));
    }, timeoutMs);

    child.on('exit', () => clearTimeout(timer));
  });
}

async function killPort(port: number) {
  const platform = os.platform();
  if (platform === 'win32') {
    // SAFE Windows command (no hanging pipes)
    await execWithTimeout(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"`
    );
  } else if (platform === 'darwin') {
    await execWithTimeout(
      `sh -c "pids=$(lsof -ti tcp:${port}); [ -n \\"$pids\\" ] && kill -9 $pids || true"`
    );
  } else {
    await execWithTimeout(`fuser -k ${port}/tcp`);
  }
}

parentPort?.on('message', async (port: number) => {
  try {
    await killPort(port);
    parentPort?.postMessage({ ok: true, port });
  } catch (err) {
    parentPort?.postMessage({
      ok: false,
      port,
      error: err.message,
    });
  }
});

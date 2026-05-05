#!/usr/bin/env node
// safe-build.js — wraps `vite build` with a hard timeout that kills the
// whole process group on hang. Prevents orphaned vite/esbuild service
// daemons from accumulating when Deuce's Bash tool times out (default 2min)
// while vite is still running.
//
// Default timeout: 180s. Override with BUILD_TIMEOUT env var.

import { spawn } from 'node:child_process';
import process from 'node:process';

const TIMEOUT_MS = (parseInt(process.env.BUILD_TIMEOUT, 10) || 180) * 1000;

const child = spawn('vite', ['build'], {
  stdio: 'inherit',
  detached: true,
});

let timedOut = false;
const watchdog = setTimeout(() => {
  timedOut = true;
  console.error(`\n[safe-build] TIMEOUT after ${TIMEOUT_MS / 1000}s — killing process group ${child.pid}`);
  try { process.kill(-child.pid, 'SIGTERM'); } catch {}
  setTimeout(() => {
    try { process.kill(-child.pid, 'SIGKILL'); } catch {}
  }, 3000);
}, TIMEOUT_MS);

child.on('exit', (code, signal) => {
  clearTimeout(watchdog);
  if (timedOut) {
    process.exit(124);
  }
  if (signal) {
    console.error(`[safe-build] vite exited on signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});

const forwardSignal = (sig) => () => {
  try { process.kill(-child.pid, sig); } catch {}
};
process.on('SIGINT', forwardSignal('SIGINT'));
process.on('SIGTERM', forwardSignal('SIGTERM'));
process.on('SIGHUP', forwardSignal('SIGHUP'));

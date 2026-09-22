/**
 * Structured Logger for ROSA Knee Surgical Platform
 */

export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  error: (msg, meta = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  pipeline: (stage, patientId, msg) => {
    console.log(`[PIPELINE:${stage.toUpperCase()}] [Patient:${patientId}] ${msg}`);
  }
};

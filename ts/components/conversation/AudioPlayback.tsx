

import PQueue from 'promise-queue';
import {  getLRUCache, setLRUCache } from '../../data/data';

const REDACTION_PLACEHOLDER = '[REDACTED]';
const MAX_PARALLEL_COMPUTE = 8;
const MAX_AUDIO_DURATION = 15 * 60; // 15 minutes

export type ComputePeaksResult = {
  duration: number;
  peaks: ReadonlyArray<number>; // 0 < peak < 1
};

export const redactAttachmentUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    url.search = '';
    return url.toString();
  } catch {
    return REDACTION_PLACEHOLDER;
  }
};

export type Contents = {
  computePeaks(url: string, barCount: number): Promise<ComputePeaksResult>;
};

const inProgressMap = new Map<string, Promise<ComputePeaksResult>>();
const computeQueue = new PQueue(MAX_PARALLEL_COMPUTE, Infinity);

async function getAudioDuration(
  url: string,
  buffer: ArrayBuffer
): Promise<number> {
  const blob = new Blob([buffer]);
  const blobURL = URL.createObjectURL(blob);
  const urlForLogging = redactAttachmentUrl(url);
  const audio = new Audio();
  audio.muted = true;
  audio.src = blobURL;

  await new Promise<void>((resolve, reject) => {
    audio.addEventListener('loadedmetadata', () => {
      resolve();
    });

    audio.addEventListener('error', event => {
      const error = new Error(
        `Failed to load audio from: ${urlForLogging} due to error: ${event.type}`
      );
      reject(error);
    });
  });

  if (Number.isNaN(audio.duration)) {
    throw new Error(`Invalid audio duration for: ${urlForLogging}`);
  }
  return audio.duration;
}

/**
 * Load audio from `url`, decode PCM data, and compute RMS peaks for displaying
 * the waveform.
 *
 * The results are cached in the bchat LRU-cache which is shared across
 * messages in the conversation and provided by GlobalAudioContext.
 * 
 * it is still quite expensive, so we cache it in the  bchat LRU-cache.
 */
async function doComputePeaks(
  url: string,
  barCount: number,
  slicedSrc:string
): Promise<ComputePeaksResult> {
  const cacheKey = `cacheKey${slicedSrc}:${barCount}`;
  const existing = await getLRUCache(cacheKey);
  const urlForLogging = redactAttachmentUrl(url);
  const logId = `AudioContext(${urlForLogging})`;
  if (existing) {
    console.info(`${logId}: waveform cache hit`);
    return Promise.resolve(existing);
  }
  console.info(`${logId}: waveform cache miss`);

  // Load and decode `url` into a raw PCM
  const response = await fetch(url);
  const raw = await response.arrayBuffer();
  const duration = await getAudioDuration(url, raw);
  const peaks = new Array(barCount).fill(0);
  if (duration > MAX_AUDIO_DURATION) {
    console.info(`${logId}: duration ${duration}s is too long`);
    const emptyResult = { peaks, duration };
    const data={key:cacheKey,value:emptyResult}
    await setLRUCache(data)
    return emptyResult;
  }
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const data = await audioCtx.decodeAudioData(raw);
  
  // Compute RMS peaks
  const norms = new Array(barCount).fill(0);
  const samplesPerPeak = data.length / peaks.length;
  for (
    let channelNum = 0;
    channelNum < data.numberOfChannels;
    channelNum += 1
  ) {
    const channel = data.getChannelData(channelNum);

    for (let sample = 0; sample < channel.length; sample += 1) {
      const i = Math.floor(sample / samplesPerPeak);
      peaks[i] += channel[sample] ** 2;
      norms[i] += 1;
    }
  }
  // Average
  let max = 1e-23;
  for (let i = 0; i < peaks.length; i += 1) {
    peaks[i] = Math.sqrt(peaks[i] / Math.max(1, norms[i]));
    max = Math.max(max, peaks[i]);
  }
  // Normalize
  for (let i = 0; i < peaks.length; i += 1) {
    peaks[i] /= max;
  }
  const result = { peaks, duration };
  const cachedata={key:cacheKey,value:result}
  await setLRUCache(cachedata)
  return result;
}

export async function computePeaks(
  url: string,
  barCount: number,
  slicedSrc:string
): Promise<ComputePeaksResult> {
  const computeKey = `${url}:${barCount}`;
  const logId = `AudioContext(${redactAttachmentUrl(url)})`;
  const pending = inProgressMap.get(computeKey);
  if (pending) {
    console.info(`${logId}: already computing peaks`);
    return pending;
  }
  console.info(`${logId}: queueing computing peaks`);
  const promise = computeQueue.add(() => doComputePeaks(url, barCount,slicedSrc));
  inProgressMap.set(computeKey, promise);
  try {
    return await promise;
  } finally {
    inProgressMap.delete(computeKey);
  }
}


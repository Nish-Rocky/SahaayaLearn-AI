import { logger } from '../utils/logger.js';

export interface AudioInputMetadata {
  sampleRate: number;
  channels: number;
  encoding: 'linear16' | 'opus' | 'wav';
  bytesReceived: number;
  durationSeconds: number;
}

export class AudioInputService {
  private chunks: Buffer[] = [];
  private totalBytes = 0;
  private readonly sampleRate: number;
  private readonly channels: number;

  constructor(sampleRate = 16000, channels = 1) {
    this.sampleRate = sampleRate;
    this.channels = channels;
  }

  appendChunk(chunk: Buffer) {
    this.chunks.push(chunk);
    this.totalBytes += chunk.length;
  }

  getMetadata(): AudioInputMetadata {
    // 16-bit PCM = 2 bytes per sample
    const bytesPerSecond = this.sampleRate * this.channels * 2;
    const durationSeconds = this.totalBytes / Math.max(1, bytesPerSecond);

    return {
      sampleRate: this.sampleRate,
      channels: this.channels,
      encoding: 'linear16',
      bytesReceived: this.totalBytes,
      durationSeconds: Number(durationSeconds.toFixed(2)),
    };
  }

  /**
   * Combines all chunks into a complete WAV buffer with header
   */
  getCompleteWavBuffer(): Buffer {
    const pcmData = Buffer.concat(this.chunks);
    const wavBuffer = this.createWavHeader(pcmData, this.sampleRate, this.channels, 16);
    return wavBuffer;
  }

  /**
   * DPDP 2023 zero-voiceprint retention purge
   */
  purge() {
    this.chunks = [];
    this.totalBytes = 0;
  }

  private createWavHeader(pcmData: Buffer, sampleRate: number, numChannels: number, bitsPerSample: number): Buffer {
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcmData.length;
    const header = Buffer.alloc(44);

    // RIFF chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write('WAVE', 8);

    // fmt sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size for PCM
    header.writeUInt16LE(1, 20); // AudioFormat 1 = PCM
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);

    // data sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmData]);
  }
}

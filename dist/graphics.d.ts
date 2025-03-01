import gm from 'gm';
import fs from 'fs';
import { BufferResponse, ToBase64Response, WriteImageResponse } from './types/convertResponse';
import { Options, GmClassOptions } from './types/options';
export declare class Graphics {
  private quality;
  private format;
  private width;
  private height;
  private preserveAspectRatio;
  private density;
  private savePath;
  private saveFilename;
  private compression;
  private gm;
  generateValidFilename(page?: number): string;
  gmBaseCommand(stream: fs.ReadStream, filename: string): gm.State;
  toBase64(stream: fs.ReadStream, page?: number): Promise<ToBase64Response>;
  toBuffer(stream: fs.ReadStream, page?: number): Promise<BufferResponse>;
  writeImage(stream: fs.ReadStream, page?: number): Promise<WriteImageResponse>;
  identify(filepath: string | fs.ReadStream, argument?: string): Promise<gm.ImageInfo | string>;
  setQuality(quality: number): Graphics;
  setFormat(format: string): Graphics;
  setSize(width: number, height?: number): Graphics;
  setPreserveAspectRatio(preserveAspectRatio: boolean): Graphics;
  setDensity(density: number): Graphics;
  setSavePath(savePath: string): Graphics;
  setSaveFilename(filename: string): Graphics;
  setCompression(compression: string): Graphics;
  setGMClass(gmOptions: GmClassOptions): Graphics;
  getOptions(): Options;
}

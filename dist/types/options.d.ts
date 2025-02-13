export type Options = {
  quality?: number;
  format?: string;
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
  density?: number;
  savePath?: string;
  saveFilename?: string;
  compression?: string;
};
export type GmClassOptions = {
  appPath?: string | undefined;
  imageMagick?: string | boolean | undefined;
  timeout?: string | number;
};

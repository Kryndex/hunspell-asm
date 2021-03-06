import * as nanoid from 'nanoid';
import { FS } from './HunspellAsmModule';
import { isMounted } from './isMounted';
import { log } from './util/logger';

/**
 * Creates a function to mount contents of file into wasm internal memory filesystem
 * to allow wasm can access.
 *
 * @param {FS} FS wasm module filesystem
 * @param {string} memPathId root path in memory filesystem to mount given arrayBuffer.
 * This prefix path is generated automatically each time wasm module is loaded.
 *
 * @return {(contents: ArrayBufferView, fileName?: string) => string} function to mount buffer under memory filesystem.
 * If filename is not provided, it'll be generated automatically. This function checks existing file mounted via filename,
 * does not validate contents of buffer to find out already mounted one.
 */

/** @internal */
export const mountBuffer = (FS: FS, memPathId: string) => (contents: ArrayBufferView, fileName?: string): string => {
  const file = fileName || nanoid(45);
  const mountedFilePath = `${memPathId}/${file}`;

  if (isMounted(FS, mountedFilePath, 'file')) {
    log(`mountTypedArrayFile: file is already mounted, return it`);
  } else {
    FS.writeFile(mountedFilePath, contents, { encoding: 'binary' });
  }

  return mountedFilePath;
};

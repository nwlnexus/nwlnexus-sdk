import fs from 'node:fs';

export const resetCFAssets = (dir: string) => {
  fs.rmSync(dir, { recursive: true, force: true });
};

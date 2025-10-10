import fs from "node:fs";

export const mkdir = (path: string, recursive: boolean = false) => {
  fs.mkdirSync(path, {
    recursive,
  });
};

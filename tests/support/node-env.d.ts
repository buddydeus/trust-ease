declare const process: {
  cwd(): string;
};

declare module 'node:fs' {
  const fs: {
    existsSync(path: string): boolean;
    mkdirSync(path: string, options?: { recursive?: boolean }): void;
    mkdtempSync(prefix: string): string;
    readFileSync(path: string, encoding: BufferEncoding): string;
    rmSync(
      path: string,
      options?: { force?: boolean; recursive?: boolean }
    ): void;
    writeFileSync(path: string, data: string, encoding?: BufferEncoding): void;
  };

  export default fs;
}

declare module 'node:os' {
  const os: {
    tmpdir(): string;
  };

  export default os;
}

declare module 'node:path' {
  const path: {
    dirname(path: string): string;
    join(...paths: string[]): string;
  };

  export default path;
}

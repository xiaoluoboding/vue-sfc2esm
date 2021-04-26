declare function compileModules(filename: string): Promise<Array<string>>;

interface FileCompiled {
    js: string;
    css: string;
    ssr: string;
    errors: Array<string | Error>;
}
declare class File {
    filename: string;
    code: string;
    compiled: FileCompiled;
    constructor(filename: string, code?: string);
}
interface Store {
    files: Record<string, File>;
    activeFilename: string;
    readonly activeFile: File;
    readonly importMap: string | undefined;
    errors: Array<string | Error>;
}
declare const store: Store;
declare function exportFiles(): Record<string, string>;
declare function recordFileErrors(errors: Array<string | Error>): void;
declare function addFile(filename: string, code: string): void;
declare function changeFile(filename: string, code: string): void;
declare function deleteFile(filename: string): void;

declare function compileFile({ filename, code, compiled }: File): Promise<void>;

export { addFile, changeFile, compileFile, compileModules, deleteFile, exportFiles, recordFileErrors, store };

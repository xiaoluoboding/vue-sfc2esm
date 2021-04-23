declare function compileModules(filename: string): Promise<Array<string>>;

declare class File {
    filename: string;
    code: string;
    compiled: {
        js: string;
        css: string;
        ssr: string;
    };
    constructor(filename: string, code?: string);
}
interface Store {
    files: Record<string, File>;
    activeFilename: string;
    readonly activeFile: File;
    readonly importMap: string | undefined;
    errors: (string | Error)[];
}
declare const store: Store;
declare function exportFiles(): Record<string, string>;
declare function addFile(filename: string, code: string): void;
declare function changeFile(filename: string, code: string): void;
declare function deleteFile(filename: string): void;

declare function compileFile({ filename, code, compiled }: File): Promise<void>;

declare const generateHashId: (seed: string) => string;

export { addFile, changeFile, compileFile, compileModules, deleteFile, exportFiles, generateHashId, store };

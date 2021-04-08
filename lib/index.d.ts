declare function compileModules(): Promise<any[]>;

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
declare function setActive(filename: string): void;
declare function addFile(filename: string): void;
declare function deleteFile(filename: string): void;

declare const MAIN_FILE = "App.vue";
declare const COMP_IDENTIFIER = "__sfc__";
declare function compileFile({ filename, code, compiled }: File): Promise<void>;

export { COMP_IDENTIFIER, File, MAIN_FILE, Store, addFile, compileFile, compileModules, deleteFile, exportFiles, setActive, store };

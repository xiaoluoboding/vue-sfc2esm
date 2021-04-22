import * as vue from 'vue';

declare function compileModules(filename: string): Promise<Array<string>>;

declare const APP_FILE = "App.vue";
declare const MAIN_FILE = "main.js";
declare const WELCOME_CODE: string;
declare const MAIN_CODE: string;
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
declare const activeFilename: vue.ComputedRef<string>;
declare const mainCode: vue.ComputedRef<string>;
declare const encodeFiles: () => string;
declare function exportFiles(): Record<string, string>;
declare function setActive(filename: string, code: string): void;
declare function addFile(filename: string, code: string): void;
declare function changeFile(filename: string, code: string): void;
declare function deleteFile(filename: string): void;

declare const COMP_IDENTIFIER = "__sfc__";
declare function compileFile({ filename, code, compiled }: File): Promise<void>;

export { APP_FILE, COMP_IDENTIFIER, File, MAIN_CODE, MAIN_FILE, Store, WELCOME_CODE, activeFilename, addFile, changeFile, compileFile, compileModules, deleteFile, encodeFiles, exportFiles, mainCode, setActive, store };

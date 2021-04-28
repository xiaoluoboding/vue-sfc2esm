/**
 * Transpiled Vue SFC File to ES modules with `@vue/compiler-sfc`.
 *
 * @param filename
 */
declare function compileModules(filename: string): Promise<Array<string>>;

/**
 * Record the code & errors when a sfc file has been compiled.
 */
interface FileCompiled {
    js: string;
    css: string;
    ssr: string;
    errors: Array<string | Error>;
}
/**
 * Simple Virtual File System
 */
declare class File {
    filename: string;
    code: string;
    compiled: FileCompiled;
    constructor(filename: string, code?: string);
}
/**
 * `vue-sfc2esm` built-in store.
 */
interface Store {
    files: Record<string, File>;
    activeFilename: string;
    readonly activeFile: File;
    readonly importMap: string | undefined;
    errors: Array<string | Error>;
}
declare const store: Store;
/**
 * Export the files code.
 *
 * @returns exported
 */
declare function exportFiles(): Record<string, string>;
/**
 * Record File errors when compiling file.
 *
 * @param errors
 */
declare function recordFileErrors(errors: Array<string | Error>): void;
/**
 * Add a file into the store, ready for compilation.
 *
 * @param filename
 * @param code
 */
declare function addFile(filename: string, code: string): void;
/**
 * Change the file code, It will trigger `compileFile` action.
 *
 * @param filename
 * @param code
 */
declare function changeFile(filename: string, code: string): void;
/**
 * Delete the file in the store. with or without confirmation.
 *
 * @param filename
 * @param withConfirm
 */
declare function deleteFile(filename: string, withConfirm?: boolean): void;

/**
 * Compile the `activeFile` in the store. It will change the File.compiled info.
 *
 * @param File
 */
declare function compileFile({ filename, code, compiled }: File): Promise<void>;

export { addFile, changeFile, compileFile, compileModules, deleteFile, exportFiles, recordFileErrors, store };

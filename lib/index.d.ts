declare function compileModules(): Promise<string[]>;

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

declare const MAIN_FILE = "App.vue";
declare const COMP_IDENTIFIER = "__sfc__";
declare function compileFile({ filename, code, compiled }: File): Promise<void>;

export { COMP_IDENTIFIER, MAIN_FILE, compileFile, compileModules };

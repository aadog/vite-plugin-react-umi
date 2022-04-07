export declare class template {
    static templateRenders: {};
    static registerBuiltin(): void;
    static registerImports(name: string, obj: any): void;
    static render(templateName: string, data?: Record<string, any>): string;
    static renderToProjectUmiFile(templateName: string, ext?: string, data?: Record<string, any>): void;
}

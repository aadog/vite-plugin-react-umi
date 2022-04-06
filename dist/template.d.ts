export declare class template {
    static templateRenders: {};
    static registerBuiltin(): void;
    static registerImports(name: string, obj: any): void;
    static render(templateName: string, data?: Record<string, any>): string;
    static renderToProjectUmi(templateName: string, data?: Record<string, any>): void;
}

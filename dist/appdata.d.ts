import { PluginOptions } from "./types";
import { PackageData } from "vite";
import * as esModuleLexer from "es-module-lexer";
export declare class AppData {
    static pluginOptions: PluginOptions;
    static templateDir: string;
    static templateExt: string;
    static pluginDir: string;
    static pluginId: string;
    static pluginVersion: string;
    static pluginPackage: PackageData;
    static projectId: string;
    static projectDir: string;
    static projectUmiDir: string;
    static projectPackage: PackageData;
    static projectRuntimePath: string;
    static runtimeExports: string[];
    static initAppData(pluginOptions: PluginOptions): Promise<void>;
    static getTemplatePath(name: string): string;
    static getProjectUmiPath(name: string): string;
    static getRuntimeExports(): readonly string[];
    static parseModuleSync(opts: {
        content: string;
        filePath: string;
    }): readonly [imports: readonly esModuleLexer.ImportSpecifier[], exports: readonly string[], facade: boolean];
}

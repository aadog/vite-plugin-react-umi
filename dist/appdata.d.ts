import { IPluginOptions } from "./types";
import { PackageData } from "vite";
export declare class AppData {
    static pluginOptions: IPluginOptions;
    static templateDir: string;
    static templateExt: string;
    static pluginDir: string;
    static pluginName: string;
    static pluginVersion: string;
    static pluginPackage: PackageData;
    static projectName: string;
    static projectDir: string;
    static projectUmiDir: string;
    static projectPackage: PackageData;
    static projectRuntimePath: string;
    static runtimeExports: string[];
    static umiConfig: string;
    static generateFiles(): Promise<void>;
    static loadUmiConfig(): Promise<void>;
    static initAppData(pluginOptions: IPluginOptions): Error;
    static getTemplatePath(name: string): string;
    static getProjectUmiPath(name: string): string;
}

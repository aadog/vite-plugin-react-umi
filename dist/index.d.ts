import { Plugin } from "vite";
import { IPluginOptions, IUmiConfig } from "./types";
export declare function defineUmi(umiConfig: IUmiConfig): IUmiConfig;
export declare function createUmi(options?: IPluginOptions): Plugin[];
export * from './types';

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppData = void 0;
const path_1 = __importDefault(require("path"));
const vite_1 = require("vite");
const pkginfo_1 = __importDefault(require("pkginfo"));
const esModuleLexer = __importStar(require("es-module-lexer"));
const fs = __importStar(require("fs"));
const template_1 = require("./template");
class AppData {
    static pluginOptions;
    static templateDir;
    static templateExt;
    static pluginDir;
    static pluginName;
    static pluginVersion;
    static pluginPackage;
    static projectName;
    static projectDir;
    static projectUmiDir;
    static projectPackage;
    static projectRuntimePath;
    static runtimeExports;
    static umiConfig;
    static async generateFiles() {
        try {
            await AppData.loadUmiConfig();
            await (0, vite_1.transformWithEsbuild)(this.umiConfig, path_1.default.join(this.projectDir, "umiConfig.tsx"));
            template_1.template.renderToProjectUmiFile("appData", ".tsx");
            template_1.template.renderToProjectUmiFile("types");
            template_1.template.renderToProjectUmiFile("umiConfig", ".tsx");
            template_1.template.renderToProjectUmiFile("request");
            template_1.template.renderToProjectUmiFile("history");
            template_1.template.renderToProjectUmiFile("UmiApp", ".tsx");
            template_1.template.renderToProjectUmiFile("index");
            console.log(`  ${AppData.pluginName} complete`);
        }
        catch (err) {
            console.log(err);
        }
    }
    static async loadUmiConfig() {
        await esModuleLexer.init.then(() => {
            let umiConfig = fs.readFileSync(path_1.default.join(this.projectDir, "umiConfig.tsx"), { encoding: 'utf-8', flag: 'r' });
            const [imports, _] = esModuleLexer.parse(umiConfig);
            imports.map((item) => {
                if (item.n.startsWith("./")) {
                    const fixPath = item.n.replace(RegExp("./"), "../../");
                    umiConfig = umiConfig.replace(RegExp(item.n, "g"), fixPath);
                }
                else if (item.n.includes(this.pluginName)) {
                    const fixPath = item.n.replace(RegExp(`${this.pluginName}`, "g"), "./types");
                    umiConfig = umiConfig.replace(RegExp(item.n, "g"), fixPath);
                }
            });
            this.umiConfig = umiConfig;
        });
    }
    static initAppData(pluginOptions) {
        this.pluginOptions = pluginOptions;
        const findPackage = pkginfo_1.default.read(module);
        this.pluginPackage = (0, vite_1.resolvePackageData)(findPackage.package.name, ".");
        this.pluginName = this.pluginPackage.data.name;
        this.pluginDir = this.pluginPackage.dir;
        this.pluginVersion = this.pluginPackage.data.version;
        this.projectPackage = (0, vite_1.resolvePackageData)(".", ".");
        this.projectName = this.projectPackage.data.name;
        this.projectDir = this.projectPackage.dir;
        this.projectUmiDir = path_1.default.join(this.projectDir, `./src/${pluginOptions.tempDir}`);
        this.templateDir = path_1.default.join(AppData.pluginDir, "files");
        this.templateExt = ".tpl";
        this.runtimeExports = [];
        if (!fs.existsSync(path_1.default.join(this.projectDir, "umiConfig.tsx"))) {
            return Error("配置文件不存在:umiConfig.tsx");
        }
        this.loadUmiConfig();
        return null;
    }
    static getTemplatePath(name) {
        return path_1.default.join(this.templateDir, name);
    }
    static getProjectUmiPath(name) {
        return path_1.default.join(this.projectUmiDir, name);
    }
}
exports.AppData = AppData;
//# sourceMappingURL=appdata.js.map
import {IPluginOptions} from "./types";
import path from "path";
import {PackageData, resolvePackageData, transformWithEsbuild} from "vite";
import pkgInfo from "pkginfo";
import * as esModuleLexer from "es-module-lexer";
import esbuild from 'esbuild'
import * as fs from "fs";
import {template} from "./template";

export class AppData {
    static pluginOptions: IPluginOptions
    static templateDir: string
    static templateExt: string

    static pluginDir: string
    static pluginName: string
    static pluginVersion: string

    static pluginPackage: PackageData
    static projectName: string
    static projectDir: string
    static projectUmiDir: string
    static projectPackage: PackageData
    static projectRuntimePath: string
    static runtimeExports: string[]

    static umiConfig: string


    static async generateFiles() {
        try {
            await AppData.loadUmiConfig()
            await transformWithEsbuild(this.umiConfig, path.join(this.projectDir, "umiConfig.tsx"))
            template.renderToProjectUmiFile("appData", ".tsx")
            template.renderToProjectUmiFile("types")
            template.renderToProjectUmiFile("umiConfig", ".tsx",)
            template.renderToProjectUmiFile("request")
            template.renderToProjectUmiFile("history")
            template.renderToProjectUmiFile("models/@@initialState",".tsx")
            template.renderToProjectUmiFile("model/index",".tsx")
            template.renderToProjectUmiFile("model/runtime",".tsx")
            template.renderToProjectUmiFile("access/context")
            template.renderToProjectUmiFile("access/index")
            template.renderToProjectUmiFile("access/runtime",".tsx")
            template.renderToProjectUmiFile("UmiAppContext", ".tsx")
            template.renderToProjectUmiFile("RouteContext",".tsx")
            template.renderToProjectUmiFile("UmiApp", ".tsx")
            template.renderToProjectUmiFile("index")
            console.log(`  ${AppData.pluginName} complete`)
        } catch (err) {
            console.log(err)
        }
    }

    static async loadUmiConfig() {
        await esModuleLexer.init.then(() => {
            let umiConfig = fs.readFileSync(path.join(this.projectDir, "umiConfig.tsx"), {encoding: 'utf-8', flag: 'r'})
            const [imports, _] = esModuleLexer.parse(esbuild.transformSync(umiConfig,{loader:'jsx'}).code)
            imports.map((item) => {
                if (item.n.startsWith("./")) {
                    const fixPath = item.n.replace(RegExp("./",), "../../")
                    umiConfig = umiConfig.replace(RegExp(item.n ), fixPath)
                } else if (item.n.includes(this.pluginName)) {
                    const fixPath = item.n.replace(RegExp(`${this.pluginName}`, "g"), "./types")
                    umiConfig = umiConfig.replace(RegExp(item.n), fixPath)
                }
            })
            this.umiConfig = umiConfig
        })
    }

    static initAppData(pluginOptions: IPluginOptions): Error {
        this.pluginOptions = pluginOptions
        const findPackage = pkgInfo.read(module)
        this.pluginPackage = resolvePackageData(findPackage.package.name, ".")
        this.pluginName = this.pluginPackage.data.name
        this.pluginDir = this.pluginPackage.dir
        this.pluginVersion = this.pluginPackage.data.version

        this.projectPackage = resolvePackageData(".", ".")
        this.projectName = this.projectPackage.data.name
        this.projectDir = this.projectPackage.dir
        this.projectUmiDir = path.join(this.projectDir, `./src/${pluginOptions.tempDir}`)
        this.templateDir = path.join(AppData.pluginDir, "files")
        this.templateExt = ".tpl"
        this.runtimeExports = []


        if (!fs.existsSync(path.join(this.projectDir, "umiConfig.tsx"))) {
            return Error("?????????????????????:umiConfig.tsx")
        }
        this.loadUmiConfig()


        return null
    }

    static getTemplatePath(name: string) {
        return path.join(this.templateDir, name)
    }

    static getProjectUmiPath(name: string) {
        return path.join(this.projectUmiDir, name)
    }
}

import {PluginOptions} from "./types";
import path from "path";
import {PackageData, resolvePackageData} from "vite";
import pkgInfo from "pkginfo";
import {Loader, transformSync} from "esbuild";
import * as esModuleLexer from "es-module-lexer";
import {readFileSync} from "fs";

export class AppData{
    static pluginOptions:PluginOptions
    static templateDir:string
    static templateExt:string

    static pluginDir:string
    static pluginId:string
    static pluginVersion:string

    static pluginPackage:PackageData
    static projectId:string
    static projectDir:string
    static projectUmiDir:string
    static projectPackage:PackageData
    static projectRuntimePath:string
    static runtimeExports:string[]

    static async initAppData(pluginOptions: PluginOptions) {
        this.pluginOptions = pluginOptions
        const findPackage = pkgInfo.read(module)
        this.pluginPackage = resolvePackageData(findPackage.package.name, ".")
        this.pluginId = this.pluginPackage.data.name
        this.pluginDir = this.pluginPackage.dir
        this.pluginVersion=this.pluginPackage.data.version

        this.projectPackage = resolvePackageData(".", ".")
        this.projectId = this.projectPackage.data.name
        this.projectDir = this.projectPackage.dir
        this.projectUmiDir = path.join(this.projectDir, "src/.umi")
        this.templateDir=path.join(AppData.pluginDir,"files")
        this.templateExt=".tpl"
        this.projectRuntimePath = path.join(this.projectDir, this.pluginOptions.runtime)
        this.runtimeExports=[]
        esModuleLexer.init.then(()=>{
            this.getRuntimeExports()
        })
    }
    static getTemplatePath(name:string){
        return path.join(this.templateDir,name)
    }
    static getProjectUmiPath(name:string){
        return path.join(this.projectUmiDir,name)
    }
    static getRuntimeExports(){
        const [_,exports]=this.parseModuleSync({content:readFileSync(this.projectRuntimePath,'utf-8'),filePath:this.projectRuntimePath})
        if(!exports){
            return
        }
        for (const exp of exports) {
            this.runtimeExports.push(exp)
        }
        return exports
    }
    static parseModuleSync(opts: { content: string; filePath: string }) {
        let content = opts.content;
        if (opts.filePath.endsWith('.tsx') || opts.filePath.endsWith('.jsx')) {
            content = transformSync(content, {
                loader: path.extname(opts.filePath).slice(1) as Loader,
                format: 'esm',
            }).code;
        }
        return esModuleLexer.parse(content,"test");
    }
}

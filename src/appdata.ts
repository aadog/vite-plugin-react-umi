import {IPluginOptions} from "./types";
import path from "path";
import {PackageData, resolvePackageData} from "vite";
import pkgInfo from "pkginfo";
import {Loader, transformSync} from "esbuild";
import * as esModuleLexer from "es-module-lexer";
import {readFileSync} from "fs";
import * as fs from "fs";

export class AppData{
    static pluginOptions:IPluginOptions
    static templateDir:string
    static templateExt:string

    static pluginDir:string
    static pluginName:string
    static pluginVersion:string

    static pluginPackage:PackageData
    static projectName:string
    static projectDir:string
    static projectUmiDir:string
    static projectPackage:PackageData
    static projectRuntimePath:string
    static runtimeExports:string[]

    static umiConfig:string

    static initAppData(pluginOptions: IPluginOptions):Error{
        this.pluginOptions = pluginOptions
        const findPackage = pkgInfo.read(module)
        this.pluginPackage = resolvePackageData(findPackage.package.name, ".")
        this.pluginName = this.pluginPackage.data.name
        this.pluginDir = this.pluginPackage.dir
        this.pluginVersion=this.pluginPackage.data.version

        this.projectPackage = resolvePackageData(".", ".")
        this.projectName = this.projectPackage.data.name
        this.projectDir = this.projectPackage.dir
        this.projectUmiDir = path.join(this.projectDir, "src/.umi")
        this.templateDir=path.join(AppData.pluginDir,"files")
        this.templateExt=".tpl"
        this.projectRuntimePath = path.join(this.projectDir,this.pluginOptions.runtime)
        this.runtimeExports=[]


        if(!fs.existsSync(path.join(this.projectDir,"umiConfig.tsx"))){
            return Error("配置文件不存在:umi.config.tsx")
        }
        esModuleLexer.init.then(()=>{
            let umiConfig=fs.readFileSync(path.join(this.projectDir,"umiConfig.tsx"),'utf-8')
            const [imports,_]=esModuleLexer.parse(umiConfig)
            imports.map((item)=>{
                if(item.n.startsWith("./")){
                    const fixPath=item.n.replaceAll("./","../../")
                    umiConfig=umiConfig.replaceAll(item.n,fixPath)
                }
            })
            this.umiConfig=umiConfig
            this.getRuntimeExports()
        })



        return null
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

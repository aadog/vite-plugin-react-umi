import {IPluginOptions} from "./types";
import path from "path";
import {PackageData, resolvePackageData, transformWithEsbuild} from "vite";
import pkgInfo from "pkginfo";
import * as esModuleLexer from "es-module-lexer";
import * as fs from "fs";
import {template} from "./template";

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


    static generateFiles(){
        AppData.loadUmiConfig()
        transformWithEsbuild(this.umiConfig,path.join(this.projectDir,"umiConfig.tsx")).then((result)=>{
            console.log(`  ${AppData.pluginName} updating...`)
            template.renderToProjectUmiFile("appData",".tsx")
            template.renderToProjectUmiFile("types")
            template.renderToProjectUmiFile("umiConfig", ".tsx",)
            template.renderToProjectUmiFile("request")
            template.renderToProjectUmiFile("history")
            template.renderToProjectUmiFile("UmiApp", ".tsx")
            template.renderToProjectUmiFile("index")
            console.log(`  ${AppData.pluginName} complete`)
        }).catch((err)=>{
            console.log(err)
        })
    }
    static loadUmiConfig(){
        let umiConfig=fs.readFileSync(path.join(this.projectDir,"umiConfig.tsx"),{encoding:'utf-8',flag:'r'})
        const [imports,_]=esModuleLexer.parse(umiConfig)
        imports.map((item)=>{
            if(item.n.startsWith("./")){
                const fixPath=item.n.replace(RegExp("./",),"../../")
                umiConfig=umiConfig.replace(RegExp(item.n,"g"),fixPath)
            }else if(item.n.includes(this.pluginName)){
                const fixPath=item.n.replace(RegExp(`${this.pluginName}`,"g"),"./types")
                umiConfig=umiConfig.replace(RegExp(item.n,"g"),fixPath)
            }
        })
        this.umiConfig=umiConfig
    }

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
        this.projectUmiDir = path.join(this.projectDir, `./src/${pluginOptions.tempDir}`)
        this.templateDir=path.join(AppData.pluginDir,"files")
        this.templateExt=".tpl"
        this.runtimeExports=[]


        if(!fs.existsSync(path.join(this.projectDir,"umiConfig.tsx"))){
            return Error("配置文件不存在:umiConfig.tsx")
        }
        esModuleLexer.init.then(()=>{
            this.loadUmiConfig()
        })



        return null
    }
    static getTemplatePath(name:string){
        return path.join(this.templateDir,name)
    }
    static getProjectUmiPath(name:string){
        return path.join(this.projectUmiDir,name)
    }
}

import * as fs from "fs";
import {resolvePackageData} from "vite";
import {AppData} from "./appdata";
import artTemplate from "art-template";
import path from "path";

export class template{
    static templateRenders:{}={}
    static registerBuiltin(){
        this.registerImports("absPkgPath",function (pkgName:string) {
                return resolvePackageData(pkgName,".").dir.replaceAll("\\","/")
            })
        this.registerImports("JSON.stringify",function (...v: any){
            return JSON.stringify(v)
        })
        this.registerImports("RegExp",function(e,p){
            return new RegExp(e,p)
        })
        this.registerImports("ListSystemModels",function () {
            const r=[]
            const ls=fs.readdirSync(path.join(AppData.projectUmiDir,"models"))
            ls.map((item)=>{
                r.push(item.replace(/.tsx$/g,""))
            })
            return r
        })
    }
    static registerImports(name: string, obj: any):void{
        artTemplate.defaults.imports[name]=obj
    }
    static render(templateName:string,data?:Record<string, any>):string{
        data={
            ...data,
            AppData:{...AppData}
        }

        if(templateName.endsWith(AppData.templateExt)==false){
            templateName=`${templateName}${AppData.templateExt}`
        }
        if(this.templateRenders[templateName]){
            return this.templateRenders[templateName](data)
        }
        const templatePath=AppData.getTemplatePath(templateName)

        const templateRender=artTemplate.compile(
            fs.readFileSync(templatePath,'utf-8'),
            {noEscape:true}
        )
        this.templateRenders[templateName]=templateRender

        return templateRender(data)
    }

    static renderToProjectUmiFile(templateName:string,ext:string=".ts",data?:Record<string, any>){
        if(!fs.existsSync(AppData.projectUmiDir)){
            fs.mkdirSync(AppData.projectUmiDir,{recursive:true})
        }
        const absPath=path.join(AppData.projectUmiDir,templateName)
        if(!fs.existsSync(path.dirname(absPath))){
            fs.mkdirSync(path.dirname(absPath),{recursive:true})
        }

        const str=this.render(templateName,data)
        if(templateName.endsWith(AppData.templateExt)){
            templateName.replaceAll(AppData.templateExt,"")
        }
        templateName=`${templateName}${ext}`
        fs.writeFileSync(AppData.getProjectUmiPath(templateName),str,{})
    }
}

template.registerBuiltin()

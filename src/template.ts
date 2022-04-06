import * as fs from "fs";
import {resolvePackageData} from "vite";
import {AppData} from "./appdata";
import artTemplate from "art-template";

export class template{
    static templateRenders:{}={}
    static registerBuiltin(){
        this.registerImports("absPkgPath",function (pkgName:string) {
                return resolvePackageData(pkgName,".").dir.replaceAll("\\","/")
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
    static renderToProjectUmi(templateName:string,data?:Record<string, any>){
        if(!fs.existsSync(AppData.projectUmiDir)){
            fs.mkdirSync(AppData.projectUmiDir,{recursive:true})
        }

        const str=this.render(templateName,data)
        if(templateName.endsWith(AppData.templateExt)){
            templateName.replaceAll(AppData.templateExt,"")
        }
        templateName=`${templateName}.ts`
        fs.writeFileSync(AppData.getProjectUmiPath(templateName),str,{})
    }
}

template.registerBuiltin()

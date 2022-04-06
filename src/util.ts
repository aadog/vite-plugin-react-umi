import path from "path";
import mustache from "mustache";
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from "fs";
import pkgInfo from "pkginfo";
import {PackageData, resolvePackageData} from "vite";
import {Loader, transformSync} from "esbuild";
import {parse} from "es-module-lexer";

//获取运行时导出
export function getAppRuntimeExports(runtime: string): string[]{
    const runtimePath=path.join(getPackageData(".").dir,runtime)
    const [_,exports]=parseModuleSync({content: readFileSync(runtimePath, 'utf-8'), path: runtimePath})
    return [...exports]
}
//解析模块 imports和exports
export function parseModuleSync(opts: { content: string; path: string }) {
    let content = opts.content;
    if (opts.path.endsWith('.tsx') || opts.path.endsWith('.jsx')) {
        content = transformSync(content, {
            loader: path.extname(opts.path).slice(1) as Loader,
            format: 'esm',
        }).code;
    }
    return parse(content);
}

export function getPackageData(id:string):PackageData| null{
    return resolvePackageData(id,".")
}

export function getPluginPackageId():string{
    return pkgInfo.read(module).package.name
}



export function umiDir():string|undefined{
    return path.join(getPackageData(".").dir,"src/.umi")
}



export function generateFile(name:string,data:any){
    if(!existsSync(umiDir())){
        mkdirSync(umiDir(),{recursive:true})
    }
    writeFileSync(path.join(umiDir(), name), templateFileRender(
        `./files/${name}`, data,
    ))
}
export function rmGenerateFile(name:string){
    rmSync(path.join(umiDir(), name),{force:true})
}
export function templateFileRender(templatePath:string,data:any):string{
    return mustache.render(
        readFileSync(path.join(getPackageData(getPluginPackageId()).dir,templatePath)).toString(),
        data,
        null,{
            escape:(value)=>value,
        }
    )
}

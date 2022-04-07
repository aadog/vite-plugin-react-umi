type HistoryOption={
    type: string
    basename: string
}

export class AppData {
    static projectName:string
    static pluginName:string
    static pluginVersion:string
    static history:HistoryOption
}

AppData.projectName=`<%=AppData.projectName%>`
AppData.pluginName=`<%=AppData.pluginName%>`
AppData.pluginVersion=`<%=AppData.pluginVersion%>`
AppData.history={basename:"",type:""}
AppData.history.basename=`<%=AppData.pluginOptions.history.basename%>`
AppData.history.type=`<%=AppData.pluginOptions.history.type%>`

//appdata
export function useAppData():AppData{
    return AppData
}

import { ConfigEnv, UserConfig } from "vite";
export default class Antd {
    static config(config: UserConfig, env: ConfigEnv): UserConfig;
    static transform(code: string, id: string, options?: {
        ssr?: boolean;
    }): string;
}

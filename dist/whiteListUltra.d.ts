/// <reference path="../../Common/dts/HelperLib-master/src/index.d.ts" />
declare function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: {
    option: string;
    method: string;
    player: string;
    time: string;
    reason: string;
}): void;
declare class fileSystem {
    configPath: string;
    private getInfoClass;
    editPlayerInfo(option: 'get', playerData: string | TPlayerData): TPlayerData | null;
    editPlayerInfo(option: 'set' | 'delete', playerData: string | TPlayerData): boolean;
    getListAll(isWhiteList?: boolean, isAll?: boolean, outp?: CommandOutput): string;
    readMessageConfigFile(): TMessageConfig;
}
declare var GPlugin: TPluginConfig;
declare var ver: number[];
declare var info: {
    name: string;
    author: string;
    license: string;
    projectUrl: string;
    issueReportUrl: string;
    configPath: string;
    version: string;
    versionTime: string;
    versionStatus: string;
};
type TPluginConfig = {
    info: {
        name: string;
        author: string;
        license: string;
        projectUrl: string;
        issueReportUrl: string;
        configPath: string;
        version: string;
        versionTime: string;
        versionStatus: string;
    };
    fileSystem: fileSystem;
    config?: TMessageConfig;
};
type TMessageConfig = {
    eventMessages: {
        whitelist: {
            on_timed_out: string;
            on_have_no_permission: string;
        };
        blacklist: {
            on_default_reason_noTime: string;
            on_default_reason_hasTime: string;
        };
    };
};
type TPlayerData = {
    playerName: string;
    xuid: string;
    uuid: string;
    whited: boolean;
    unwhiteTime: number;
    banned: boolean;
    bannedTime: number;
    bannedResult: string;
};
declare var pluginInfo: {
    name: string;
    author: string;
    license: string;
    projectUrl: string;
    issueReportUrl: string;
    configPath: string;
    version: string;
    versionTime: string;
    versionStatus: string;
};
declare function playerProc(Player: Player): void;

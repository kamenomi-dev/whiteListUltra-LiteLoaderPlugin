/// <reference path="../Common/dts/HelperLib-master/src/index.d.ts" />
declare function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: {
    A_Arg: string;
    B_Arg: string;
    player: string;
    time: string;
    reason: string;
}): void;
declare class fileSystem {
    readonly fileConfigPath = ".\\plugins\\whiteListUltra\\";
    readonly serverProtocolVersion: number;
    private getInfoClass;
    addPlayerInfo(playerInfo: commonPlayerInfo): boolean;
    removePlayerInfo(playerRealName: string): boolean;
    getPlayerInfo(playerRealName: string): commonPlayerInfo | null;
    getListAll(isWhiteList?: boolean, isAll?: boolean, outp?: CommandOutput): string;
    readConfigFile(): whiteListUltraConfig;
}
declare const pluginName = "WhiteListUltra";
declare const pluginAuthor = "Huang Youzhen";
declare const pluginLicense = "Apache 2.0 License";
declare const pluginConfigPath = ".\\plugins\\whiteListUltra\\";
declare const pluginSubmitTime = "20230212";
declare const pluginVerison = "2.1.1";
declare const pluginVersionStatus = "Release";
declare var globalVariable: {
    whiteListUltra: {
        fileSystem: fileSystem;
        config: whiteListUltraConfig;
    };
};
type whiteListUltraConfig = {
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
type commonPlayerInfo = {
    playerName: string;
    xuid: string;
    uuid: string;
    whited: boolean;
    unwhiteTime: number;
    banned: boolean;
    bannedTime: number;
    bannedResult: string;
};
declare function playerProc(Player: Player): void;
declare class dataSystem {
    readonly configDefault: any;
    initDatabase(resMission?: boolean): DBSession | boolean;
    getConfig(): whiteListUltraConfig;
    addPlayer(Player: Player, UnixStamp: number): void;
    setPlayer(data: commonPlayerInfo): void;
}

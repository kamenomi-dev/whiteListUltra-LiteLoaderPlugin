/// <reference path="../Common/dts/HelperLib-master/src/index.d.ts" />
declare class fileSystem {
    readonly serverProtocolVersion: number;
    addPlayerInfo(playerInfo: commonPlayerInfo): boolean;
    removePlayerInfo(playerRealName: string): boolean;
    getPlayerInfo(playerRealName: string): commonPlayerInfo | null;
    readConfigFile(): whiteListUltraConfig;
}
declare var globalVariable: {
    whiteListUltra: {
        fileSystem: fileSystem;
        config: whiteListUltraConfig;
        command: Command;
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
declare class dataSystem {
    readonly configDefault: any;
    initDatabase(resMission?: boolean): DBSession | boolean;
    getConfig(): whiteListUltraConfig;
    addPlayer(Player: Player, UnixStamp: number): void;
    setPlayer(data: commonPlayerInfo): void;
}

"use strict";
mc.listen('onServerStarted', () => {
    logger.setTitle('whiteListUltra');
    logger.log('Successfully running the server!');
});
class fileSystem {
    serverProtocolVersion = mc.getServerProtocolVersion();
    addPlayerInfo(playerInfo) {
        var infoJsonFile = new JsonConfigFile(`.\\whiteListUltra\\playerInfo.json`);
        var procResult = infoJsonFile.set(playerInfo.playerName, playerInfo);
        infoJsonFile.close();
        return procResult;
    }
    ;
    removePlayerInfo(playerRealName) {
        var infoJsonFile = new JsonConfigFile(`.\\whiteListUltra\\playerInfo.json`);
        var procResult = infoJsonFile.delete(playerRealName);
        infoJsonFile.close();
        return procResult;
    }
    ;
    getPlayerInfo(playerRealName) {
        var infoJsonFile = new JsonConfigFile(`.\\whiteListUltra\\playerInfo.json`);
        var procResult = infoJsonFile.get(playerRealName);
        infoJsonFile.close();
        return procResult;
    }
    ;
    readConfigFile() {
        var configJsonFile = new JsonConfigFile('.\\whiteListUltra\\config.json', JSON.stringify({
            eventMessages: {
                whitelist: {
                    on_timed_out: "您的白名单权限已过期！",
                    on_have_no_permission: "您还没有获得白名单权限！"
                },
                blacklist: {
                    on_default_reason_noTime: "您处于黑名单当中！",
                    on_default_reason_hasTime: "您处于黑名单当中！距离解封还有${Time}。"
                }
            }
        }));
        var procResult = JSON.parse(configJsonFile.read());
        configJsonFile.close();
        return procResult;
    }
    ;
}
;
if (ll.major < 2 && ll.minor < 9)
    logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
ll.registerPlugin("whiteListUltra", "A Ultra Whitelist Helper For Minecraft Bedrock Edition", [1, 0, 0], {
    License: 'Apache 2.0 License',
    copyright: 'copyright (c) Creakler'
});
var globalVariable = {
    whiteListUltra: {
        fileSystem: new fileSystem(),
        config: (new fileSystem().readConfigFile()),
        command: {}
    }
};
mc.listen('onPreJoin', (Player) => {
    var wl = globalVariable.whiteListUltra;
    var curTick = (new Date()).valueOf();
    var playerInfo = wl.fileSystem.getPlayerInfo(Player.realName);
    var firstJoin = typeof playerInfo == 'undefined';
    if (firstJoin) {
        logger.log(globalVariable.whiteListUltra.fileSystem.addPlayerInfo({
            playerName: Player.realName,
            xuid: Player.xuid,
            uuid: Player.uuid,
            whited: false,
            unwhiteTime: -1,
            banned: false,
            bannedTime: 0,
            bannedResult: ''
        }));
    }
    ;
    if (!playerInfo.banned && (firstJoin || !playerInfo.whited)) {
        logger.info(`${Player.realName} {${Player.uuid}} 玩家没有白名单权限进入服务器!`);
        Player.disconnect(wl.config.eventMessages.whitelist.on_have_no_permission);
        return;
    }
    ;
    if (playerInfo.whited && playerInfo.unwhiteTime < curTick && playerInfo.unwhiteTime != 0) {
        logger.info(`${Player.realName} {${Player.uuid}} 玩家白名单过期!`);
        playerInfo.unwhiteTime = 0;
        playerInfo.whited = false;
        globalVariable.whiteListUltra.fileSystem.addPlayerInfo(playerInfo);
        Player.disconnect(wl.config.eventMessages.whitelist.on_timed_out);
        return;
    }
    ;
    if (playerInfo.banned) {
        if (playerInfo.bannedTime > curTick) {
            logger.info(`${Player.realName} {${Player.uuid}} 玩家正在被封禁!封禁至${new Date(playerInfo.bannedTime - curTick).toDateString()}`);
            Player.disconnect(wl.config.eventMessages.blacklist.on_default_reason_hasTime
                .replace('${time}', new Date(playerInfo.bannedTime - curTick).toDateString()));
            return;
        }
        else if (playerInfo.bannedTime == 0) {
            var bannedReason = playerInfo.bannedResult || '无';
            logger.info(`${Player.realName} {${Player.uuid}} 玩家被永久封禁! 理由: ${bannedReason}`);
            Player.disconnect(wl.config.eventMessages.blacklist.on_default_reason_noTime + '\n理由: ' + bannedReason);
            return;
        }
        ;
    }
    ;
    logger.log('debuuggg', playerInfo.banned, playerInfo.bannedTime);
});
class dataSystem {
    configDefault = {
        "data": {
            "config": {
                "useDatabase": false
            },
            "eventMessages": {
                "whitelist": {
                    "on_timed_out": "您的白名单权限已过期！",
                    "on_have_no_permission": "您还没有获得白名单权限！"
                },
                "blacklist": {
                    "on_default_reason_noTime": "您处于黑名单当中！",
                    "on_default_reason_hasTime": "您处于黑名单当中！距离解封还有${Time}。"
                }
            }
        }
    };
    initDatabase(resMission = false) {
        var dataBaseMisson;
        dataBaseMisson = new DBSession('file:///./whiteListUltra/player.database.db');
        dataBaseMisson.exec(`
    CREATE TABLE IF NOT EXISTS "playerInfo" (
      Player        CHAR(64) NOT NULL,
      Xuid          CHAR(16) NOT NULL,
      Uuid          CHAR(64) NOT NULL,
      Whited        TINYINT  NOT NULL,
      unwhiteTime   INTEGER  NOT NULL,
      banned        TINYINT  NOT NULL,
      bannedTime    INTEGER  NOT NULL,
      bannedResult  TEXT     NOT NULL
    );`);
        if (resMission)
            return dataBaseMisson;
        return dataBaseMisson.close();
    }
    ;
    getConfig() {
        var configFile = new JsonConfigFile('./whiteListUltra/config.json', this.configDefault);
        var configData = configFile.get('data');
        configFile.close();
        return configData;
    }
    ;
    addPlayer(Player, UnixStamp) {
        var dataMission = this.initDatabase(true);
        if (dataMission.query(`select ifnull((select * from playerInfo where Player = '${Player.realName}' limit 1 ), 0)`).length == 1) {
            var playerInfo = {
                playerName: Player.realName,
                xuid: Player.xuid,
                uuid: Player.uuid,
                whited: true,
                unwhiteTime: UnixStamp,
                banned: false,
                bannedTime: 0,
                bannedResult: ''
            };
        }
        ;
    }
    setPlayer(data) {
        var dataMission = this.initDatabase(true);
        dataMission.execute(`
    UPDATE playerInfo
    SET Player='${data.playerName}'
    SET Xuid='${data.xuid}'
    SET Uuid='${data.uuid}'
    SET Whited='${data.whited ? 1 : 0}'
    SET unwhiteTime='${data.unwhiteTime}'
    SET banned='${data.banned ? 1 : 0}'
    SET bannedTime='${data.bannedTime}'
    SET bannedResult='${data.bannedResult}'
    WHERE Uuid='${data.uuid}';`);
        dataMission.close();
    }
}
//# sourceMappingURL=whiteListUltra.js.map
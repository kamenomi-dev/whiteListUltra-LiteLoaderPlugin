"use strict";
mc.listen('onServerStarted', () => {
    const pluginMainCmd = mc.newCommand('whiteListUltra', 'LiteLoader Plugin Script - whiteListUltra', PermType.GameMasters);
    pluginMainCmd.setAlias('wl');
    pluginMainCmd.setEnum('Lists', ['whitelist', 'blacklist']);
    pluginMainCmd.setEnum('Others', ['listall', 'reload']);
    pluginMainCmd.setEnum('Methods', ['add', 'remove']);
    pluginMainCmd.setEnum('Method', ['list']);
    pluginMainCmd.mandatory('list', ParamType.Enum, 'Lists', 1);
    pluginMainCmd.mandatory('list', ParamType.Enum, 'Others', 1);
    pluginMainCmd.mandatory('method', ParamType.Enum, 'Methods');
    pluginMainCmd.mandatory('method', ParamType.Enum, 'Method');
    pluginMainCmd.overload(['Lists', 'Methods']);
    pluginMainCmd.setCallback((_pluginMainCmd, _ori, out, res) => {
        return true;
    });
    pluginMainCmd.setup();
});
function whiteListUltra_CommandProc(command, caller, resultOutput, args) {
}
;
class fileSystem {
    fileConfigPath = '.\\plugins\\whiteListUltra\\';
    serverProtocolVersion = mc.getServerProtocolVersion();
    addPlayerInfo(playerInfo) {
        var infoJsonFile = new JsonConfigFile(`${this.fileConfigPath}playerInfo.json`);
        var procResult = infoJsonFile.set(playerInfo.playerName, playerInfo);
        infoJsonFile.close();
        return procResult;
    }
    ;
    removePlayerInfo(playerRealName) {
        var infoJsonFile = new JsonConfigFile(`${this.fileConfigPath}playerInfo.json`);
        var procResult = infoJsonFile.delete(playerRealName);
        infoJsonFile.close();
        return procResult;
    }
    ;
    getPlayerInfo(playerRealName) {
        var infoJsonFile = new JsonConfigFile(`${this.fileConfigPath}playerInfo.json`);
        var procResult = infoJsonFile.get(playerRealName);
        infoJsonFile.close();
        return procResult;
    }
    ;
    readConfigFile() {
        var configJsonFile = new JsonConfigFile(`${this.fileConfigPath}config.json`, JSON.stringify({
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
logger.setTitle('WhiteList-Ultra');
if (!ll.requireVersion(2, 9, 0))
    logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
ll.registerPlugin("WhiteListUltra", "A Ultra Whitelist Helper For Minecraft Bedrock Edition", [1, 0, 0], {
    License: 'Apache 2.0 License',
    copyright: 'copyright (c) Creakler'
});
var globalVariable = {
    whiteListUltra: {
        fileSystem: new fileSystem(),
        config: (new fileSystem().readConfigFile()),
    }
};
mc.listen('onServerStarted', () => {
    logger.log('Successfully running the server!');
    logger.log('Powered by Creakler');
});
mc.listen('onPreJoin', (Player) => {
    playerProc(Player);
});
function playerProc(Player) {
    var pluginMessages = globalVariable.whiteListUltra.config.eventMessages;
    var playerInfo = globalVariable.whiteListUltra.fileSystem.getPlayerInfo(Player.realName);
    var isFirstJoin = typeof playerInfo == 'undefined';
    var bannedReason = isFirstJoin ? '无' : playerInfo.bannedResult || '无';
    var currentTick = new Date().valueOf();
    var procResult = 0;
    (function logic() {
        if (isFirstJoin) {
            procResult = globalVariable.whiteListUltra.fileSystem.addPlayerInfo({
                playerName: Player.realName,
                xuid: Player.xuid,
                uuid: Player.uuid,
                whited: false,
                unwhiteTime: 0,
                banned: false,
                bannedTime: 0,
                bannedResult: ''
            }) ? 1 : 0;
        }
        ;
        if (!playerInfo.banned && (isFirstJoin || !playerInfo.whited)) {
            procResult = 2;
            Player.disconnect(pluginMessages.whitelist.on_have_no_permission);
            return;
        }
        ;
        if (playerInfo.whited && playerInfo.unwhiteTime < currentTick && playerInfo.unwhiteTime != 0) {
            procResult = 3;
            playerInfo.unwhiteTime = 0;
            playerInfo.whited = false;
            globalVariable.whiteListUltra.fileSystem.addPlayerInfo(playerInfo);
            Player.disconnect(pluginMessages.whitelist.on_timed_out);
            return;
        }
        ;
        if (playerInfo.banned) {
            if (playerInfo.bannedTime > currentTick) {
                procResult = 4;
                Player
                    .disconnect(pluginMessages.blacklist.on_default_reason_hasTime
                    .replace('{%t}', new Date(playerInfo.bannedTime).toDateString()));
                return;
            }
            else if (playerInfo.bannedTime == 0) {
                procResult = 5;
                Player.disconnect(pluginMessages.blacklist.on_default_reason_noTime
                    + '\n理由: '
                    + bannedReason);
                return;
            }
            ;
        }
        ;
    })();
    {
        let prefixFormat = `${Player.realName} - ${Player.uuid}`;
        let feedback = [
            `${prefixFormat} 成功通过服务器白名单校验。`,
            `${prefixFormat} ${Player.ip} 是一位新来的玩家。`,
            `${prefixFormat} 没有该服务器的白名单权限。`,
            `${prefixFormat} 所持有的白名单权限已过期。`,
            `${prefixFormat} 现处于有时长的白名单封禁。`,
            `${prefixFormat} 现处于服务器白名单封禁中。`
        ];
        logger.log(feedback[procResult]);
        if (procResult >= 5)
            logger.log(`被封禁原因: ${bannedReason}`);
    }
    ;
}
;
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

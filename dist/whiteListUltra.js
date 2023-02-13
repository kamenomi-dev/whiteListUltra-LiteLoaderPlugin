"use strict";
mc.listen('onServerStarted', () => {
    const pluginMainCmd = mc.newCommand('whitelistultra', 'LiteLoader Plugin Script - whiteListUltra', PermType.GameMasters);
    pluginMainCmd.setAlias('wl');
    pluginMainCmd.setEnum('Lists', ['whitelist', 'blacklist']);
    pluginMainCmd.setEnum('Others', ['listall', 'reload', 'delete']);
    pluginMainCmd.setEnum('Methods', ['add', 'remove']);
    pluginMainCmd.setEnum('Method', ['list']);
    pluginMainCmd.mandatory('option', ParamType.Enum, 'Lists', 1);
    pluginMainCmd.mandatory('option', ParamType.Enum, 'Others', 1);
    pluginMainCmd.mandatory('method', ParamType.Enum, 'Methods', 1);
    pluginMainCmd.mandatory('method', ParamType.Enum, 'Method', 1);
    pluginMainCmd.mandatory('player', ParamType.RawText);
    pluginMainCmd.optional('time', ParamType.String);
    pluginMainCmd.optional('reason', ParamType.RawText);
    pluginMainCmd.overload(['Lists', 'Methods']);
    pluginMainCmd.overload(['Lists', 'Methods', 'player', 'time', 'reason']);
    pluginMainCmd.overload(['Lists', 'Method']);
    pluginMainCmd.overload(['Others']);
    pluginMainCmd.setCallback((_cmd, _ori, out, res) => {
        whiteListUltra_CommandProc(_cmd, _ori, out, res);
        return true;
    });
    pluginMainCmd.setup();
});
function whiteListUltra_CommandProc(command, caller, resultOutput, args) {
    var isSuceess = true;
    (() => {
        var isList = args.option == 'whitelist' || args.option == 'blacklist';
        var isDelete = args.option == 'delete';
        var list = isList ? args.option : '';
        var method = !isList ? args.option : args.method;
        var player = isDelete ? args.method : args.player;
        var time = new Date(args.time).valueOf();
        var reason = isList ? args.reason : '';
        if (isList) {
            var playerInfo = GPlugin.fileSystem.editPlayerInfo('get', player);
            var onBlack = false;
            var onWhite = false;
            var onAdd = method == 'add';
            if (method == 'list') {
                var List = GPlugin.fileSystem.getListAll(list == 'whitelist', false, resultOutput);
                isSuceess = !!List;
                return;
            }
            ;
            onWhite = list == 'whitelist' ? onAdd : false;
            onBlack = list == 'blacklist' ? onAdd : false;
            if (list == 'blacklist' && onAdd) {
                mc.getOnlinePlayers().map(player => {
                    player.sendToast('§cWhiteListUltra Ultra 封禁', `§e玩家 §c${player} §e因为 §b${reason == undefined ? '无理由' : reason} §e导致封禁至 §f${args.time == undefined ? '永久' : time} §e! §c希望各位引以为戒`);
                });
            }
            ;
            isSuceess = GPlugin.fileSystem.editPlayerInfo('set', {
                playerName: player,
                xuid: playerInfo.xuid || 'undefined',
                uuid: playerInfo.uuid || 'undefined',
                whited: onWhite,
                unwhiteTime: onWhite ? time : 0,
                banned: onBlack,
                bannedTime: onBlack ? time : 0,
                bannedResult: onBlack ? reason : '无',
            });
            return;
        }
        else {
            if (method == 'delete') {
                isSuceess = GPlugin.fileSystem.editPlayerInfo('delete', player);
                return;
            }
            else if (method == 'listall') {
                isSuceess = !!GPlugin.fileSystem.getListAll(true, true, resultOutput);
                ;
                return;
            }
            else if (method == 'reload') {
                GPlugin.config = GPlugin.fileSystem.readMessageConfigFile();
                return;
            }
            ;
        }
        ;
    })();
    if (!isSuceess) {
        logger.error(`Failed to execute! Command: ${command.name} Args: ${Object.values(args).toString()}`);
    }
    ;
}
;
class fileSystem {
    configPath = '';
    getInfoClass() {
        return new JsonConfigFile(`${this.configPath}playerInfo.json`);
    }
    ;
    editPlayerInfo(option, playerData) {
        var infoJsonFile = this.getInfoClass();
        var procResult;
        if (typeof playerData == 'object') {
            if (option == 'set') {
                procResult = infoJsonFile.set(playerData.playerName, playerData);
            }
            ;
        }
        else {
            if (RegExp(/[\~\`\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\:\"\;\'\<\>\?\,\.\/]+/g).test(playerData))
                return null;
            procResult = eval(`infoJsonFile.${option}('${playerData}')`);
        }
        infoJsonFile.close();
        return procResult;
    }
    ;
    getListAll(isWhiteList = true, isAll, outp) {
        var infoJsonFile = this.getInfoClass();
        var jsonObject = Object.values(JSON.parse(infoJsonFile.read()));
        var resultPlayer = `===${isAll ? 'All' : (isWhiteList ? 'White' : 'Black')}===\n`;
        jsonObject.map(item => {
            var player = item;
            if ((isWhiteList && player.whited) || (!isWhiteList && player.banned) || isAll) {
                resultPlayer += `[${player.playerName}] W: ${player.whited} B: ${player.banned}\n`;
            }
            ;
        });
        infoJsonFile.close();
        resultPlayer += '=== List End ===';
        if (outp)
            resultPlayer.split('\n').map(item => {
                outp.addMessage(item);
            });
        return resultPlayer;
    }
    readMessageConfigFile() {
        var configJsonFile = new JsonConfigFile(`${this.configPath}config.json`, JSON.stringify({
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
var GPlugin;
{
    GPlugin = {
        info: {
            name: 'WhiteListUltra',
            author: 'Huang Youzhen',
            license: 'Apache 2.0 License',
            projectUrl: 'https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin',
            issueReportUrl: 'https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/issues',
            configPath: '.\\plugins\\whiteListUltra\\',
            version: '2.2.1',
            versionTime: '20230214',
            versionStatus: 'AlphaDev'
        },
        fileSystem: new fileSystem()
    };
    GPlugin.fileSystem.configPath = GPlugin.info.configPath;
    GPlugin.config = GPlugin.fileSystem.readMessageConfigFile();
}
;
logger.setTitle('WhiteList-Ultra');
if (!ll.requireVersion(2, 9, 0))
    logger.warn('当前 LiteLoader 版本过低，发生任何错误将不进行修复，请更新至 v2.9.0 或以上');
var ver = GPlugin.info.version.split('.').map(ver => Number(ver));
var info = GPlugin.info;
ll.registerPlugin(info.name, "A Ultra Whitelist Helper For Minecraft Bedrock Edition", [
    ver[0], ver[1], ver[2]
], {
    License: info.license,
    copyright: `copyright (c) ${info.author}`
});
var pluginInfo = GPlugin.info;
logger.log(`
██╗    ██╗██╗  ██╗██╗████████╗███████╗██╗     ██╗███████╗████████╗    ██╗   ██╗██╗  ████████╗██████╗  █████╗ 
██║    ██║██║  ██║██║╚══██╔══╝██╔════╝██║     ██║██╔════╝╚══██╔══╝    ██║   ██║██║  ╚══██╔══╝██╔══██╗██╔══██╗
██║ █╗ ██║███████║██║   ██║   █████╗  ██║     ██║███████╗   ██║       ██║   ██║██║     ██║   ██████╔╝███████║
██║███╗██║██╔══██║██║   ██║   ██╔══╝  ██║     ██║╚════██║   ██║       ██║   ██║██║     ██║   ██╔══██╗██╔══██║
╚███╔███╔╝██║  ██║██║   ██║   ███████╗███████╗██║███████║   ██║       ╚██████╔╝███████╗██║   ██║  ██║██║  ██║
╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
Version - ${pluginInfo.versionTime}.${pluginInfo.version}-WhiteListUltra-${pluginInfo.versionStatus}     Powered by ${pluginInfo.author}     License: ${pluginInfo.license}
Github Project Url: ${pluginInfo.projectUrl}

${pluginInfo.versionStatus == 'AlphaDev' ? `当前版本状态为 AlphaDev 开服测试版本
若发生bug, 请提交至 ${pluginInfo.issueReportUrl}\n` : ''}
`);
mc.listen('onPreJoin', (Player) => {
    playerProc(Player);
});
function playerProc(Player) {
    var messages = GPlugin.config.eventMessages;
    var playerInfo = GPlugin.fileSystem.editPlayerInfo('get', Player.realName);
    var isFirstJoin = playerInfo == null;
    var bannedReason = isFirstJoin ? '无' : playerInfo.bannedResult || '无';
    var currentTime = new Date().valueOf();
    var procResult = 0;
    var isSetBefore = isFirstJoin ? false : playerInfo.uuid == 'undefined' && playerInfo.xuid == playerInfo.uuid;
    ;
    (function logic() {
        if (Player.isOP())
            return;
        if (isSetBefore) {
            playerInfo.xuid = Player.xuid;
            playerInfo.uuid = Player.uuid;
            procResult = Number(GPlugin.fileSystem.editPlayerInfo('set', playerInfo));
        }
        ;
        if (isFirstJoin) {
            procResult = Number(GPlugin.fileSystem.editPlayerInfo('set', {
                playerName: Player.realName,
                xuid: Player.xuid,
                uuid: Player.uuid,
                whited: false,
                unwhiteTime: 0,
                banned: false,
                bannedTime: 0,
                bannedResult: ''
            }));
            Player.disconnect(messages.whitelist.on_have_no_permission);
            return;
        }
        ;
        if (!playerInfo.banned && (isFirstJoin || !playerInfo.whited)) {
            procResult = 2;
            Player.disconnect(messages.whitelist.on_have_no_permission);
            return;
        }
        ;
        if (playerInfo.whited && playerInfo.unwhiteTime < currentTime && playerInfo.unwhiteTime != 0) {
            procResult = 3;
            playerInfo.unwhiteTime = 0;
            playerInfo.whited = false;
            GPlugin.fileSystem.editPlayerInfo('set', playerInfo);
            Player.disconnect(messages.whitelist.on_timed_out);
            return;
        }
        ;
        if (playerInfo.banned) {
            if (playerInfo.bannedTime > currentTime) {
                procResult = 4;
                Player
                    .disconnect(messages.blacklist.on_default_reason_hasTime
                    .replace('{%t}', new Date(playerInfo.bannedTime).toDateString()));
                return;
            }
            else if (playerInfo.bannedTime == 0) {
                procResult = 5;
                Player.disconnect(`${messages.blacklist.on_default_reason_noTime}
理由: ${bannedReason}`);
                return;
            }
            ;
        }
        ;
    })();
    {
        let feedback = [
            '成功通过服务器白名单校验。',
            '是一位新来的玩家。',
            '没有该服务器的白名单权限。',
            '所持有的白名单权限已过期。',
            '现处于有时长的白名单封禁。',
            '现处于服务器白名单封禁中。'
        ];
        logger.log(`${Player.realName} - ${Player.uuid} ${feedback[procResult]}`);
        if (procResult >= 5)
            logger.log(`玩家被封禁原因: ${bannedReason}`);
    }
    ;
}
;

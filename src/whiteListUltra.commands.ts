mc.listen('onServerStarted', () => {
  // (Overload 1) /whiteListUltra <whitelist:blacklist> <add :remove> player: <player> time: [time] reason: [reason]
  // (Overload 2) /whiteListUltra <whitelist:blacklist> <list>
  // (Overload 3) /whiteListUltra delete <player>
  // (Overload 4) /whiteListUltra <listall  :reload>

  logger.log(`
██╗    ██╗██╗  ██╗██╗████████╗███████╗██╗     ██╗███████╗████████╗    ██╗   ██╗██╗  ████████╗██████╗  █████╗ 
██║    ██║██║  ██║██║╚══██╔══╝██╔════╝██║     ██║██╔════╝╚══██╔══╝    ██║   ██║██║  ╚══██╔══╝██╔══██╗██╔══██╗
██║ █╗ ██║███████║██║   ██║   █████╗  ██║     ██║███████╗   ██║       ██║   ██║██║     ██║   ██████╔╝███████║
██║███╗██║██╔══██║██║   ██║   ██╔══╝  ██║     ██║╚════██║   ██║       ██║   ██║██║     ██║   ██╔══██╗██╔══██║
╚███╔███╔╝██║  ██║██║   ██║   ███████╗███████╗██║███████║   ██║       ╚██████╔╝███████╗██║   ██║  ██║██║  ██║
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
version - 20230212.2.1.0-WhiteListUltra-release     Powered by Huang Youzhen     License: Apache 2.0 License.
  `);
  const pluginMainCmd = mc.newCommand('whitelistultra', 'LiteLoader Plugin Script - whiteListUltra', PermType.GameMasters);
  pluginMainCmd.setAlias('wl');
  pluginMainCmd.setEnum('Lists', ['whitelist', 'blacklist']);
  pluginMainCmd.setEnum('Others', ['listall', 'reload', 'delete']);
  pluginMainCmd.setEnum('Methods', ['add', 'remove']);
  pluginMainCmd.setEnum('Method', ['list']);
  pluginMainCmd.mandatory('A_Arg', ParamType.Enum, 'Lists', 1); // whitelist, blacklist | listall, reload | delete
  pluginMainCmd.mandatory('A_Arg', ParamType.Enum, 'Others', 1);
  pluginMainCmd.mandatory('B_Arg', ParamType.Enum, 'Methods', 1); // add, remove | list | player
  pluginMainCmd.mandatory('B_Arg', ParamType.Enum, 'Method', 1);
  pluginMainCmd.mandatory('player', ParamType.RawText); // player
  pluginMainCmd.optional('time', ParamType.String); // time
  pluginMainCmd.optional('reason', ParamType.RawText); // reason
  pluginMainCmd.overload(['Lists', 'Methods']);
  pluginMainCmd.overload(['Lists', 'Methods', 'player', 'time', 'reason']);
  pluginMainCmd.overload(['Lists', 'Method']);
  pluginMainCmd.overload(['Others']);
  pluginMainCmd.setCallback((_pluginMainCmd, _ori, out, res) => {
    whiteListUltra_CommandProc(_pluginMainCmd, _ori, out, res);
    return true;
  });
  pluginMainCmd.setup();
});
function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: {
  A_Arg: string, // whitelist, blacklist | listall, reload | delete
  B_Arg: string, // add,  remove,  list  |   -             | player
  player: string, // player               |   -             |   -
  time: string, //   time                 |   -             |   -
  reason: string  // reason               |   -             |   -
}) {
  var isSuceess: boolean = true;
  (() => {
    var isList: boolean = args.A_Arg == 'whitelist' || args.A_Arg == 'blacklist';
    var friList  : string = isList ? args.A_Arg : '';
    var friMethod: string = !isList ? args.A_Arg : '';
    var listPlayer: string = args.A_Arg == 'delete' ? args.B_Arg : args.player;
    var secMethod: string = isList ? args.B_Arg : '';
    var time: number = (new Date(args.time)).valueOf();
    var reason: string = isList ? args.reason : '';

    if (isList) {
      var playerInfo = globalVariable.whiteListUltra.fileSystem.getPlayerInfo(listPlayer);
      var xuid = '', uuid = '';
      if (playerInfo) {
        xuid = playerInfo.xuid;
        uuid = playerInfo.uuid;
      };

      var onBlack = false;
      var onWhite = false;
      var onAdd = secMethod == 'add';

      if (secMethod == 'list') {
        var List = globalVariable.whiteListUltra.fileSystem.getListAll(friList == 'whitelist', false, resultOutput);
        isSuceess = !!List;
        return;
      };

      if (friList == 'whitelist') {
        onWhite = onAdd;
      } else {
        onBlack = onAdd;
      };

      if (friList == 'blacklist' && onAdd) {
        mc.getOnlinePlayers().map(player => {
          player.sendToast(
'§bWhiteListUltra §eUltra 封禁',
`§e玩家 §c${listPlayer} §e因为 §b${reason == undefined ? '无理由' : reason} §e导致封禁至 §f${args.time == undefined ? '永久' : time} §e! §c希望各位引以为戒`);
        });
      };

      if (!globalVariable.whiteListUltra.fileSystem.addPlayerInfo({
        playerName: listPlayer,
        xuid: xuid,
        uuid: uuid,
        whited: onWhite,
        unwhiteTime: onWhite ? time : 0,
        banned: onBlack,
        bannedTime: onBlack ? time : 0,
        bannedResult: onBlack ? reason : '无',
      })) {
        isSuceess = false;
        // logger.error(`Cannot ${onAdd ? 'Add' : 'Remove'} Infomation from the ${friList}.`);
      }else
      
      logger.info(onWhite, onBlack);
      fastLog(`Debug::: ${friList} ${secMethod} ${listPlayer} ${time} ${reason}`);
      return;
    } else {
      if (friMethod == 'delete') {
        isSuceess = globalVariable.whiteListUltra.fileSystem.removePlayerInfo(listPlayer);
        return;
      } else if (friMethod == 'listall') {
        var List = globalVariable.whiteListUltra.fileSystem.getListAll(true, true, resultOutput);
        isSuceess = !!List;
        return;
      } else if (friMethod == 'reload') {
        globalVariable.whiteListUltra.config
          = globalVariable.whiteListUltra.fileSystem.readConfigFile();
        return;
      };
    };
  })();
  if(!isSuceess)
logger.error(`Failed to execute!
  Command: ${command.name} Args: ${Object.values(args).toString()}
`);
};

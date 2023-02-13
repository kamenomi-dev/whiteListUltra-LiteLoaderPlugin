mc.listen('onServerStarted', () => {
  // Doc // :
  // "()" More Options, "[]" Is Optional
  // /whitelistultra (whitelist/blacklist) (add/remove) playerName [time] [reason] - description : [time] default is forever, [reason] default is '空'
  // /whitelistultra (whitelist/blacklist) list                                    - description : To show all players info from the list.
  // /whitelistultra delete playerName                                             - description : To delete the player info from all list.
  // /whitelistultra listall                                                       - description : To show all players info from all list.
  // /whitelistultra reload                                                        - description : To reload the config file.

  // register plugin command
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


function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: {
  option: string, // whitelist, blacklist | listall, reload | delete
  method: string, // add,  remove,  list  |   -             | player
  player: string, // player               |   -             |   -
  time  : string, // time                 |   -             |   -
  reason: string  // reason               |   -             |   -
}) {
  var isSuceess: boolean = true;
  (() => {
    var isList: boolean = args.option == 'whitelist' || args.option == 'blacklist';
    var isDelete: boolean = args.option == 'delete';

    var list: string = isList ? args.option : '';
    var method: string = !isList ? args.option : args.method;
    var player: string = isDelete ? args.method : args.player;
    var time: number = new Date(args.time).valueOf();
    var reason: string = isList ? args.reason : '';

    // Process the Option (whitelist or blacklist)
    if (isList) {
      var playerInfo = GPlugin.fileSystem.editPlayerInfo('get', player) as TPlayerData;

      var onBlack = false;
      var onWhite = false;
      var onAdd = method == 'add';

      if (method == 'list') {
        var List = GPlugin.fileSystem.getListAll(list == 'whitelist', false, resultOutput);
        isSuceess = !!List;
        return;
      };

      onWhite = list == 'whitelist' ? onAdd : false;
      onBlack = list == 'blacklist' ? onAdd : false;

      if (list == 'blacklist' && onAdd) {
        mc.getOnlinePlayers().map(player => {
          player.sendToast(
            '§cWhiteListUltra Ultra 封禁',
            `§e玩家 §c${player} §e因为 §b${reason == undefined ? '无理由' : reason} §e导致封禁至 §f${args.time == undefined ? '永久' : time} §e! §c希望各位引以为戒`);
        });
      };

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
    } else {
      if (method == 'delete') {
        isSuceess = GPlugin.fileSystem.editPlayerInfo('delete', player);
        return;
      } else if (method == 'listall') {
        isSuceess = !!GPlugin.fileSystem.getListAll(true, true, resultOutput);;
        return;
      } else if (method == 'reload') {
        GPlugin.config = GPlugin.fileSystem.readMessageConfigFile();
        return;
      };
    };
  })();
  if (!isSuceess) {
    logger.error(`Failed to execute! Command: ${command.name} Args: ${Object.values(args).toString()}`);
  };
};

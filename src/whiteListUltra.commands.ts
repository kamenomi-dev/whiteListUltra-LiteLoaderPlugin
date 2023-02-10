mc.listen('onServerStarted', () => {
  // (Overload 1) /whiteListUltra <whitelist:blacklist> <add :remove> player: <player> time: [time] reason: [reason]
  // (Overload 2) /whiteListUltra <whitelist:blacklist> <list>
  // (Overload 3) /whiteListUltra <listall  :reload>

  const pluginMainCmd = mc.newCommand('whiteListUltra', 'LiteLoader Plugin Script - whiteListUltra', PermType.GameMasters);
  pluginMainCmd.setAlias('wl');
  pluginMainCmd.setEnum('Lists', ['whitelist' , 'blacklist']);
  pluginMainCmd.setEnum('Others', ['listall', 'reload']);
  pluginMainCmd.setEnum('Methods', ['add', 'remove']);
  pluginMainCmd.setEnum('Method', ['list']);
  pluginMainCmd.mandatory('list', ParamType.Enum, 'Lists', 1);
  pluginMainCmd.mandatory('list', ParamType.Enum, 'Others', 1);
  pluginMainCmd.mandatory('method', ParamType.Enum, 'Methods');
  pluginMainCmd.mandatory('method', ParamType.Enum, 'Method');
  // pluginMainCmd.mandatory('player', ParamType.Player);
  // pluginMainCmd.optional('time', ParamType.RawText);
  // pluginMainCmd.optional('reason', ParamType.RawText);
  pluginMainCmd.overload(['Lists', 'Methods']);
  // pluginMainCmd.overload(['Lists', 'Methods', 'player', 'reason']);
  // pluginMainCmd.overload(['Lists', 'Method']);
  // pluginMainCmd.overload(['Others']);
  pluginMainCmd.setCallback((_pluginMainCmd, _ori, out, res) => {
    return true;
  });
  pluginMainCmd.setup();
});
function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: any) {

};

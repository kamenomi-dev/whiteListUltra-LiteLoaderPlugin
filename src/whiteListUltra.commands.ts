/*mc.listen('onServerStarted', () => {
  var pluginMainCmd = globalVariable.whiteListUltra.command;
  pluginMainCmd = mc.newCommand('whiteListUltra', 'LiteLoader Plugin Script - whiteListUltra', PermType.GameMasters);
  pluginMainCmd.setAlias('wl');
  pluginMainCmd.setEnum('lists_', ['whitelist' , 'blacklist']);
  pluginMainCmd.setEnum('others_', ['alllist', 'reload']);
  pluginMainCmd.setEnum('methods_', ['add', 'remove']); 
  pluginMainCmd.setEnum('method_',['list'])
  
  // (Overload 1) /whiteListUltra list: <whitelist|blacklist> method: <add|remove> player: <player> time: [time] reason: [reason]
  // (Overload 2) /whiteListUltra list: <whitelist|blacklist> method: <list>
  // (Overload 3) /whiteListUltra list: <alllist>
  pluginMainCmd.mandatory('list', ParamType.Enum, 'lists_', 1);
  pluginMainCmd.mandatory('list', ParamType.Enum, 'others_', 1);
  pluginMainCmd.mandatory('method', ParamType.Enum, 'methods_');
  pluginMainCmd.mandatory('method', ParamType.Enum, 'method_');
  pluginMainCmd.mandatory('player', ParamType.Player);
  pluginMainCmd.optional('time', ParamType.String);
  pluginMainCmd.optional('reason', ParamType.String);

  pluginMainCmd.overload(['lists_', 'methods_', 'player', 'time', 'reason']);
  pluginMainCmd.overload(['lists_', 'method_']);
  pluginMainCmd.overload(['others_']);

  pluginMainCmd.setCallback(whiteListUltra_CommandProc)
  pluginMainCmd.setup();
});
function whiteListUltra_CommandProc(command: Command, caller: CommandOrigin, resultOutput: CommandOutput, args: any) {

};*/
mc.listen('onServerStarted', () => {
  logger.setTitle('whiteListUltra');
  logger.log('Successfully running the server!');
});
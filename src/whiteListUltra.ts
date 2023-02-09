mc.listen('onPreJoin', (Player) => {
  var wl = globalVariable.whiteListUltra;
  var curTick = (new Date()).valueOf();
  var playerInfo = wl.fileSystem.getPlayerInfo(Player.realName) as commonPlayerInfo;
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
  };
  if (!playerInfo.banned && (firstJoin || !playerInfo.whited)) {
    logger.info(`${Player.realName} {${Player.uuid}} 玩家没有白名单权限进入服务器!`);
    Player.disconnect(wl.config.eventMessages.whitelist.on_have_no_permission);
    return;
  };
  if (playerInfo.whited && playerInfo.unwhiteTime < curTick && playerInfo.unwhiteTime != 0) {
    logger.info(`${Player.realName} {${Player.uuid}} 玩家白名单过期!`);
    playerInfo.unwhiteTime = 0
    playerInfo.whited = false
    globalVariable.whiteListUltra.fileSystem.addPlayerInfo(playerInfo);
    Player.disconnect(wl.config.eventMessages.whitelist.on_timed_out);
    return;
  };

  if (playerInfo.banned) {
    if (playerInfo.bannedTime > curTick) {
      logger.info(`${Player.realName} {${Player.uuid}} 玩家正在被封禁!封禁至${new Date(playerInfo.bannedTime - curTick).toDateString()}`);
      Player.disconnect(wl.config.eventMessages.blacklist.on_default_reason_hasTime
        .replace(
          '${time}',
          new Date(playerInfo.bannedTime - curTick).toDateString()
        ));
      return;
    } else if (playerInfo.bannedTime == 0) {
      var bannedReason = playerInfo.bannedResult || '无';
      logger.info(`${Player.realName} {${Player.uuid}} 玩家被永久封禁! 理由: ${bannedReason}`);
      Player.disconnect(wl.config.eventMessages.blacklist.on_default_reason_noTime + '\n理由: ' + bannedReason);
      return;
    };
  };
  logger.log('debuuggg', playerInfo.banned, playerInfo.bannedTime)
});
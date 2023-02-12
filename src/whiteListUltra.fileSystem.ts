class fileSystem {
  readonly fileConfigPath = '.\\plugins\\whiteListUltra\\';
  readonly serverProtocolVersion = mc.getServerProtocolVersion();

  private getInfoClass() {
    return new JsonConfigFile(`${this.fileConfigPath}playerInfo.json`)
  }
  /* WHITE / BLACK LIST */
  public addPlayerInfo(playerInfo: commonPlayerInfo): boolean {
    var infoJsonFile = this.getInfoClass();
    var procResult = infoJsonFile.set(playerInfo.playerName, playerInfo);
    infoJsonFile.close();
    return procResult;
  };
  public removePlayerInfo(playerRealName: string): boolean {
    var infoJsonFile = this.getInfoClass();
    var procResult = infoJsonFile.delete(playerRealName);
    infoJsonFile.close();
    return procResult;
  };
  public getPlayerInfo(playerRealName: string): commonPlayerInfo | null {
    var infoJsonFile = this.getInfoClass();
    var procResult = infoJsonFile.get(playerRealName) as commonPlayerInfo | null;
    infoJsonFile.close();
    return procResult;
  };
  public getListAll(isWhiteList: boolean = true, isAll?: boolean, outp?: CommandOutput) {
    var infoJsonFile = this.getInfoClass();
    var jsonObject = Object.values(JSON.parse(infoJsonFile.read()));
    var resultPlayer: string = `===${isAll ? 'All' : (isWhiteList ? 'White' : 'Black')}===\n`;

    jsonObject.map(item => {
      var player = item as commonPlayerInfo;
      if ((isWhiteList && player.whited) || (!isWhiteList && player.banned) || isAll) {
        resultPlayer += `[${player.playerName}] W: ${player.whited} B: ${player.banned}\n`;
      };
    });
    infoJsonFile.close();
    resultPlayer += '=== List End ===';
    if (outp)
      resultPlayer.split('\n').map(item => {
        outp.addMessage(item);
      });
    return resultPlayer;
  }
  /* CONFIG */
  public readConfigFile(): whiteListUltraConfig {
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
    var procResult = JSON.parse(configJsonFile.read()) as whiteListUltraConfig;
    configJsonFile.close();
    return procResult;
  };
};
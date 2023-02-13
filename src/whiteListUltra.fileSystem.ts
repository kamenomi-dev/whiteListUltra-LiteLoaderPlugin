class fileSystem {
  public configPath: string = '';
  private getInfoClass() {
    return new JsonConfigFile(`${this.configPath}playerInfo.json`)
  };

  /* WHITE / BLACK LIST */
  public editPlayerInfo(option: 'get', playerData: string | TPlayerData): TPlayerData | null
  public editPlayerInfo(option: 'set' | 'delete', playerData: string | TPlayerData): boolean
  public editPlayerInfo(option: 'set' | 'delete' | 'get', playerData: string | TPlayerData): boolean | TPlayerData | null {
    var infoJsonFile = this.getInfoClass();
    var procResult: any;
    if (typeof playerData == 'object') {
      if(option == 'set') {
        procResult = infoJsonFile.set(playerData.playerName, playerData);
      };
    }else{
      if (RegExp(/[\~\`\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\:\"\;\'\<\>\?\,\.\/]+/g).test(playerData))
        return null;
      procResult = eval(`infoJsonFile.${option}('${playerData}')`);
    }
    infoJsonFile.close();
    return procResult;
  };

  public getListAll(isWhiteList: boolean = true, isAll?: boolean, outp?: CommandOutput) {
    var infoJsonFile = this.getInfoClass();
    var jsonObject = Object.values(JSON.parse(infoJsonFile.read()));
    var resultPlayer: string = `===${isAll ? 'All' : (isWhiteList ? 'White' : 'Black')}===\n`;

    jsonObject.map(item => {
      var player = item as TPlayerData;
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
  public readMessageConfigFile(): TMessageConfig {
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
    var procResult = JSON.parse(configJsonFile.read()) as TMessageConfig;
    configJsonFile.close();
    return procResult;
  };
};
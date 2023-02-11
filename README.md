# whiteListUltra-LLBDS-Plugin

A Ultra Whitelist Helper Plugin For Minecraft Bedrock Edition.

##### ReadMe

1. [ReadMe en-US](https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/blob/main/README.md)
2. [ReadMe zh-CN](https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/blob/main/README_zh-CN.md)

### License

Apache 2.0 License

### developer(s)

1. [Creakler](https://github.com/CreaklerFurry)

### dependence

1. [TypeScript](https://github.com/microsoft/TypeScript) by [Microsoft](https://github.com/microsoft)
2. [LiteLoader BDS](https://github.com/LiteLDev/LiteLoaderBDS) - by [LiteLDev](https://github.com/LiteLDev)

### description

Whitelist - tips   - time limit  
Blacklist - reason - time limit

### minecraft Commands

##### Push or Pop the White/Black List.

**Method** : /whitelistultra \<whitelist : blacklist> \<add : remove> \<playerRealName> [time] [reason]

**Params** :

| Param Name | Type                           | Description                                                  |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| List       | Text \<whitelist or blacklist> | List all you are able to control the lists.                  |
| method     | Text \<add or remove>          | Add or Remove the infomation of player from the list.        |
| time       | Text (date Text only)          | Set White/Black List period, the Time will be permanent if you set that Zero or Empty. |
| reason     | Text (whitelist Only)          | Set the reason for banned player                             |



##### List numbers from the White/Black List.

**Method** : /whitelistultra \<whitelist : blacklist> list

**Params** :

| Param Name    | Type                          | Description                                 |
| ------------- | ----------------------------- | ------------------------------------------- |
| list          | Text <whitelist or blacklist> | List all you are able to control the lists. |
| method (list) | Text (List Only)              | To list all infomation from the list.       |



##### Delete a infomation of player from the White&Blacklist.

**Method** : /whitelistultra delete \<player>

**Params** :

| Param Name      | Type                    | Description                                     |
| --------------- | ----------------------- | ----------------------------------------------- |
| method (delete) | Text (Delete Only)      | Delete the infomation of player from all lists. |
| player          | Text (player real name) | Name of the target player                       |

##### List infomation of all players from the White&Blacklist.

**Method** : /whitelistultra listall

**Params** :

| Param Name       | Type                | Description                           |
| ---------------- | ------------------- | ------------------------------------- |
| method (listall) | Text (Listall Only) | List all players data from all lists. |

##### Reload the White&Blacklist.

**Method** : /whitelistultra reload

**Params** :

| Param Name      | Type               | Description           |
| --------------- | ------------------ | --------------------- |
| method (reload) | Text (Reload Only) | To load config again. |



### log~

##### 2023 02 10 03:31  

| Status      | Content                                              |
| ----------- | ---------------------------------------------------- |
| Add         | Base logic.                                          |
| Tips - WARN | The Commands doesn't work! This is so~~~ bad at all! |

#####  2023 02 11 02:22  

| Status      | Content                                      |
| ----------- | -------------------------------------------- |
| Add         | Better Console Output.                       |
| Tips - WARN | The Commands still have something wrong. : / |

#####  2023 02 11 20:08  

| Status            | Content                                                      |
| ----------------- | ------------------------------------------------------------ |
| Fix               | Fix Commands register Error.                                 |
| Tips - My opinion | The plugin is use on Server [Fure BE Server] [See QQ Group](https://jq.qq.com/?_wv=1027&k=5EMMIPRn) |

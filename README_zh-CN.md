# whiteListUltra-LLBDS-Plugin

一个使用在Minecraft Bedrock Edition的 **超(Ultra)白名单插件**

##### ReadMe

1. [ReadMe en-US](https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/blob/main/README.md)
2. [ReadMe zh-CN](https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/blob/main/README_zh-CN.md)

### 开源协议

[Apache 2.0 License](https://github.com/CreaklerFurry/whiteListUltra-LLBDS-Plugin/blob/main/LICENSE)

### 开发者

1. [Creakler](https://github.com/CreaklerFurry)

### 插件依赖

1. [LiteLoader BDS](https://github.com/LiteLDev/LiteLoaderBDS) - [LiteLDev](https://github.com/LiteLDev)

### 简介

Whitelist - tips   - time limit  
Blacklist - reason - time limit

### 指令

##### 从列表中添加或者删除的玩家数据

**方法** : /whitelistultra \<whitelist : blacklist> \<add : remove> \<playerRealName> [time] [reason]

**参数** :

| 参数名 | 类型                               | 说明                                              |
| ------ | ---------------------------------- | ------------------------------------------------- |
| 列表   | 字符串 \<whitelist 或者 blacklist> | 显示所有你可操作的黑白名单列表                    |
| 方法   | 字符串 \<add 或者 remove>          | 从列表添加或者删除玩家数据                        |
| 时间   | 字符串 (只可日期文本)              | 设置权限期限，当为**0**或者**空**时，时长将为无限 |
| 理由   | 字符串 (只可用在黑名单上)          | 设置被封禁玩家的理由                              |



##### 显示黑白名单列表中所有玩家信息

**方法** : /whitelistultra \<whitelist : blacklist> list

**参数** :

| 参数名      | 类型                              | 说明                         |
| ----------- | --------------------------------- | ---------------------------- |
| 列表        | 字符串 <whitelist 或者 blacklist> | 你可操作的列表               |
| 方法 (list) | 字符串 (只可传 "list")            | 显示欲列出所有玩家信息的列表 |



##### 从黑白名单中删除一条玩家信息

**方法** : /whitelistultra delete \<player>

**参数** :

| 参数名      | 类型                       | 说明                                   |
| ----------- | -------------------------- | -------------------------------------- |
| 方法 (删除) | 字符串 (只可传入 "delete") | 删除在所有黑白名单列表中所有该玩家信息 |
| 玩家        | 字符串 (玩家昵称)          | 目标玩家昵称                           |

##### 显示在所有黑白名单中的全部玩家信息

**方法** : /whitelistultra listall

**参数** :

| 参数名         | 类型                       | 说明                               |
| -------------- | -------------------------- | ---------------------------------- |
| 方法 (listall) | 字符串(只可传入 "listall") | 显示在所有黑白名单中的全部玩家信息 |

##### 重载插件配置文件

**方法** : /whitelistultra reload

**参数** :

| 参数名        | 类型                      | 说明             |
| ------------- | ------------------------- | ---------------- |
| 方法 (reload) | 字符串(只可传入 "reload") | 重新载入配置文件 |



### 日志

##### 2023 02 10 03:31  

| 状态              | 内容                         |
| ----------------- | ---------------------------- |
| 添加              | 基础逻辑                     |
| 提示 - 开发者的话 | 指令没有生效！这真的太坏了！ |

#####  2023 02 11 02:22  

| 状态              | 内容                   |
| ----------------- | ---------------------- |
| 增加              | 更好的日志输出         |
| 提示 - 开发者的话 | 指令还是依旧出现错误！ |

#####  2023 02 11 20:08  

| 状态              | 内容                                                         |
| ----------------- | ------------------------------------------------------------ |
| 修复              | 修复注册指令问题                                             |
| 提示 - 开发者的话 | 插件在 [Fure BE Server] 试运行！  [详情见 QQ Group](https://jq.qq.com/?_wv=1027&k=5EMMIPRn) |

## 版本信息

版本：1.3.1
类型：中性
描述：

## 1.SDK 说明

### 文件说明

1.connector.js，Decoder.js，libde265.js，glutils.js 为 SDK 主体库

2.play.js 和 index.html 文件为 demo 演示，封装了一些基础逻辑，供二次开发使用

### 架构图

![architecture](.\architecture.png)

## 2.设备通信接口说明

设备通信接口是和设备通信接口约定，用于连接设备、播放视频、操作设备云台等。

### 设备通信方式

SDK 使用 websocket 和设备进行通信和接收视频流，当前使用 WSS://协议，

当 SDK 向设备发送指令后，设备会返回响应信息，要接收响应信息需要预先定义好每个指令的回调函数。

### 设备连接机制

连接设备时，需要先连接设备，连接成功后再登录设备，才能进行播放视频，录像检索，云台控制等操作。

### 设备连接流程

![login](.\login.png)

### 名词解释

| 名称       | 描述                                                  |
| ---------- | ----------------------------------------------------- |
| 设备 IP    | 局域网内的设备的 IP，可通过 IP 局域网连接设备         |
| 设备端口   | 使用 IP 连接时设备的端口号，默认 10000                |
| 设备用户名 | 登录设备所需用户名，默认 admin                        |
| 设备密码   | 登录设备所需密码，默认空                              |
| 通道       | 设备的通道数，从 0 开始，单通道设备即摄像头只有通道 0 |

### 字典值

| 字典类型            | 字典值                                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 编码模式 enc        | H264<br> H265                                                                                                                                                                                                                   |
| 帧类型 frametype    | 0 音频帧 <br>1 I 帧 <br>2 P 帧                                                                                                                                                                                                  |
| 码流类型 streamid   | 0 主码流 <br>1 子码流                                                                                                                                                                                                           |
| 帧率 fps            | 1-25                                                                                                                                                                                                                            |
| P2P 连接错误码 code | 0 成功<br> -2 超时<br> -10 本地连接被关闭<br> -11 远程连接被关闭<br> -12 寻址失败<br> -13 连接失败(设备离线)<br> -16 服务器连接失败<br> -20 登录设备校验失败(密码错误)                                                          |
| 云台指令类型        | 0：停止<br> 1：自动水平旋转<br> 2：上 <br>3：下<br> 4：左 <br>5：右 <br>6：光圈加 <br>7：光圈减 <br>8：缩放增<br> 9：缩放减<br> 10：焦距加 <br>11：焦距减<br> 12:辅助开关<br> 13:设置预置点<br> 14:调用预置点<br> 15:清空预置点 |
| 录像类型            | 定时:1<br> 移动:2 <br> 报警:4<br> 手动:8 <br> 全部类型: 15，15 在检索录像时使用                                                                                                                                                 |

##

## ３.外部调用方法

### 连接设备

#### 方法描述

| 序号 | 方法名        | 方法描述                       | 调用对象 |
| ---- | ------------- | ------------------------------ | -------- |
| 1    | ConnectDevice | 连接设备方法，发送连接设备指令 | Player   |

#### 调用参数

调用示例

```js
Player.ConnectDevice(
  deviceid,
  ip,
  user,
  pwd,
  winindex,
  port,
  connectType,
  channel,
  streamid
);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP，优先使用设备 ID 连接，无设备 ID 时使用 IP 连接，有 ID 时允许为空 |
| 3 | user | String | 设备用户名 |
| 4 | pwd | String | 设备密码 |
| 5 | winindex | Number | 连接索引 |
| 6 | port | Number | IP 连接时使用，建议使用 10000 端口 |
| 7 | connectType | Number | 连接方式 0：预连接 1：连接并打开码流 |
| 8 | channel | Number | 通道 |
| 9 | streamid | Number | 码流类型，连接方式为 1 时有效 |

### 登录设备

#### 方法描述

| 序号 | 方法名 | 方法描述                       | 调用对象 |
| ---- | ------ | ------------------------------ | -------- |
| 1    | login  | 连接成功后发送的指令，登录设备 | Player   |

#### 调用参数

调用示例

```js
ConnectApi.login(session, username, password);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | session | String | 连接对象 |
| 2 | username | String | 设备用户名 |
| 3 | password | String | 设备密码 |

### 打开码流

#### 方法描述

| 序号 | 方法名     | 方法描述                           | 调用对象 |
| ---- | ---------- | ---------------------------------- | -------- |
| 1    | OpenStream | 打开设备码流，会触发实时视频流回调 | Player   |

#### 调用参数

调用示例

```js
Player.OpenStream(deviceid, ip, channel, streamid, winindex);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Number | 通道 |
| 4 | streamid | Number | 码流类型 |
| 5 | winindex | Number | 渲染的窗体索引 |

### 关闭码流

#### 方法描述

| 序号 | 方法名      | 方法描述     | 调用对象 |
| ---- | ----------- | ------------ | -------- |
| 1    | CloseStream | 关闭设备码流 | Player   |

#### 调用参数

调用示例

```js
Player.CloseStream(keyindex);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | keyindex | Number | 窗体索引 |

### 修改分辨率

#### 方法描述

| 序号 | 方法名        | 方法描述                   | 调用对象 |
| ---- | ------------- | -------------------------- | -------- |
| 1    | setResolution | 修改 canvas 视频渲染分辨率 | Player   |

#### 调用参数

调用示例

```js
Player.setResolution(keyindex, width, height);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | keyindex | Number | 窗体索引 |
| 2 | width | Number | 宽度 |
| 3 | height | Number | 高度 |

### 云台控制

#### 方法描述

| 序号 | 方法名   | 方法描述         | 调用对象 |
| ---- | -------- | ---------------- | -------- |
| 1    | ptz_ctrl | 控制设备云台操作 | Player   |

#### 调用参数

调用示例

```js
Player.ptz_ctrl(deviceid, ip, channel, type, param);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Number | 通道 |
| 4 | type | Number | 云台动作 <br>0:停止 1:自动水平旋转 2:上 3:下 4:左 5:右 6:光圈加 7:光圈减 8:缩放增 9:缩放减 10:焦距加 11:焦距减 12:辅助开关 13:设置预置点 14:调用预置点 15:清空预置点 |
| 5 | param | Number | 云台控制参数，根据动作设定,传 1-5 时代表速度，13 和 14 是传预置位 |

### 切换码流

#### 方法描述

| 序号 | 方法名       | 方法描述     | 调用对象 |
| ---- | ------------ | ------------ | -------- |
| 1    | ChangeStream | 切换设备码流 | Player   |

#### 调用参数

调用示例

```js
Player.ChangeStream(deviceid, ip, channel, streamid, winindex);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Number | 通道 |
| 4 | streamid | Number | 要切换码流类型 |
| 5 | winindex | Number | 渲染的窗体索引 |

### 断开设备连接

#### 方法描述

| 序号 | 方法名           | 方法描述     | 调用对象 |
| ---- | ---------------- | ------------ | -------- |
| 1    | DisConnectDevice | 断开设备连接 | Player   |

#### 调用参数

调用示例

```js
Player.DisConnectDevice(deviceid, ip);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |

### 视频回放检索

#### 方法描述

| 序号 | 方法名       | 方法描述                                                                               | 调用对象 |
| ---- | ------------ | -------------------------------------------------------------------------------------- | -------- |
| 1    | SreachRecord | 查询设备指定通道录像，注意不能同时执行两次执行，调用者注意在查询时阻止用户进行其它操作 | Player   |

#### 调用参数

调用示例

```js
Player.SreachRecord(deviceid, ip, channel, begintime, endtime, type);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | String | 通道 |
| 4 | begintime | String | 开始时间 秒级时间戳 |
| 5 | endtime | String | 结束时间 秒级时间戳 |
| 6 | type | String | 录像类型，定时:1 移动:2 报警:4 手动:8 全部类型: 15 |

### 停止录像查询

#### 方法描述

| 序号 | 方法名     | 方法描述     | 调用对象 |
| ---- | ---------- | ------------ | -------- |
| 1    | Stopsearch | 停止录像查询 | Player   |

#### 调用参数

调用示例

```js
Player.Stopsearch(deviceid, ip);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |

### 开始回放录像

#### 方法描述

| 序号 | 方法名        | 方法描述             | 调用对象 |
| ---- | ------------- | -------------------- | -------- |
| 1    | StartPlayBack | 回放指定时间点的录像 | Player   |

#### 调用参数

调用示例

```js
Player.StartPlayBack(
  deviceid,
  ip,
  channel,
  begintime,
  endtime,
  type,
  winindex,
  isSound
);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | String | 通道 |
| 4 | begintime | String | 录像开始时间 秒级时间戳 |
| 5 | endtime | String | 录像结束时间 秒级时间戳 |
| 6 | type | String |录像类型，定时:1 移动:2 报警:4 手动:8 全部类型: 15|
| 7 | winindex | String | 窗体索引 |
| 8 | isSound | String | 是否播放音频，业务逻辑封装的字段，可不传 |

### 暂停回放

#### 方法描述

| 序号 | 方法名        | 方法描述     | 调用对象 |
| ---- | ------------- | ------------ | -------- |
| 1    | PausePlayBack | 暂停当前回放 | Player   |

#### 调用参数

调用示例

```js
Player.PausePlayBack(deviceid, ip);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |

### 继续回放

#### 方法描述

| 序号 | 方法名           | 方法描述     | 调用对象 |
| ---- | ---------------- | ------------ | -------- |
| 1    | ContinuePlayBack | 继续当前回放 | Player   |

#### 调用参数

调用示例

```js
Player.ContinuePlayBack(deviceid, ip);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |

### 停止回放

#### 方法描述

| 序号 | 方法名           | 方法描述     | 调用对象 |
| ---- | ---------------- | ------------ | -------- |
| 1    | ContinuePlayBack | 继续当前回放 | Player   |

#### 调用参数

调用示例

```js
Player.StopPlayBack(deviceid, ip, channel);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | String | 通道 |

### 播放器初始化

#### 方法描述

| 序号 | 方法名 | 方法描述                                                                           | 调用对象 |
| ---- | ------ | ---------------------------------------------------------------------------------- | -------- |
| 1    | init   | 播放器初始化，传入 canvas 元素数组，比如 4 窗口，传入包含这 4 个 canvas 元素的数组 | Player   |

#### 调用参数

调用示例

```js
Player.init(playerArr);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | playerArr | Array | Canvas 数组 |

### 截图

#### 方法描述

| 序号 | 方法名   | 方法描述       | 调用对象 |
| ---- | -------- | -------------- | -------- |
| 1    | Snapshot | 对画面进行截图 | Player   |

#### 调用参数

调用示例

```js
Player.Snapshot(winindex, mode, name, width, height, callback);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | winindex | Number | 窗体索引值，必填 |
| 2 | mode | Number | 截图方式 0:使用指定窗口的 canvas 画布进行截图 1:使用指定窗口的下一帧码流数据进行截图 |
| 3 | name | String | 文件名称，需要带格式，目前支持 png 和 jpg，默认值：snapshot.png |
| 4 | width | Number | 生成的图片宽度 传空则根据截图方式使用 canvas 宽度或使用码流宽度，需要和图片高度一起传 |
| 5 | height | Number | 生成的图片高度 传空则根据截图方式使用 canvas 高度或使用码流高度，需要和图片宽度一起传 |
| 6 | callback | Function | 截图回调，需要图片数据时通过回调获取，不进行图片下载，传空默认直接下载图片 |

### 发起对讲

#### 方法描述

| 序号 | 方法名   | 方法描述                     | 调用对象 |
| ---- | -------- | ---------------------------- | -------- |
| 1    | OpenCall | 发起对讲，和设备进行语音对讲 | Player   |

#### 调用参数

调用示例

```js
Player.OpenCall(deviceid, ip, channel);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Array | 通道 |

### 传输对讲音频

#### 方法描述

| 序号 | 方法名   | 方法描述                           | 调用对象 |
| ---- | -------- | ---------------------------------- | -------- |
| 1    | CallSend | 发起对讲成功后，向设备传输实时音频 | Player   |

#### 调用参数

调用示例

```js
Player.CallSend(
  deviceid,
  ip,
  channel,
  time_stamp,
  enc,
  sample_rate,
  sample_width,
  channels,
  compress_ratio,
  voice_data,
  voice_data_size
);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Number | 通道 |
| 4 | time_stamp | Number | 设备 ID |
| 5 | enc | String | 设备 IP |
| 6 | sample_rate | String | 通道 |
| 7 | sample_width | Number | 设备 ID |
| 8 | channels | Number | 设备 IP |
| 9 | compress_ratio | Number | 通道 |
| 10 | voice_data | Uint8Array | 设备 IP |
| 11 | voice_data_size | Number | 通道 |

### 关闭对讲

#### 方法描述

| 序号 | 方法名     | 方法描述                           | 调用对象 |
| ---- | ---------- | ---------------------------------- | -------- |
| 1    | CallHangup | 发起对讲成功后，向设备传输实时音频 | Player   |

#### 调用参数

调用示例

```js
Player.CallHangup(deviceid, ip, channel);
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | 设备 ID |
| 2 | ip | String | 设备 IP |
| 3 | channel | Number | 通道 |

### 远程设置

#### 方法描述

| 序号 | 方法名        | 方法描述                 | 调用对象 |
| ---- | ------------- | ------------------------ | -------- |
| 1    | RemoteSetting | 设备连接登录成功后设置项 | Player   |

#### 调用参数

调用示例

```js
Player.RemoteSetting = function (id, ip, str) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明                                               |
| ---- | -------- | -------- | -------------------------------------------------- |
| 1    | id       | String   | 设备 ID                                            |
| 2    | ip       | String   | 设备 IP                                            |
| 3    | str      | String   | 远程设置内容（详细参数参考**5.远程设置操作说明**） |

## ４.回调定义

### 连接回调

#### 方法描述

| 序号 | 方法名    | 方法描述                               | 调用对象   |
| ---- | --------- | -------------------------------------- | ---------- |
| 1    | onconnect | 设备连接回调，调用连接方法后的响应回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onconnect = function (session, code) {
  if (code === 0) {
    ConnectApi.login(session, session.user, session.pwd);
  }
};
```

参数说明

| 序号 | 方法名  | 参数类型                               | 说明                                                                         |
| ---- | ------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| 1    | session | Object                                 | ConnectApi                                                                   |
| 2    | code    | 设备连接回调，调用连接方法后的响应回调 | 状态码，判断是连接成功还是连接失败，0 为成功，其他为失败，失败可能是设备离线 |

### 登录回调

#### 方法描述

| 序号 | 方法名        | 方法描述                               | 调用对象   |
| ---- | ------------- | -------------------------------------- | ---------- |
| 1    | onloginresult | 设备登录回调，调用登录方法后的响应回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onloginresult = function (session, code) {};
```

参数说明

| 序号 | 方法名  | 参数类型                               | 说明                                                                               |
| ---- | ------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| 1    | session | Object                                 | ConnectApi                                                                         |
| 2    | code    | 设备连接回调，调用连接方法后的响应回调 | 状态码，判断是登录成功还是登录失败，0 为成功，其他为失败，失败说明用户名或密码错误 |

### 连接断开回调

#### 方法描述

| 序号 | 方法名       | 方法描述                                                   | 调用对象   |
| ---- | ------------ | ---------------------------------------------------------- | ---------- |
| 1    | ondisconnect | 设备连接被断开时的回调，由于网络等原因被动断开时触发的回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.ondisconnect = function (session, code) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明     |
| ---- | -------- | -------- | -------- |
| 1    | session  | Object   | 连接对象 |
| 2    | code     | Number   | 状态码   |

### 打开码流回调

#### 方法描述

| 序号 | 方法名       | 方法描述                                       | 调用对象   |
| ---- | ------------ | ---------------------------------------------- | ---------- |
| 1    | onopenstream | 打开设备码流回调，调用打开码流方法后的响应回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onopenstream = function (
  session,
  channel,
  streamid,
  result,
  cam_desc
) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明                         |
| ---- | -------- | -------- | ---------------------------- |
| 1    | session  | Object   | 连接对象                     |
| 2    | channel  | Number   | 通道，打开码流所对应的通道   |
| 3    | streamid | Number   | 码流值                       |
| 4    | code     | Number   | 状态码，0 为成功，其他为失败 |

### 云台控制回调

#### 方法描述

| 序号 | 方法名      | 方法描述             | 调用对象   |
| ---- | ----------- | -------------------- | ---------- |
| 1    | onptzresult | 发送云台指令后的回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onptzresult = function (session, code) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明                         |
| ---- | -------- | -------- | ---------------------------- |
| 1    | session  | Object   | 连接对象                     |
| 4    | code     | Number   | 状态码，0 为成功，其他为失败 |

### 实时视频流回调

#### 方法描述

| 序号 | 方法名        | 方法描述                     | 调用对象   |
| ---- | ------------- | ---------------------------- | ---------- |
| 1    | onrecvframeex | 发送打开码流指令后的回调方法 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onrecvframeex = function (
  session,
  frametype,
  data,
  datalen,
  channel,
  width,
  height,
  enc,
  fps,
  timestamp
) {};
```

参数说明

| 序号 | 参数名称  | 参数类型 | 说明                                      |
| ---- | --------- | -------- | ----------------------------------------- |
| 1    | session   | Object   | 连接对象                                  |
| 2    | frametype | Number   | 帧类型 <br>0 音频帧<br> 1 I 帧<br> 2 P 帧 |
| 3    | data      | Buffer   | 视频帧数据                                |
| 4    | datalen   | Number   | 视频数据长度                              |
| 5    | channel   | Number   | 通道值                                    |
| 6    | width     | Number   | 画面宽                                    |
| 7    | height    | Number   | 画面高                                    |
| 8    | enc       | Number   | 编码格式                                  |
| 9    | fps       | Number   | 帧率                                      |
| 10   | timestamp | Number   | 这一帧的时间戳                            |

### 回放视频流回调

#### 方法描述

| 序号 | 方法名         | 方法描述                     | 调用对象   |
| ---- | -------------- | ---------------------------- | ---------- |
| 1    | onrecvrecframe | 发送打开回放指令后的回调方法 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onrecvrecframe = function (session, frametype, data, datalen, channel, width, height, enc, fps, ts_ms)){

}
```

参数说明

| 序号 | 参数名称  | 参数类型 | 说明                                      |
| ---- | --------- | -------- | ----------------------------------------- |
| 1    | session   | Object   | 连接对象                                  |
| 2    | frametype | Number   | 帧类型 <br>0 音频帧<br> 1 I 帧<br> 2 P 帧 |
| 3    | data      | Buffer   | 视频帧数据                                |
| 4    | datalen   | Number   | 视频数据长度                              |
| 5    | channel   | Number   | 通道值                                    |
| 6    | width     | Number   | 画面宽                                    |
| 7    | height    | Number   | 画面高                                    |
| 8    | enc       | Number   | 编码格式                                  |
| 9    | fps       | Number   | 帧率                                      |
| 10   | timestamp | Number   | 这一帧的时间戳                            |

### 查询回放返回数据回调

#### 方法描述

| 序号 | 方法名      | 方法描述                     | 调用对象   |
| ---- | ----------- | ---------------------------- | ---------- |
| 1    | onsearchrec | 发送回放检索指令后的回调方法 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onsearchrec = function (
  session,
  channel,
  file_type,
  file_begintime,
  file_endtime,
  file_total
) {};
```

参数说明

| 序号 | 参数名称       | 参数类型 | 说明                                  |
| ---- | -------------- | -------- | ------------------------------------- |
| 1    | session        | Object   | 连接对象                              |
| 2    | channel        | Number   | 通道值                                |
| 3    | file_type      | Number   | 录像类型，定时:1 移动:2 报警:4 手动:8 |
| 4    | file_begintime | Number   | 录像开始时间                          |
| 5    | file_endtime   | String   | 录像结束时间                          |
| 6    | file_total     | Number   | 检索录像的总数量                      |

### 回放检索结束回调

#### 方法描述

| 序号 | 方法名         | 方法描述                         | 调用对象   |
| ---- | -------------- | -------------------------------- | ---------- |
| 1    | onsearchrecend | 回放录像检索完毕后触发的回调方法 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onsearchrecend = function (session) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明     |
| ---- | -------- | -------- | -------- |
| 1    | session  | Object   | 连接对象 |

### p2p 错误回调

#### 方法描述

| 序号 | 方法名     | 方法描述               | 调用对象   |
| ---- | ---------- | ---------------------- | ---------- |
| 1    | onp2perror | P2P 连接发生错误的回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onp2perror = function (session, code) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明     |
| ---- | -------- | -------- | -------- |
| 1    | session  | Object   | 连接对象 |
| 2    | code     | Number   | 错误码   |

### 对讲回调

#### 方法描述

| 序号 | 方法名            | 方法描述       | 调用对象   |
| ---- | ----------------- | -------------- | ---------- |
| 1    | onvop2pcallresult | 发起对讲的回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onvop2pcallresult = function (session, code) {};
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明     |
| ---- | -------- | -------- | -------- |
| 1    | session  | Object   | 连接对象 |
| 2    | code     | Number   | 错误码   |

### 远程设置回调

#### 方法描述

| 序号 | 方法名        | 方法描述                     | 调用对象   |
| ---- | ------------- | ---------------------------- | ---------- |
| 1    | onremotesetup | 设备登陆后发起远程设置的回调 | ConnectApi |

#### 回调参数

回调示例

```js
ConnectApi.onremotesetup = function (api_conn, str, data_size, result) {};
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | --------- | -------- | ---------------- |
| 1 | api_conn | Object | 连接状态对象 |
| 2 | str | Object | 远程设置返回数据 |
| 3 | data_size | number | 数据长度 |
| 4 | result | number | 状态码 |

## ５.远程设置操作说明

1．首先远程设置操作必须连接登录设备

2．连接设备后方可点击，弹窗加载后会默认获取设备的信息

3．设置参数后点击保存成功后会重新加载弹窗刷新信息

4．点击左侧配置类型，填写右侧参数后点击保存进行设置参数

### rtmp 设置

#### 参数

| 序号 | 参数名  | 类型   | 说明  |
| ---- | ------- | ------ | ----- |
| 1    | Network | object | FixMe |

获取示例(get)

```js
{
   "Version": "2.0.0",
   "Method": "get",
   "IPCam": {
       "V2":{
           "Network":{
               "Rtmp" : {
               }
           }
       }
   },
   "Authorization": {
       "Verify": '',
       "username": user,
       "password": pwd
   }
}
```

设置示例(set)

```js
{
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
        "V2":{
            "Network":{
                "Rtmp" : {
                    "Enabled": true,
                    "RtmpUrl": "rtmp://test.rtmpserver.com:1933/push/test1",
                    "Stream": 1,
                    "OnlyMotDet":false
                }
            }
        }
    },
    "Authorization": {
        "Verify": '',
        "username": user,
        "password": pwd
    }
}
```

参数说明
| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | ---------- | -------- | ---------------------------------------- |
| 1 | Enabled | bool | 是否开启 rtmp |
| 2 | RtmpUrl | string | rtmp 推送地址 |
| 3 | Stream | number | 可选项 0 表示主码流,1 表示子码流(超清/标清) |
| 4 | OnlyMotDet | bool | 仅事件推 rtmp 码流 |

### 重启摄像头

#### 参数

| 序号 | 参数名          | 类型 | 说明  |
| ---- | --------------- | ---- | ----- |
| 1    | SystemOperation | json | FixMe |

设置示例(set)

```js
{
    "Version":"1.3.0",
    "Method":"set",
    "Authorization":{
      "Verify":"",
      "username":user,
      "password":pwd
    },
    "IPCam":{
      "SystemOperation":{
        "Reboot":true
      }
    }
  }
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明 |
| ---- | -------- | -------- | ---- |
| 1    | Reboot   | bool     | 重启 |

### 视频编码设置

#### 参数

| 序号 | 参数名         | 类型  | 说明  |
| ---- | -------------- | ----- | ----- |
| 1    | videoManagerV2 | array | FixMe |

获取示例(get)

```js
{
   "Version": "1.0.0",
   "Method": "get",
   "IPCam": {
       'videoManagerV2': [],
   },
   "Authorization": {
       "Verify": '',
       "username": user,
       "password": pwd
   }
}
```

设置示例(set)

```js
{
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        'videoManagerV2': [
            {
            'id': 0,
            'resolution': "2304x1296",
            'bitRateType': "VBR",
            'bitRate': 1024,
            'frameRate': 15
            },
            {
            'id': 1,
            'resolution': "2304x1296",
            'bitRateType': "VBR",
            'bitRate': 1024,
            'frameRate': 15
            },
        ],
    },
    "Authorization": {
        "Verify": '',
        "username": user,
        "password": pwd
    }
}
```

参数说明

| 序号 | 参数名称    | 参数类型 | 说明     |
| ---- | ----------- | -------- | -------- |
| 1    | resolution  | string   | 分辨率   |
| 2    | bitRateType | string   | 码率类型 |
| 3    | bitRate     | number   | 码率     |
| 4    | frameRate   | number   | 帧率     |

### 白光灯的启用和禁用

#### 参数

| 序号 | 参数名         | 类型 | 说明            |
| ---- | -------------- | ---- | --------------- |
| 1    | R/LightManCtrl | json | 手动开/关白光灯 |

获取示例(get)

```js
{
   "Version": "2.0.0",
   "Method": "get",
   "IPCam": {
       "V2":{
           "R/LightManCtrl":{
           }
       }
   },
   "Authorization": {
       "Verify": '',
       "username": user,
       "password": pwd
   }
}
```

设置示例(set)

```js
{
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
        "V2":{
            "R/LightManCtrl":{
                "Operate":　"OFF"
            }
        }
    },
    "Authorization": {
        "Verify": '',
        "username": user,
        "password": pwd
    }
}
```

参数说明

| 序号 | 参数名称 | 参数类型 | 说明                         |
| ---- | -------- | -------- | ---------------------------- |
| 1    | Operate  | string   | 手动开/关可选项[“ON”, “OFF”] |

### 设备参数推送

#### 参数

| 序号 | 参数名             | 类型   | 说明                                                                         |
| ---- | ------------------ | ------ | ---------------------------------------------------------------------------- |
| 1    | UploadCustomHealth | string | 支持设置上面设备参数推送的 Url 地址、端口、推送时间与启用/禁用推送功能给设备 |

获取示例(get)

```js
{
   "Version": "2.1.0",
   "Method": "get",
   "IPCam": {
       "V2":{
           "System":{
               "SoftProbe":{
                   "UploadCustomHealth":{}
               }
           }
       }
   },
   "Authorization": {
       "Verify": '',
       "username": user,
       "password": pwd
   }
}
```

设置示例(set)

```js
{
    "Version": "2.1.0",
    "Method": "set",
    "IPCam": {
        "V2":{
            "System":{
                "SoftProbe":{
                    "UploadCustomHealth":{
                        "Enabled":true,
                        "Server":"http://lb1.hf4g.live",
                        "UploadPeriod":600,
                        "Port":80
                    }
                }
            }
        }
    },
    "Authorization": {
        "Verify": '',
        "username": user,
        "password": pwd
    }
}
```

参数说明

| 序号 | 参数名称     | 参数类型 | 说明                     |
| ---- | ------------ | -------- | ------------------------ |
| 1    | Enabled      | bool     | 参数推送启用与禁用       |
|      | Server       | string   | 参数推送地址             |
| 3    | UploadPeriod | number   | 设备推送时间间隔单位为秒 |
| 4    | Port         | number   | 设备推送端口             |

## ６.注意事项

1.浏览器解码性能有限，请勿同时超过 4 画面播放视频

2.设备用户名默认 admin，密码默认为空，如果出现设备成功连接但无法登录，可能是密码错误，可尝试将设备重置后重试

3.播放器的 Canvas 标签必须指定宽度和高度，值不能为百分比，否则会导致画面渲染模糊，如果需要做界面自适应，则每次变化后都要重新设置宽度和高度

4.对讲需要获取麦克风，因谷歌浏览器等浏览器限制 http 环境下获取麦克风，需要本地 localhost 访问 web 界面或在 HTTPS 下访问，其他解决方案请搜索浏览器在 http 请求下无法开启麦克风问题

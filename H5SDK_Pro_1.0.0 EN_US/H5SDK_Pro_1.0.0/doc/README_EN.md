## Version Information

Version: 1.3.1
Type: Neutral
Description:

## 1.SDK Description

### Description of the document

1.connector.js, decoder.js, libde265.js, glutils.js are the main SDK libraries.

2.The play.js and index.html files are demo demos that encapsulate some basic logic for secondary development.

### Architecture diagram

![architecture](.\architecture_en.png)

## 2.Device communication interface description

The device communication interface is and device communication interface convention for connecting devices, playing video, operating device heads, etc.

### Device communication method

The SDK uses websocket to communicate with the device and receive video streams, currently using the WSS:// protocol.

When the SDK sends a command to the device, the device will return a response message, to receive the response message you need to predefine the callback function for each command.

### Device Connection Mechanisms

When connecting to the device, you need to connect to the device first, and then log in to the device after the connection is successful in order to perform operations such as video playback, video retrieval, PTZ control and so on.

### Device Connection Process

![login](.\login_en.png)

### Interpretation of nouns

| Name             | Descriptive                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Device IP        | IP of the device in the LAN, you can connect the device via IP LAN                                                |
| Device Ports     | Port number of the device when connecting using IP, default 10000                                                 |
| Device User Name | User name required to log in to the device, default admin                                                         |
| Device Password  | Password required to log in to the device, empty by default                                                       |
| channel          | The number of channels of the device, starting from 0, single-channel device, i.e., the camera has only channel 0 |

### Dictionary Value

| Dictionary Type                | Dictionary Value                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coding mode enc                | H264<br> H265                                                                                                                                                                                                                                                                                                                                               |
| Frame type frametype           | 0 audio frame <br>1 I-frame <br>2 P-frames                                                                                                                                                                                                                                                                                                                  |
| Stream type streamid           | 0 master stream<br>1 subcode stream                                                                                                                                                                                                                                                                                                                         |
| Frame rate fps                 | 1-25                                                                                                                                                                                                                                                                                                                                                        |
| P2P connection error code code | 0 successes<br> -2 overtime pay<br> -10 local connection closed<br> -11 remote connection closed<br> -12 address failure<br> -13 Connection failure (device offline)<br> -16 Server Connection failure<br> -20 Login device verification failed (wrong password)                                                                                            |
| Gimbal command type            | 0：cessation<br>1：automatic horizontal rotation<br>2：on top <br>3：down<br> 4：left <br>5：right <br>6：aperture plus <br>7：aperture reduction<br>8：scaling increment<br>9：scaling down<br>10：focal length plus <br>11：focal length minus<br>12:auxiliary switch<br>13:setting preset pointsbr<br>14:calling preset points<br>15:clear preset points |
| Type of video                  | timing:1<br> mobility:2 <br> give a warning:4<br> manually operated:8 <br> All types: 15，15 Use this when retrieving video footage                                                                                                                                                                                                                         |

## ３.Externally Called Methods

### Connected Devices

#### Method Description

| serial number | method name   | method description                                 | invoke an object |
| ------------- | ------------- | -------------------------------------------------- | ---------------- |
| 1             | ConnectDevice | Connect device method, send connect device command | Player           |

#### Callback Parameter

Example of a callback

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

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP, prioritize the use of device ID connection, use IP connection when there is no device ID, allowed to be empty when there is ID |
| 3 | user | String | Device user name |
| 4 | pwd | String | Device password |
| 5 | winindex | Number | Linked index |
| 6 | port | Number | Used for IP connections, port 10000 is recommended |
| 7 | connectType | Number | Connection method 0: Pre-connected 1: Connected and stream open |
| 8 | channel | Number | channel |
| 9 | streamid | Number | Code stream type, valid when connection mode is 1 |

### Login Device

#### Method Description

| serial number | method name | method description                                                 | invoke an object |
| ------------- | ----------- | ------------------------------------------------------------------ | ---------------- |
| 1             | login       | Command sent after successful connection, logging in to the device | Player           |

#### Callback Parameter

Example of a callback

```js
ConnectApi.login(session, username, password);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | session | String | Connected object |
| 2 | username | String | Device user name |
| 3 | password | String | Device password |

### Open Stream

#### Method Description

| serial number | method name | method description                                                   | invoke an object |
| ------------- | ----------- | -------------------------------------------------------------------- | ---------------- |
| 1             | OpenStream  | Turning on device streaming triggers a live video streaming callback | Player           |

#### Callback Parameter

Example of a callback

```js
Player.OpenStream(deviceid, ip, channel, streamid, winindex);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Number | channel |
| 4 | streamid | Number | stream type |
| 5 | winindex | Number | Rendered form index |

### Turn Off Streaming

#### Method Description

| serial number | method name | method description        | invoke an object |
| ------------- | ----------- | ------------------------- | ---------------- |
| 1             | CloseStream | Turn off device streaming | Player           |

#### Callback Parameter

Example of a callback

```js
Player.CloseStream(keyindex);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | keyindex | Number | Forms index |

### Set Resolution

#### Method Description

| serial number | method name   | method description                       | invoke an object |
| ------------- | ------------- | ---------------------------------------- | ---------------- |
| 1             | setResolution | Modify canvas video rendering resolution | Player           |

#### Callback Parameter

Example of a callback

```js
Player.setResolution(keyindex, width, height);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | keyindex | Number | Forms index |
| 2 | width | Number | |
| 3 | height | Number | |

### PTZ Control

#### Method Description

| serial number | method name | method description            | invoke an object |
| ------------- | ----------- | ----------------------------- | ---------------- |
| 1             | ptz_ctrl    | Control device head operation | Player           |

#### Callback Parameter

Example of a callback

```js
Player.ptz_ctrl(deviceid, ip, channel, type, param);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Number | channel |
| 4 | type | Number | Pantai action <br>0:Stop 1:Auto Horizontal Rotation 2:Up 3:Down 4:Left 5:Right 6:Aperture Plus 7:Aperture Minus 8:Zoom Increase 9:Zoom Decrease 10:Focus Increase 11:Focus Decrease 12:Auxiliary Switches 13:Setting Preset Points 14:Recalling Preset Points 15:Clearing Preset Points |
| 5 | param | Number | Gimbal control parameters, according to the action set, pass 1-5 when the representative speed, 13 and 14 is to pass the preset bit |

### Switching Streams

#### Method Description

| serial number | method name  | method description       | invoke an object |
| ------------- | ------------ | ------------------------ | ---------------- |
| 1             | ChangeStream | Switching device streams | Player           |

#### Callback Parameter

Example of a callback

```js
Player.ChangeStream(deviceid, ip, channel, streamid, winindex);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Number | channel |
| 4 | streamid | Number | To switch the stream type |
| 5 | winindex | Number | Rendered forms index |

### Disconnecting the device

#### Method Description

| serial number | method name      | method description       | invoke an object |
| ------------- | ---------------- | ------------------------ | ---------------- |
| 1             | DisConnectDevice | Disconnecting the device | Player           |

#### Callback Parameter

Example of a callback

```js
Player.DisConnectDevice(deviceid, ip);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |

### Video Playback Retrieval

#### Method Description

| serial number | method name  | method description                                                                                                                                                                         | invoke an object |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| 1             | SreachRecord | Query the equipment specified channel video, note that you can not perform two executions at the same time, the caller to note that in the query to prevent the user from other operations | Player           |

#### Callback Parameter

Example of a callback

```js
Player.SreachRecord(deviceid, ip, channel, begintime, endtime, type);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | String | channel |
| 4 | begintime | String | Start time Second timestamp |
| 5 | endtime | String | End time Second timestamp |
| 6 | type | String | Video Type, Timed:1 Motion:2 Alarm:4 Manual:8 All Types: 15 |

### Stop Video Query

#### Method Description

| serial number | method name | method description | invoke an object |
| ------------- | ----------- | ------------------ | ---------------- |
| 1             | Stopsearch  | Stop video query   | Player           |

#### Callback Parameter

Example of a callback

```js
Player.Stopsearch(deviceid, ip);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |

### Starting Video Playback

#### Method Description

| serial number | method name   | method description                                        | invoke an object |
| ------------- | ------------- | --------------------------------------------------------- | ---------------- |
| 1             | StartPlayBack | Playback of video recordings at a specified point in time | Player           |

#### Callback Parameter

Example of a callback

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

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | String | channel |
| 4 | begintime | String | Recording start time Second timestamp |
| 5 | endtime | String | Video end time Seconds timestamp |
| 6 | type | String |Video Type, Timed:1 Motion:2 Alarm:4 Manual:8 All Types: 15|
| 7 | winindex | String | Forms Index |
| 8 | isSound | String | Whether to play audio, business logic encapsulated field, may not be passed |

### Pause Playback

#### Method Description

| serial number | method name   | method description     | invoke an object |
| ------------- | ------------- | ---------------------- | ---------------- |
| 1             | PausePlayBack | Pause current playback | Player           |

#### Callback Parameter

Example of a callback

```js
Player.PausePlayBack(deviceid, ip);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |

### Continue to playback

#### Method Description

| serial number | method name      | method description             | invoke an object |
| ------------- | ---------------- | ------------------------------ | ---------------- |
| 1             | ContinuePlayBack | Continue with current playback | Player           |

#### Callback Parameter

Example of a callback

```js
Player.ContinuePlayBack(deviceid, ip);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |

### Stop Playback

#### Method Description

| serial number | method name      | method description             | invoke an object |
| ------------- | ---------------- | ------------------------------ | ---------------- |
| 1             | ContinuePlayBack | Continue with current playback | Player           |

#### Callback Parameter

Example of a callback

```js
Player.StopPlayBack(deviceid, ip, channel);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | String | channel |

### Player Initialization

#### Method Description

| serial number | method name | method description                                                                                                               | invoke an object |
| ------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1             | init        | Player initialization, pass an array of canvas elements, for example 4 windows, pass an array containing these 4 canvas elements | Player           |

#### Callback Parameter

Example of a callback

```js
Player.init(playerArr);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | playerArr | Array | Canvas Array |

### Screenshots

#### Method Description

| serial number | method name | method description              | invoke an object |
| ------------- | ----------- | ------------------------------- | ---------------- |
| 1             | Snapshot    | Take a screenshot of the screen | Player           |

#### Callback Parameter

Example of a callback

```js
Player.Snapshot(winindex, mode, name, width, height, callback);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | winindex | Number | Form index value, required |
| 2 | mode | Number | Screenshot method 0:Use the canvas of the specified window to take a screenshot 1:Use the next frame stream data of the specified window to take a screenshot |
| 3 | name | String | File name, need to bring the format, currently supports png and jpg, default value: snapshot.png |
| 4 | width | Number | The width of the generated image. If you pass null, you will use the width of the canvas or the width of the stream depending on the way you take the screenshot, and you need to pass the width along with the height of the image. |
| 5 | height | Number | Generated image height If you pass null, you will use canvas height or stream height depending on the way you take the screenshot, and you need to pass the width of the image together. |
| 6 | callback | Function | Screenshot callback, need to get the picture data through the callback, do not download the picture, pass empty default directly download the picture |

### Initiate Intercom

#### Method Description

| serial number | method name | method description                                 | invoke an object |
| ------------- | ----------- | -------------------------------------------------- | ---------------- |
| 1             | OpenCall    | Initiate an intercom, and voice talk to the device | Player           |

#### Callback Parameter

Example of a callback

```js
Player.OpenCall(deviceid, ip, channel);
```

Parameter description
| 序号 | Parameter name | Parameter type | invoke an object |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Array | channel |

### Transmission Of Intercom Audio

#### Method Description

| serial number | method name | method description                                                             | invoke an object |
| ------------- | ----------- | ------------------------------------------------------------------------------ | ---------------- |
| 1             | CallSend    | Transmits real-time audio to the device upon successful initiation of intercom | Player           |

#### Callback Parameter

Example of a callback

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

Parameter description
| serial number | parameter name | parameter type | invoke an object |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Number | channel |
| 4 | time_stamp | Number | Device ID |
| 5 | enc | String | Device IP |
| 6 | sample_rate | String | channel |
| 7 | sample_width | Number | Device ID |
| 8 | channels | Number | Device IP |
| 9 | compress_ratio | Number | channel |
| 10 | voice_data | Uint8Array | Device IP |
| 11 | voice_data_size | Number | channel |

### Turn off the intercom

#### Method Description

| serial number | method name | method description                                                             | invoke an object |
| ------------- | ----------- | ------------------------------------------------------------------------------ | ---------------- |
| 1             | CallHangup  | Transmits real-time audio to the device upon successful initiation of intercom | Player           |

#### Callback Parameter

Example of a callback

```js
Player.CallHangup(deviceid, ip, channel);
```

Parameter description
| serial number | parameter name | parameter type | clarification |
| ---- | ---- | ---- | ---- |
| 1 | deviceid | String | Device ID |
| 2 | ip | String | Device IP |
| 3 | channel | Number | channel |

### Remote Setting

#### Method Description

| serial number | method name   | method description                                        | invoke an object |
| ------------- | ------------- | --------------------------------------------------------- | ---------------- |
| 1             | RemoteSetting | Setting items after successful login of device connection | Player           |

#### Callback Parameter

Example of a callback

```js
Player.RemoteSetting = function (id, ip, str) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification                                                                                           |
| ------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| 1             | id             | String         | Device ID                                                                                               |
| 2             | ip             | String         | Device IP                                                                                               |
| 3             | channel        | Number         | Remote setting contents (refer to **5. Remote setting operation instructions** for detailed parameters) |

## ４.Callback Definitions

### Connection Callback

#### Method Description

| serial number | method name | method description                                                                | call object |
| ------------- | ----------- | --------------------------------------------------------------------------------- | ----------- |
| 1             | onconnect   | Device connection callback, response callback after calling the connection method | ConnectApi  |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onconnect = function (session, code) {
  if (code === 0) {
    ConnectApi.login(session, session.user, session.pwd);
  }
};
```

Parameter description

| serial number | method name | parameter type                                                                    | clarification                                                                                                                                             |
| ------------- | ----------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | session     | Object                                                                            | ConnectApi                                                                                                                                                |
| 2             | code        | Device connection callback, response callback after calling the connection method | Status code, to determine whether the connection is successful or connection failure, 0 for success, other for failure, failure may be the device offline |

### Login Callbacks

#### Method Description

| serial number | method name   | method description                                                      | invoke an object |
| ------------- | ------------- | ----------------------------------------------------------------------- | ---------------- |
| 1             | onloginresult | Device login callback, response callback after calling the login method | ConnectApi       |

#### Callback Parameters

Example of a callback

```js
ConnectApi.onloginresult = function (session, code) {};
```

Parameter description

| serial number | method name | parameter type                                                                    | clarification                                                                                                                                                      |
| ------------- | ----------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1             | session     | Object                                                                            | ConnectApi                                                                                                                                                         |
| 2             | code        | Device connection callback, response callback after calling the connection method | Status code, to determine whether the login success or login failure, 0 for success, the other for failure, failure indicates that the user name or password error |

### Disconnect Callback

#### Method Description

| serial number | method name  | method description                                                                                                                 | invoke an object |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1             | ondisconnect | Callbacks triggered when a device connection is disconnected, triggered when it is passively disconnected due to the network, etc. | ConnectApi       |

#### Callback Parameters

Example of a callback

```js
ConnectApi.ondisconnect = function (session, code) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification    |
| ------------- | -------------- | -------------- | ---------------- |
| 1             | session        | Object         | connected object |
| 2             | code           | Number         | status code      |

### Open Stream Callback

#### Method Description

| serial number | method name  | method description                                                                  | invoke an object |
| ------------- | ------------ | ----------------------------------------------------------------------------------- | ---------------- |
| 1             | onopenstream | Open device stream callback, response callback after calling the open stream method | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onopenstream = function (
  session,
  channel,
  streamid,
  result,
  cam_desc
) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification                                              |
| ------------- | -------------- | -------------- | ---------------------------------------------------------- |
| 1             | session        | Object         | Connected object                                           |
| 2             | channel        | Number         | Channel, open the channel corresponding to the code stream |
| 3             | streamid       | Number         | Code stream value                                          |
| 4             | code           | Number         | Status code, 0 is success, other is failure                |

### Gimbal Control Callbacks

#### Method Description

| serial number | method name | method description                      | invoke an object |
| ------------- | ----------- | --------------------------------------- | ---------------- |
| 1             | onptzresult | Callback after sending a gimbal command | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onptzresult = function (session, code) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification                                  |
| ------------- | -------------- | -------------- | ---------------------------------------------- |
| 1             | session        | Object         | Connected object                               |
| 4             | code           | Number         | Status code, 0 for success, others for failure |

### Live Video Streaming Callbacks

#### Method Description

| serial number | method name   | method description                                    | invoke an object |
| ------------- | ------------- | ----------------------------------------------------- | ---------------- |
| 1             | onrecvframeex | Callback method after sending the open stream command | ConnectApi       |

#### Callback Parameter

Example of a callback

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

Parameter description

| serial number | parameter name | parameter type | clarification                                              |
| ------------- | -------------- | -------------- | ---------------------------------------------------------- |
| 1             | session        | Object         | Connected object                                           |
| 2             | frametype      | Number         | Frame type <br>0 Audio frames<br> 1 I-frame<br> 2 P-frames |
| 3             | data           | Buffer         | Video frame data                                           |
| 4             | datalen        | Number         | Video data length                                          |
| 5             | channel        | Number         | channel value                                              |
| 6             | width          | Number         | Frame width                                                |
| 7             | height         | Number         | High frame rate                                            |
| 8             | enc            | Number         | Coding format                                              |
| 9             | fps            | Number         | Frame rate                                                 |
| 10            | timestamp      | Number         | The timestamp of this frame                                |

### Playback Video Streaming Callback

#### Method Description

| serial number | method name    | method description                                      | invoke an object |
| ------------- | -------------- | ------------------------------------------------------- | ---------------- |
| 1             | onrecvrecframe | Callback method after sending the open playback command | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onrecvrecframe = function (session, frametype, data, datalen, channel, width, height, enc, fps, ts_ms)){

}
```

Parameter description

| serial number | parameter name | parameter type | clarification                                               |
| ------------- | -------------- | -------------- | ----------------------------------------------------------- |
| 1             | session        | Object         | Connected object                                            |
| 2             | frametype      | Number         | Frame type <br/>0 Audio frames<br/>1 I-frame<br/>2 P-frames |
| 3             | data           | Buffer         | Video frame data                                            |
| 4             | datalen        | Number         | Video data length                                           |
| 5             | channel        | Number         | channel value                                               |
| 6             | width          | Number         | Frame width                                                 |
| 7             | height         | Number         | High frame rate                                             |
| 8             | enc            | Number         | Coding format                                               |
| 9             | fps            | Number         | Frame rate                                                  |
| 10            | timestamp      | Number         | The timestamp of this frame                                 |

### Query Playback Return Data Callback

#### Method Description

| serial number | method name | method description                                         | invoke an object |
| ------------- | ----------- | ---------------------------------------------------------- | ---------------- |
| 1             | onsearchrec | Callback method after sending a playback retrieval command | ConnectApi       |

#### Callback Parameter

Example of a callback

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

Parameter description

| serial number | parameter name | parameter type | clarification                                 |
| ------------- | -------------- | -------------- | --------------------------------------------- |
| 1             | session        | Object         | Connected object                              |
| 2             | channel        | Number         | Channel value                                 |
| 3             | file_type      | Number         | Video Type, Timed:1 Motion:2 Alarm:4 Manual:8 |
| 4             | file_begintime | Number         | Video start time                              |
| 5             | file_endtime   | String         | Video end time                                |
| 6             | file_total     | Number         | Total number of videos retrieved              |

### Playback Retrieve End Callback

#### Method Description

| serial number | method name    | method description                                                  | invoke an object |
| ------------- | -------------- | ------------------------------------------------------------------- | ---------------- |
| 1             | onsearchrecend | Playback callback method triggered when video retrieval is complete | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onsearchrecend = function (session) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification    |
| ------------- | -------------- | -------------- | ---------------- |
| 1             | session        | Object         | Connected object |

### p2p Error Callback

#### Method Description

| serial number | method name | method description                      | invoke an object |
| ------------- | ----------- | --------------------------------------- | ---------------- |
| 1             | onp2perror  | Callbacks for errors on P2P connections | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onp2perror = function (session, code) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification    |
| ------------- | -------------- | -------------- | ---------------- |
| 1             | session        | Object         | Connected object |
| 2             | code           | Number         | Error code       |

### Intercom Callback

#### Method Description

| serial number | method name       | method description          | invoke an object |
| ------------- | ----------------- | --------------------------- | ---------------- |
| 1             | onvop2pcallresult | Initiate intercom callbacks | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onvop2pcallresult = function (session, code) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification    |
| ------------- | -------------- | -------------- | ---------------- |
| 1             | session        | Object         | Connected object |
| 2             | code           | Number         | Error code       |

### Remote Setup Callbacks

#### Method Description

| serial number | method name   | method description                                   | invoke an object |
| ------------- | ------------- | ---------------------------------------------------- | ---------------- |
| 1             | onremotesetup | Callback to initiate remote setup after device login | ConnectApi       |

#### Callback Parameter

Example of a callback

```js
ConnectApi.onremotesetup = function (api_conn, str, data_size, result) {};
```

Parameter description

| serial number | parameter name | parameter type | clarification              |
| ------------- | -------------- | -------------- | -------------------------- |
| 1             | api_conn       | Object         | Connection status object   |
| 2             | str            | Object         | Remote setting return data |
| 3             | data_size      | Number         | data length                |
| 4             | result         | Number         | status code                |

## 5.Precaution

1.Browser decoding performance is limited, please do not play more than 4 screens at the same time.

2.The device user name defaults to admin, and the password defaults to empty. If the device connects successfully but cannot log in, the password may be wrong, so you can try to reset the device and retry.

3.The Canvas tag of the player must specify the width and height, the value can not be a percentage, otherwise it will lead to the screen rendering blurred, if you need to do the interface adaptive, you have to reset the width and height after each change

4.Intercom need to get the microphone, because of Google Chrome and other browsers to limit the http environment to get the microphone, you need to localhost access to the web interface or access under HTTPS, other solutions, please search for the browser in the http request can not turn on the microphone problems

### RTMP Settings

#### parameters

| serial number | parameter name | typology | clarification |
| ------------- | -------------- | -------- | ------------- |
| 1             | Network        | object   | FixMe         |

Get example (get)

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

Example of setting (set)

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

Parameter description

| serial number | parameter name | parameter type | clarification                                        |
| ------------- | -------------- | -------------- | ---------------------------------------------------- |
| 1             | Enabled        | bool           | Whether to enable rtmp                               |
| 2             | RtmpUrl        | string         | rtmp push address                                    |
| 3             | Stream         | number         | Optional 0 for main stream, 1 for sub-stream (HD/SD) |
| 4             | OnlyMotDet     | bool           | Event only push rtmp streams                         |

### Reboot the Camera

#### parameters

| serial number | parameter name  | typology | clarification |
| ------------- | --------------- | -------- | ------------- |
| 1             | SystemOperation | json     | FixMe         |

Example of setting (set)

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

Parameter description

| serial number | parameter name | parameter type | clarification |
| ------------- | -------------- | -------------- | ------------- |
| 1             | Reboot         | bool           | reboot        |

### Video encoding settings

#### parameters

| serial number | parameter name | typology | clarification |
| ------------- | -------------- | -------- | ------------- |
| 1             | videoManagerV2 | array    | FixMe         |

Get example (get)

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

Example of setting (set)

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

Parameter description

| serial number | parameter name | parameter type | clarification  |
| ------------- | -------------- | -------------- | -------------- |
| 1             | resolution     | string         | Resolution     |
| 2             | bitRateType    | string         | Code rate type |
| 3             | bitRate        | number         | bitrate        |
| 4             | frameRate      | number         | frame rate     |

### Enabling And Disabling White Light

#### parameters

| serial number | parameter name | typology | clarification             |
| ------------- | -------------- | -------- | ------------------------- |
| 1             | R/LightManCtrl | array    | Manual on/off white light |

Get example (get)

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

Example of setting (set)

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

Parameter description

| serial number | parameter name | parameter type | clarification                          |
| ------------- | -------------- | -------------- | -------------------------------------- |
| 1             | Operate        | string         | Manual on/off selectable ["ON", "OFF"] |

### Device Parameter Push

#### parameters

| serial number | parameter name     | typology | clarification                                                                                                                                  |
| ------------- | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | UploadCustomHealth | string   | Supports setting the Url address, port, push time and enable/disable push function to the device for the above device parameters to be pushed. |

Get example (get)

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

Example of setting (set)

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

Parameter description

| serial number | parameter name | parameter type | clarification                     |
| ------------- | -------------- | -------------- | --------------------------------- |
| 1             | Enabled        | bool           | Parameter Push Enable and Disable |
| 2             | Server         | string         | Parameter push address            |
| 3             | UploadPeriod   | number         | Device push interval in seconds   |
| 4             | Port           | number         | Device Push Port                  |

## 6.Remote Setting Operating Instructions

1．First the remote setup operation must be connected to the login device

2．Connect the device before clicking, the pop-up window will load and get the device's information by default

3．After setting the parameters and clicking Save Success will reload the pop-up window to refresh the information

4．Click on the left side of the configuration type, fill in the right side of the parameters and click on Save to set the parameters

function onGetSN(){
  var devId = document.getElementById("dev_id").value;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log(xhr.responseText);
        var res = JSON.parse(xhr.responseText);
        var sign_str = res.nonce.toUpperCase() + devId + res.request_id.toUpperCase() + "Japass^2>.j";
        var sign = stringChangeMd5(sign_str);

        var xhr1 = new XMLHttpRequest();
        xhr1.onreadystatechange = function(){
          if(xhr1.readyState === 4){
            if(xhr1.status === 200){
              console.log(xhr1.responseText);
              var sn = JSON.parse(xhr1.responseText)
              document.getElementById("dev_sn").innerText = sn.sn;
            }
          }
        }
        var url1 = "https://openapi.dvr163.com/device/device?method=get_sn&id=" + devId + "&request_id=" + res.request_id + "&verify=" + sign;
        xhr1.open("GET", url1);
        xhr1.send();
      }
    }
  }
  var url = "https://openapi.dvr163.com/message/nonce?method=get";
  xhr.open("GET", url);
  xhr.send();
}

var resolv_checkUID = function(sn){
  if(sn.length <= 10){
    console.log(sn);
    return sn;
  }

  var startIndex = sn.length - 10;
  for(var i = startIndex; i<= sn.length; i++){
    if(sn.charAt(i) != "0"){
      startIndex = i;
      break;
    }
  }
  console.log(sn.substr(startIndex));
  return sn.substr(startIndex);
}

var resolv_batchNum = function(yearStr, monStr){
  var mYear = this.resolv_decodeDiffYear(yearStr);
  var mYear_Mon = this.resolv_decodeMonth(mYear, monStr);
  return resolv_Date(mYear_Mon.year, mYear_Mon.mon);
}

var resolv_decodeDiffYear = function(year_str){
  var year_code = year_str.charCodeAt(0);
  if(year_code < 58) return year_code - 48;
  if(year_code < 91) return year_code - 55;
  return year_code - 61;
}

var resolv_decodeMonth = function(yearCode, month_str){
  var month_code = month_str.charCodeAt(0);
  var ret = 0;
  if(month_code == 48){
      //return resolv_decodeMonth(yearCode, 'z') + 1;
  var result = resolv_decodeMonth(yearCode, 'z');
  result.mon += 1;
  return result;
  }
  else if((month_code > 48) && (month_code < 58)){
      ret = month_code - 48;
  }
  else if(month_code < 91){
      ret = month_code - 55;
  }
  else {
      ret = month_code - 61;
  }

  var retMod = ret % 12;
  var times = Math.floor(ret / 12);
  if(retMod == 0){
      retMod = 12;
      times = times - 1;
  }

  var diffYear = times * 62 + yearCode + 2010;
  return {"year":diffYear,"mon":retMod};
}

var resolv_Date = function(mYear, mMon){
  if(mYear < 2023) return 0;
  if((mYear == 2023) && (mMon < 5)) return 0;
  if(mYear < 2320) return (mYear - 2024) * 12 + 8 + mMon;
  return (2320-2024) * 12 + 8 + (mYear - 2320) * 2 + mMon;
}

/**
* 根据SN确定寻址的域名
* @param {*} sn 
*/
var resolv_domain = function(sn, usehttps){
  if(sn.length > 10){
      var yearStr = sn.substr(sn.length - 12, 1);
      var monStr = sn.substr(sn.length - 11, 1);
      var ngwIndex = this.resolv_batchNum(yearStr, monStr);

      var port = 80;
      if(usehttps)port = 443;

      var domain = "ngw-cli.dvr163.com";
      if(ngwIndex > 0){
          domain = "ngw-cli-" + ngwIndex + ".dvr163.com";
      }

      return {"domain":domain,"port":port}
  }
  else{
      if(usehttps){
          return {"domain":"ngw-cli.dvr163.com","port":443};
      }
      else{
          return {"domain":"ngw-cli.dvr163.com","port":80};
      }
  }
}	

function onDomainTest(){
  var devId = document.getElementById("dev_id").value;

  //console.log(resolv_checkUID(devId));
  var domainFirstChar = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  var domainSecondChar = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0";

  var loopCount = Math.ceil(domainSecondChar.length / 12);
  var secondIndex = 0;
  var printIndex = 1;

  for(var i = 0; i < loopCount; i++){
    for(var j = 0; j< domainFirstChar.length; j++){
      var count = domainSecondChar.length - secondIndex;
      if(count > 12){
        count = 12;
      }
      else{
        count = domainSecondChar.length - secondIndex;
      }
      for(var k = 0; k < count; k++){
        var domain_str = domainFirstChar.substr(j, 1) + domainSecondChar.substr(k + secondIndex, 1);
        if(domain_str == "00"){
          console.log("------------------------------");
        }
        var sn = "JAAA" + domain_str + devId;
        let domain = resolv_domain(sn, true);
        domain.key = domain_str;
        console.log(printIndex, domain);
        printIndex++;
      }
    }
    secondIndex += 12;
  }
}
  
function onMD5(){
  var devId = document.getElementById("dev_id").value;

  var str = stringChangeMd5(devId);
  console.log("md5", str)
}

// var last_rec_time = 0;
// ConnectApi.onRecordFetch = function(file_type, file_begintime, file_endtime){
// 	if(file_endtime - file_begintime <= 0){
// 		return;
// 	}
// 	var tr = document.createElement("tr");
// 	var td_begin = document.createElement("td");
// 	var td_end = document.createElement("td");
// 	var td_times = document.createElement("td");
// 	var td_type = document.createElement("td");

// 	td_begin.innerText = new Date((file_begintime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();	
// 	td_end.innerText = new Date((file_endtime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
// 	td_times.innerText = file_endtime - file_begintime;
// 	if(file_type == 1){
// 		td_type.innerText = "日程录像"
// 	}
// 	else{
// 		td_type.innerText = "报警录像";
// 	}		

// 	if(file_begintime == last_rec_time){
// 		tr.style.background = "blue"
// 	}
// 	last_rec_time = file_begintime;

// 	td_begin.style = "border:solid 1px black"
// 	td_end.style = "border:solid 1px black"
// 	td_times.style = "border:solid 1px black"
// 	td_type.style = "border:solid 1px black"

// 	tr.appendChild(td_begin);
// 	tr.appendChild(td_end);
// 	tr.appendChild(td_times);
// 	tr.appendChild(td_type);

// 	var recListTable = document.getElementById("recListTable");
// 	recListTable.appendChild(tr);
// }

// ConnectApi.onRecFrameTimestamp = function(timestamp){
// 	//console.log(timestamp);
// 	//console.log(new Date().getTimezoneOffset());
// 	document.getElementById("playback_time").value = new Date((timestamp + new Date().getTimezoneOffset() *60 * 1000)).toLocaleString();	
// }
var girdData = null
window.girdData = girdData
ConnectApi.onRemoteSetup = function(remote_str){
  var config = JSON.parse(remote_str);

  if(config.option){
    const lang = document.getElementById("language").value
    let sucMsg = lang ==="zh_CN"?'设置成功':'Setup Success'
    let failedMsg = lang ==="zh_CN"?'设置失败':'Setup failure'
    if(config.option == "success"){
      alert(sucMsg);
    }
    else{
      alert(failedMsg)
    }
  }
  if(config.UserManager){
    if(config.UserManager){
      document.getElementById('devicePassword').value =  config.UserManager.password
    }
  }
  if(config.IPCam){
    if(config.IPCam?.recordInfo){
      if(config.IPCam?.recordInfo.recordScheduleDateInfo){
        let results = config.IPCam.recordInfo.recordScheduleDateInfo[0]
        let Datestrlist = [];
        if (!results.recordDay) {
          return;
        }
        results.recordDay.forEach(str => {
          const regex = /0x[a-fA-F0-9]+/g;
          let Hexstr = str.match(regex);
    
          let Hex = parseInt(Hexstr[0]).toString(2);
          let Hexlist = Hex.split("").reverse();
          let Datestr = str.split("-")[0] + '-' +  str.split("-")[1]+'-'
          for (let index = 0; index <= Hexlist.length; index++) {
              if (Hexlist[index] == 1) {
                Datestrlist.push(Datestr + `${index + 1}`);
              }
            }
        });
        let html = ''
        Datestrlist.forEach((item=>{
          html +=  `<option value="${item}"> ${item}</option>`
        }))
        document.getElementById('searchVideoDates').innerHTML = html
      }
    }
    if(config.IPCam?.videoManager){
      if(config.IPCam.videoManager.streamId == 1){
        var streamType = document.getElementById("streamType");
        streamType.innerText = "mainStream:" + config.IPCam.videoManager.encType
      }
      if(config.IPCam.videoManager.streamId == 2){
        var streamType = document.getElementById("streamType");
        streamType.innerText = "subStream:" + config.IPCam.videoManager.encType
      }				
    }
    if(config.IPCam?.ModeSetting){
      if(config.IPCam.ModeSetting.AudioVolume){
        var obj_out = document.getElementById("device_VolumeInput");
        obj_out.innerText = config.IPCam.ModeSetting.AudioVolume.AudioInputVolume;

        var obj_out = document.getElementById("device_VolumeOutput");
        obj_out.innerText = config.IPCam.ModeSetting.AudioVolume.AudioOutputVolume;
        document.getElementById("alarmVolume_val").innerText = config.IPCam.ModeSetting.AudioVolume.AlarmVolume
      }

      document.getElementById("AudioEnabled").checked = config.IPCam.ModeSetting.AudioEnabled;

      if(config.IPCam.ModeSetting.IRCutFilterMode){
        switch(config.IPCam.ModeSetting.IRCutFilterMode){
          case "ir":
            document.getElementById("ir").checked = (config.IPCam.ModeSetting.IRCutFilterMode == "ir");
            break;
          case "light":
            document.getElementById("light").checked = (config.IPCam.ModeSetting.IRCutFilterMode == "light");
            break;
          case "auto":
            document.getElementById("autolight").checked = (config.IPCam.ModeSetting.IRCutFilterMode == "auto");
            break;
        }
      }
      if(config.IPCam.ModeSetting.usageScenario){
        document.getElementById("usageScenario").value = config.IPCam.ModeSetting.usageScenario;
      }
    }

    if(config.IPCam?.videoManager){
      document.getElementById("flipEnabled").checked = config.IPCam.videoManager.flipEnabled;
      document.getElementById("mirrorEnabled").checked = config.IPCam.videoManager.mirrorEnabled;
    }

    if(config.IPCam?.WorkMode){
      document.getElementById("rec_mode_list").value = config.IPCam.WorkMode.Mode;
    }
    
    if(config.IPCam?.AlarmSetting){
      if(config.IPCam.AlarmSetting.MotionDetection){
        document.getElementById("warningTone").checked = config.IPCam.AlarmSetting.MotionDetection.MotionWarningTone;
        document.getElementById("motionTrackEnabled").checked = config.IPCam.AlarmSetting.MotionDetection.motionTrackEnabled;
        if(config.IPCam.AlarmSetting.MotionDetection.MdRecDuration){
          document.getElementById("alarm_rec_time").value = config.IPCam.AlarmSetting.MotionDetection.MdRecDuration;
        }

        if(JSON.stringify(config.IPCam.AlarmSetting.MotionDetection.grid)!=JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])){
          console.log("设置了网格区域侦测")
          window.girdData = JSON.parse(JSON.stringify(config.IPCam.AlarmSetting.MotionDetection.grid))
          
        }					
      }
    }
    if(config.IPCam?.TfcardManager){
      var tf_status = document.getElementById("tf_status");
      var tf_totalSize = document.getElementById("tf_totalSize");
      var tf_leaveSize = document.getElementById("tf_leaveSize");
      tf_status.innerText = config.IPCam.TfcardManager.Status;
      tf_totalSize.innerText = config.IPCam.TfcardManager.TotalSpacesize + "M";
      tf_leaveSize.innerText = config.IPCam.TfcardManager.LeaveSpacesize + "M";
    }
    if(config.IPCam?.Lte){
      var OperatorsName = document.getElementById("OperatorsName");
      var Signal = document.getElementById("Signal");
      OperatorsName.innerText = config.IPCam.Lte.OperatorsName;
      Signal.innerText = config.IPCam.Lte.Signal;
      if(config.IPCam?.Lte.ICCID){
        document.getElementById('SIM_ICCID').innerText = config.IPCam?.Lte.ICCID
      }
      if(config.IPCam?.Lte.IMSI){
        document.getElementById('SIM_IMSI').innerText = config.IPCam?.Lte.IMSI
      }
    }
    if (config.IPCam?.V2?.Network) {
      // rtmp
      if( config.IPCam.V2?.Network?.Rtmp){
        var RTMP = config.IPCam.V2?.Network?.Rtmp
        var rtmp = document.getElementById("rtmp")
        // var rtmpMobile = document.getElementById("rtmpMobile")
        var rtmpbox = document.getElementById("rtmpbox")
        var radioElements = document.getElementsByName("rtmpStream");
        // rtmpMobile.checked = RTMP?.OnlyMotDet
        rtmp.value = RTMP?.RtmpUrl;
        rtmpbox.checked = RTMP?.Enabled
        for (var i = 0; i < radioElements.length; i++) {
          if (radioElements[i].value == RTMP?.Stream) {
            radioElements[i].checked = true;
            break;
          }
        }
      }
      // ftp
      if( config.IPCam.V2?.Network?.Ftp){
        let Ftp =  config.IPCam.V2?.Network?.Ftp
        document.getElementById('bEnableFTP').checked = Ftp.bEnableFTP
        document.getElementById('bFtpSchduleEnable').checked = Ftp.bFtpSchduleEnable
        document.getElementById('bServerSyncEnble').checked = Ftp.bServerSyncEnble
        document.getElementById('nFTPPort').value = Ftp.nFTPPort
        document.getElementById('nFtpUploadWays').value = Ftp.nFtpUploadWays
        document.getElementById('nServerSyncType').value = Ftp.nServerSyncType
        document.getElementById('nServerSyncTime').value =  new Date(Ftp.nServerSyncTime*1000).toLocaleString()
        document.getElementById('strFTPuser').value = Ftp.strFTPuser
        document.getElementById('strFTPpassword').value = Ftp.strFTPpassword
        document.getElementById('szFTPServerIP').value = Ftp.szFTPServerIP
        document.getElementById('szFTPfolder').value = Ftp.szFTPfolder
        document.getElementById('szFtpServerPicturePath').value = Ftp.szFtpServerPicturePath
        document.getElementById('szFtpServerVideoPath').value = Ftp.szFtpServerVideoPath
        document.getElementById('nFtpTimeInterval').value = Ftp.nFtpTimeInterval
        document.getElementById('nFtpUploadContent').value = Ftp.nFtpUploadContent
        createStFtpScheduleHtmL(Ftp.stFtpSchedule)
      }
    }
    if (config.IPCam?.SystemOperation) {
      if(config.IPCam.SystemOperation.TimeSync){
        document.getElementById('timeZoneSetting').value = config.IPCam.SystemOperation.TimeSync.TimeZone
      }
    }
    if (config.IPCam?.V2?.Stat) {
      if(config.IPCam.V2.Stat.Rtmp){
        if(config.IPCam.V2.Stat.Rtmp ==='Success'){
          document.getElementById('rtmp_connect_status').innerText = 'Connected'
        }else{
          document.getElementById('rtmp_connect_status').innerText = 'Disconnected'
        }
      }
    }
    if (config.IPCam?.V2?.Record) {
      if(config.IPCam?.V2?.Record.TimeRecordDuration){
        document.getElementById('timeRecordDuration').value = config.IPCam?.V2?.Record.TimeRecordDuration
      }
      if(config.IPCam?.V2?.Record.Stream){
        document.getElementById('recordingResolution').value = config.IPCam?.V2?.Record.Stream
      }
    }
    // if (config.IPCam?.V2?.System) {
    //   var UploadCustomHealth = config.IPCam.V2.System?.SoftProbe?.UploadCustomHealth
    //   var serverbox = document.getElementById("serverbox")
    //   var serverUrl = document.getElementById("serverUrl")
    //   var pushTime = document.getElementById("pushTime")
    //   var pushPort = document.getElementById("pushPort")
    //   serverbox.checked = UploadCustomHealth.Enabled
    //   serverUrl.value = UploadCustomHealth.Server
    //   pushTime.value = UploadCustomHealth.UploadPeriod
    //   pushPort.value = UploadCustomHealth.Port
    // }
    if(config.IPCam?.videoManagerV2){
      // 主码流参数
      var selectElement = document.getElementById('mySelect');
      var opt = config.IPCam.videoManagerV2[0].resolutionProperty.opt
      // selectElement.value = config.IPCam.videoManagerV2[0].resolution
      selectElement.innerHTML = opt.map(v => `<option ${config.IPCam.videoManagerV2[0].resolution == v ? 'selected' : ''} value="${v}">${v}</option>`).join('')
      var bitRateType =  document.getElementById('bitRateType')
      var bitRateTypeOpt = config.IPCam.videoManagerV2[0].bitRateTypeProperty.opt
      // bitRateType.value = config.IPCam.videoManagerV2[0].bitRateType
      bitRateType.innerHTML = bitRateTypeOpt.map(v => `<option ${config.IPCam.videoManagerV2[0].bitRateType == v ? 'selected' : ''} value="${v}">${v == "CBR" ? "ABR" : v}</option>`).join('')
      var codeRrate1 = document.getElementById('codeRrate1')
      codeRrate1.value = config.IPCam.videoManagerV2[0].bitRate
      var frameRate1 = document.getElementById('frameRate1')
      frameRate1.value = config.IPCam.videoManagerV2[0].frameRate
      // 次码流参数获取赋值
      var selectElementTwo = document.getElementById('mySelectTwo');
      var optTwo = config.IPCam.videoManagerV2[1].resolutionProperty.opt
      selectElementTwo.value = config.IPCam.videoManagerV2[1].resolution
      selectElementTwo.innerHTML = optTwo.map(v => `<option ${config.IPCam.videoManagerV2[1].resolution == v ? 'selected' : ''} value="${v}">${v}</option>`).join('')
      var bitRateTypeTwo =  document.getElementById('bitRateTypeTwo')
      var bitRateTypeOptTwo = config.IPCam.videoManagerV2[1].bitRateTypeProperty.opt
      bitRateTypeTwo.value = config.IPCam.videoManagerV2[1].bitRateType
      bitRateTypeTwo.innerHTML = bitRateTypeOptTwo.map(v => `<option ${config.IPCam.videoManagerV2[1].bitRateType == v ? 'selected' :''} value="${v}">${v == "CBR" ? "ABR" : v}</option>`).join('')
      var codeRrate2 = document.getElementById('codeRrate2')
      codeRrate2.value = config.IPCam.videoManagerV2[1].bitRate
      var frameRate2 = document.getElementById('frameRate2')
      frameRate2.value = config.IPCam.videoManagerV2[1].frameRate
    }

    // 获取设备信息回调 Callback for get device information
    if (config.IPCam?.DeviceInfo) {
      DeviceInfo = config.IPCam?.DeviceInfo
      const { FWVersion } = DeviceInfo
      document.getElementById('currentFw').innerText = FWVersion
    }
  }
}
var playbackNum = 0;
var recorder = null
var splitdata = new window.JASplitData()
function test_clock_ms() {
  return (new Date()).valueOf();
}

function onCloseVideo(){
  closevideo();
  disconnect();
  window.setTimeout(onTest, 2000);
}

function onOpenVideo(){
  openvideo();

  window.setTimeout(onCloseVideo, 3000);
}

function onTest(){
  connect();
  window.setTimeout(onOpenVideo, 3000);
}

function getStreamType(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "videoManager":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);			
}

function setSubStream(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		
  var flip = document.getElementById("flipEnabled");
  var mirror = document.getElementById("mirrorEnabled");

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "videoManager":{
        "streamId":2,
        "encType":document.getElementById('subStreamEncType').value,			
        "flipEnabled":flip.checked,
        "mirrorEnabled":mirror.checked					
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);			
}

function setMainStream(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;	
  var flip = document.getElementById("flipEnabled");
  var mirror = document.getElementById("mirrorEnabled");

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "videoManager":{
        "streamId":1,
        "encType":document.getElementById('mainStreamEncType').value,
        "flipEnabled":flip.checked,
        "mirrorEnabled":mirror.checked      
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);	
}
// 获取视频流参数
function getvideoManagerV2(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;	
  let config = {
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
      };

  sendRemoteConfig(config);

}
function setvideoManagerV2(){
  // console.log(
  // 	document.getElementById("mySelect").value,
  // 	document.getElementById("bitRateType").value,
  // 	document.getElementById("codeRrate1").value,
  // 	document.getElementById("frameRate1").value,

  // 	document.getElementById("mySelectTwo").value,
  // 	document.getElementById("bitRateTypeTwo").value,
  // 	document.getElementById("codeRrate2").value,
  // 	document.getElementById("frameRate2").value,
  // );
  
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;	
  let config = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
      'videoManagerV2': [
        {
        'id': 0,
        'resolution': document.getElementById("mySelect").value,
        'bitRateType': document.getElementById("bitRateType").value,
        'bitRate': parseInt(document.getElementById("codeRrate1").value),
        'frameRate': parseInt(document.getElementById("frameRate1").value)
        },
        {
        'id': 1,
        'resolution': document.getElementById("mySelectTwo").value,
        'bitRateType': document.getElementById("bitRateTypeTwo").value,
        'bitRate': parseInt(document.getElementById("codeRrate2").value),
        'frameRate': parseInt(document.getElementById("frameRate2").value)
        },
      ],
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  // console.log(config);
}

function getUsageScenario(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);			
}

function setUsageScenario(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		
  if(document.getElementById("usageScenario").value == ""){
    return;
  }

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting":{
        "usageScenario":document.getElementById("usageScenario").value
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);				
}

function getMotionTrackEnabled(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{

        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);	
}

//sensitivity opt ["lowest","low","normal","high","highest"]
// function setMotionSensitivity(){
// 	var user = document.getElementById("user").value;
// 	var pwd = document.getElementById("pwd").value;		

// 	let config = {
// 		"Version": "1.3.0",
// 		"Method": "set",
// 		"IPCam": {
// 			"AlarmSetting":{
// 				"MotionDetection":{
// 					"SensitivityLevel":"nomral"
// 				}
// 			}
// 		},
// 		"Authorization": {
// 			"Verify": '',
// 			"username": user,
// 			"password": pwd
// 		}
   // 	 };

// 	sendRemoteConfig(config);	
// }	

function setMotionTrackEnabled(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{
          "motionTrackEnabled":document.getElementById("motionTrackEnabled").checked
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);	
}

function getAudioEnabled(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);		
}

function setAudioEnabled(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting":{
        "AudioEnabled":document.getElementById("AudioEnabled").checked
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);		
}

function getRecordMode(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "WorkMode":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);				
}

function setRecordMode(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "WorkMode":{
        "Mode":document.getElementById("rec_mode_list").value
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);				
}	

function onReboot(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;			
    var config = {
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
  sendRemoteConfig(config);
}

function getAlarmRecTime(){
  var alarm_rec_time = document.getElementById("alarm_rec_time");
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{

        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);		
}

function setAlarmRecTime(){
  var alarm_rec_time = document.getElementById("alarm_rec_time");
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{
          "MdRecDuration":parseInt(alarm_rec_time.value)
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);				
}

function sendRemoteConfig(config){
  console.log('sendRemoteConfig',config);
  var id = document.getElementById("dev_id").value;
  let session = null;
  session = GetSessionById(id);
  var str = JSON.stringify(config);
  if (session) {
    ConnectApi.remote_setup2(session, str)
  }	
}

function getWarningTone(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{

        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  
}	

function setWarningTone(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{
          "MotionWarningTone":document.getElementById("warningTone").checked
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  
}	
function getlightMan(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
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
      };

  sendRemoteConfig(config);
}	
function setlightMan(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  // console.log(document.getElementById("lightMan").checked,document.getElementById("lightMan").checked ? "ON": "OFF");
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "R/LightManCtrl":{
          "Operate":document.getElementById("lightMan").checked ? "ON": "OFF"
              }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
}
function getRtmp(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "V2":{
        "Network":{
          "Rtmp" : {
          }
        },
        "Stat":{
          "Rtmp":{

          }
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);

}
function setRtmp(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  var radioElements = document.getElementsByName("rtmpStream");
  var Stream
  for (var i = 0; i < radioElements.length; i++) {
    if (radioElements[i].checked) {
      Stream = radioElements[i].value
      break;
    }
  }
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "Network":{
          "Rtmp" : {
            "Enabled":document.getElementById("rtmpbox").checked,
            "RtmpUrl": document.getElementById("rtmp").value,
            "Stream": Number(Stream),
          }
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
}
function getUploadCustomHealth(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;	
  let config = {
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
  sendRemoteConfig(config);
}
function setUploadCustomHealth(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;	
  let config = {
    "Version": "2.1.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "System":{
          "SoftProbe":{
            "UploadCustomHealth":{
              "Enabled":document.getElementById("serverbox").checked,
              "Server":document.getElementById("serverUrl").value,
              "UploadPeriod":parseInt(document.getElementById("pushTime").value),
              "Port":parseInt(document.getElementById("pushPort").value)
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
  sendRemoteConfig(config);
}

function getIR(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  
}	

function setIR(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting":{
        "IRCutFilterMode":"ir"
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

   if(document.getElementById("ir").checked){
    config.IPCam.ModeSetting.IRCutFilterMode = "ir";
   }
   else{
    config.IPCam.ModeSetting.IRCutFilterMode = "light";
   }

  sendRemoteConfig(config);
  
}		


function getLight() {
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting": {
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);

}

function setLight() {
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting": {
        "IRCutFilterMode": "light"
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  if (document.getElementById("light").checked) {
    config.IPCam.ModeSetting.IRCutFilterMode = "light";
  }
  else {
    config.IPCam.ModeSetting.IRCutFilterMode = "ir";
  }

  sendRemoteConfig(config);

}

function getAutoLight() {
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting": {
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);

}

function setAutoLight() {
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting": {
        "IRCutFilterMode": "auto"
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);

}

function getVideoManager(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "videoManager":{
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  
}

function deviceAlarm(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "R/SoundManCtrl":{
          "Operate":"ON",
          "DurSec":10,
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);		
}
function deviceAlarm_stop(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "R/SoundManCtrl":{
          "Operate":"OFF",
          "DurSec":10,
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);		
}
function setVideoManager(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "videoManager":{
        "flipEnabled":document.getElementById("flipEnabled").checked,
        "mirrorEnabled":document.getElementById("mirrorEnabled").checked
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);			
}

function getDeviceVolume(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting":{
        "AudioVolume":{

        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
}

function setDeviceVolume(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  var volume = parseInt(document.getElementById("device_SetVolume").value);

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting":{
        "AudioVolume":{
          "AudioInputVolume":volume,
          "AudioOutputVolume":volume
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);	
}
function setAlarmVolume(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  var volume = parseInt(document.getElementById("AlarmVolume").value);

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "ModeSetting":{
        "AudioVolume":{
          "AlarmVolume":volume,
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);	
}
function remoteSetup(){
  //console.log('开始远处设置', id, ip, str)

  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.2.0",
    "Method": "get",
    "IPCam": {
      "ModeSetting": {
      },
      "videoManager":{

      },
      "AlarmSetting":{
        "MotionDetection":{

        }
      },
      "SystemOperation":{
        "TimeSync":{}
      },
      "ChannelStatus":{

      },
      "LTE":{

      },
      "TfcardManager":{

      },
      'videoManagerV2': [],
      "V2":{
        "Network":{
          "Rtmp":{}
        },
        "R/LightManCtrl":{},
        "System":{
          "SoftProbe":{
            "UploadCustomHealth":{}
          }
        },
        "Record":{

        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
}

function getTFCardStatus(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "TfcardManager":{

      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };
  sendRemoteConfig(config);		
}

function formatTFCard(){
  if(!window.confirm("格式化TF卡，请谨慎操作")){
    return;
  }
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "TfcardManager":{
        "Operation":"format"
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };
  sendRemoteConfig(config);				
}

//初始化canvas播放器
function init() {
  let canvas = document.getElementById("canvas1")
  let canvasList = document.getElementById("canvasList")
  Player.init(canvasList.children);
}
init();
function connect() {
  var devid = document.getElementById("dev_id").value;
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  var streamid = parseInt(document.getElementById("streamtype").value);
  var channel = parseInt(document.getElementById("channel").value);
  // Player.ConnectDevice("5436476317", '', user, pwd, 0, 80, 0, channel, streamid, "wss", null, "", "")
  // Player.ConnectDevice("5399935818", '', user, pwd, 0, 80, 0, channel, streamid, "wss", null, "", "")
  // Player.ConnectDevice("6499756661", '', user, 'c68073b9b350d6945ba91bcc2518e04d', 0, 80, 0, channel, streamid, "wss", null, "", "")
  Player.ConnectDevice(devid, '', user, pwd, 0, 80, 0, channel, streamid, "wss", null, "", "")
  // for(let i = 0; i < 8; i++) {
  //   Player.ConnectDevice("5027767975", '', user, pwd, i, 80, 0, i, streamid, "wss", null, "", "")
  // }
  
  
  // for(let i = 0; i < WIN_NUMB; i++) {
  //   Player.ConnectDevice(devid, '', user, pwd, i, 80, 0, channel, streamid, "wss", null, "", "")
  // }
  
}
function disconnect(params) {
  var devid = document.getElementById("dev_id").value;
  Player.DisConnectDevice(devid)
}
function openvideo() {
  var streamid = parseInt(document.getElementById("streamtype").value);
  var channel = parseInt(document.getElementById("channel").value);
  document.getElementById("channel").disabled = true;
  var devid = document.getElementById("dev_id").value;
  
  // Player.OpenStream("5436476317", '', channel, streamid, 0);
  // Player.OpenStream("5399935818", '', channel, streamid, 0);
  // Player.OpenStream("6499756661", '', channel, streamid, 0);
  playerList[0].SetStreamMode(0)
  Player.OpenStream(devid, '', channel, streamid, 0);
  // for(let i = 0; i < 8; i++) {
  //   Player.OpenStream("5027767975", '', i, streamid, i);
  // }
  // for(let i = 0; i < WIN_NUMB; i++){
  //   Player.OpenStream(devid, '', channel, streamid, i);
  // }
  
}

function closevideo() {
  
  Player.CloseStream(0)
}

function changestream() {
  //closevideo();
  var obj = document.getElementById("streamtype");
  if (obj.value == 0) {
    obj.value = 1;
  } else {
    obj.value = 0;
  }
  //openvideo();
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ChangeStream(devid, '', channel, obj.value)
}
function ptz_ctrl_set_preset(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 13, document.getElementById("presetName").value);
}
function ptz_ctrl_load_preset(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 14, document.getElementById("presetName").value);
}

function ptz_ctrl_clear_preset(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 15,0);
}

function ptz_ctrl_check(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 16, 6)
}

function ptz_ctrl_up() {
  console.log(1111);
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 2, 6)
}
function ptz_ctrl_down() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 3, 6)
}
function ptz_ctrl_left() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 4, 6)
}
function ptz_ctrl_right() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 5, 6)
}
function ptz_ctrl_zoom_in() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 8, 6)
}
function ptz_ctrl_zoom_out() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 9, 6)
}		
function ptz_ctrl_stop() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, 0, 0)
}
  // type 8：缩放增 9：缩放减 10：焦距加 11：焦距减 
  function ptz_ctrl_lens(type){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.ptz_ctrl(devid, '', channel, type, 6)
}
function searchrecord() {
  var recListTable = document.getElementById("recListTable");
  // while (recListTable.rows.length > 0) {
  //   recListTable.deleteRow(0);
  // }
  for (var i = recListTable.rows.length - 1; i >= 1; i--) {
    recListTable.deleteRow(i);
  }
  document.getElementById("div_recList").style.display = "";
  var trList = recListTable.childNodes;
  for(var i=trList.length - 1; i>1 ;i--){
    recListTable.removeChild(trList[i]);
  }
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  var playback_startTime = document.getElementById("playback_startTime").value;
  var playback_endTime = document.getElementById("playback_endTime").value;
  var startTime = (Date.parse(playback_startTime)) / 1000 - new Date().getTimezoneOffset() *60;
  var endTime = (Date.parse(playback_endTime)) / 1000 - new Date().getTimezoneOffset() *60;

  Player.SreachRecord(devid, '', channel, startTime, endTime, 15)
}
function playback_playFast(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;		
  Player.PlayFast(devid, '', channel);
}
function playback_playSlow(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;		
  Player.PlaySlow(devid, '', channel);
}
function playback_playNormal(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;		
  Player.PlayNormal(devid, '', channel);
}
function playback_byTime(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;		
  var playback_startTime = document.getElementById("playback_startTime").value;
  var playback_endTime = document.getElementById("playback_endTime").value;
  var startTime = (Date.parse(playback_startTime)) / 1000 - new Date().getTimezoneOffset() *60;
  var endTime = (Date.parse(playback_endTime)) / 1000 - new Date().getTimezoneOffset() *60;
  console.log('playback_byTime',startTime,endTime);
  playerList[0].SetStreamMode(1)
  Player.StartPlayBack(devid, '', channel, startTime, endTime,255, 0, false, 0);
  //Player.PlayNormal();		
}
function playSelectedDate(){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;		
  var playback_startTime = document.getElementById("searchVideoDates").value;
  console.log('playback_startTime',playback_startTime);
  var startTime = (Date.parse(playback_startTime)) / 1000 - new Date().getTimezoneOffset() *60;
  var endTime = startTime + 86400;
  playerList[0].SetStreamMode(1)
  Player.StartPlayBack(devid, '', channel, startTime, endTime,255, 0, false, 0);
}

var overTime = null;

// function playbacktodown(startTime,endTime,file_type){
// 	console.log("下载指定时间startTime,endTime,file_type",startTime,endTime,file_type)
// 	var devid = document.getElementById("dev_id").value;
// 	var channel = document.getElementById("channel").value;
  
// 	Player.StartPlayBack(devid, '', channel, startTime,endTime,file_type, 0, false, 1)
// 	overTime= new Date((endTime+ new Date().getTimezoneOffset()*60 +340 *60) * 1000).valueOf()

// 	// overTime= new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).valueOf()
// 	overTime= new Date((endTime- 318 *60) * 1000).valueOf()
// 	// overTime= new Date(endTime * 1000).valueOf()
// 	console.log('index页面的overTime',overTime)
// 	window.overTime = overTime
// }

function playbacktodown(startTime,endTime,file_type){

  var d = document.getElementById("process");
  d.style.width ="0%";
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  
  Player.StartPlayBack(devid, '', channel, startTime,endTime,file_type, 0, false, 1)
  
  overTime= endTime;
  beginTime = startTime;
  console.log('index页面的overTime',overTime)
  window.overTime = overTime * 1000;
  window.beginTime = beginTime * 1000;
  window.downloadSpecifyTime = false
  var s = new Date((window.beginTime + new Date().getTimezoneOffset() *60 * 1000));

  // console.log(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds(), beginTime, s,  s.toLocaleString(), window.beginTime / 1000 + new Date().getTimezoneOffset() *60);
}
function downloadVideoSpecifyTime(){
  var d = document.getElementById("downSpecifyTimeProcess");
  d.style.width ="0%";
  window.useTimeStart = Date.now();
  window.downloadSize = 0;
  var download_startTime = document.getElementById("download_startTime").value;
  var download_endTime = document.getElementById("download_endTime").value;
  var startTime = (Date.parse(download_startTime)) / 1000 - new Date().getTimezoneOffset() *60;
  var endTime = (Date.parse(download_endTime)) / 1000 - new Date().getTimezoneOffset() *60;
  if( endTime-startTime > 600){
    alert('Please select a duration less than 10min')
    return
  }
  var d = document.getElementById("process");
  d.style.width ="0%";
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  window.beginTime = startTime * 1000;
  window.overTime = endTime * 1000;
  window.downloadSpecifyTime = true
  Player.StartPlayBack(devid, '', channel, startTime,endTime,15, 0, false, 1)
}

function playback(tasktype) {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  var list = getRecordList();
  playbackNum = 0;
  var startTime = list[playbackNum].file_begintime
  var endTime = list[playbackNum].file_endtime
  // var startTime = list[playbackNum].file_begintime - new Date().getTimezoneOffset() *60
  // var endTime = list[playbackNum].file_endtime - new Date().getTimezoneOffset() *60
  document.getElementById("startTime").innerHTML = new Date((startTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  document.getElementById("endTime").innerHTML = new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  Player.StartPlayBack(devid, '', channel, startTime, endTime,'255', 0, false, tasktype)
}
function playbacknext(params) {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  var list = getRecordList();
  playbackNum = playbackNum + 1;
  var startTime = list[playbackNum].file_begintime
  var endTime = list[playbackNum].file_endtime
  document.getElementById("startTime").innerHTML = new Date((startTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  document.getElementById("endTime").innerHTML = new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  Player.StartPlayBack(devid, '', channel, startTime, endTime,'255', 0, false, 0)
}
function playbackprev(params) {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  var list = getRecordList();
  if(playbackNum > 0){
    playbackNum = playbackNum - 1;
  }
  var startTime = list[playbackNum].file_begintime
  var endTime = list[playbackNum].file_endtime
  document.getElementById("startTime").innerHTML = new Date((startTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  document.getElementById("endTime").innerHTML = new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  Player.StartPlayBack(devid, '', channel, startTime, endTime,'255', 0, false, 0)
}
function playbackpause() {
  var devid = document.getElementById("dev_id").value;
  Player.PausePlayBack(devid,'',0)
}
function playbackcontinue() {
  var devid = document.getElementById("dev_id").value;
  Player.ContinuePlayBack(devid,'',0)
}
function stopplayback() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.StopPlayBack(devid, '', channel)
}
function opencall() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.OpenCall(devid, '', channel)
}
function speakingcall() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  if (recorder !== null) recorder.close()
  var recordAudioCallback = function (int16) {
    var unit8data = new Uint8Array(int16.buffer);
    splitdata.feed(unit8data)
  }
  window.JARecorder.get((rec) => {
    recorder = rec
    recorder.start()
  }, {inputCallback: recordAudioCallback})
  splitdata.outputData = function(unit8data){
    Player.CallSend(devid, '', channel, parseInt(new Date().getTime()/1000), 'G711A', 8000, 16, 1, 1, unit8data, unit8data.length)
  }
  
}
function stopspeaking() {
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  recorder && recorder.stop()
  splitdata.close()
}
function closecall() {
  recorder && recorder.close()
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.CallHangup(devid, '', channel)
}
function snapshot() {
  let name = document.getElementById('dev_id').value + '_'+ 'snapshot.png'
  Player.Snapshot( 0,name, 1280, 720, null)
}

function openaudio(){
  Player.OpenAudio(0);
}

function closeaudio(){
  Player.CloseAudio(0);
}

//触发button下载 
function downloadVideo(startTime, endTime, file_type){
  console.log("download Video start ", startTime, " end ", endTime, " filetype ", file_type);
  document.getElementById("startTime").innerHTML =new Date((startTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  document.getElementById("endTime").innerHTML = new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();

  document.getElementById("process").width="0%";
  playbacktodown(startTime,endTime,file_type)
}

ConnectApi.onRecordFetch = function(file_type, file_begintime, file_endtime,INDEX){
  // console.log('file_type, file_begintime, file_endtime,INDEX',file_type, file_begintime, file_endtime,INDEX)
      const lang = document.getElementById("language").value
  var recListTable = document.getElementById("recListTable");
  
  const newRow = recListTable.insertRow(1);

  const td_index = newRow.insertCell(0);
  const td_begin = newRow.insertCell(1);
  const td_end = newRow.insertCell(2);
  const td_times = newRow.insertCell(3);
  const td_type = newRow.insertCell(4);
  const cell5  = newRow.insertCell(5);
  const td_play  = newRow.insertCell(6);

  var td_download = document.createElement("button");
  td_download.id = "rowBtn"+INDEX
  td_download.startTime = file_begintime;
  td_download.endTime = file_endtime;
  td_download.file_type = file_type;
  td_download.innerHTML = "download";		
  window.downloadButton = td_download;
  window.downloadCell = cell5;		
  td_download.addEventListener("click",function(){
    // console.log(td_download.id)
    window.useTimeStart = Date.now();
    window.downloadSize = 0;
    downloadVideo(this.startTime, this.endTime, this.file_type);
  })
  // console.log(td_download)
  cell5.appendChild(td_download)
  td_play.innerHTML = "<a href=\"javascript:playRecord(" + file_begintime + "," + file_endtime + ", " + file_type + ","+INDEX+")\">Play</a>";

  td_index.innerText = INDEX
  td_begin.innerText = new Date((file_begintime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();	
  td_end.innerText = new Date((file_endtime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  td_times.innerText = file_endtime - file_begintime;
  if(file_type == 1){
    td_type.innerText = lang=="zh_CN" ? "日程录像" : "Schedule recording"
  }
  else{
    td_type.innerText = lang=="zh_CN" ? "报警录像" : "Alarm recording"
  }		
  td_type.innerText = td_type.innerText + '-' + file_type
}


// 远程设置 - 区域侦测（区域入侵）
const maxRows = 24; // 区域侦测 - 画面最大行数
const maxColumns = 32; // 区域侦测 - 画面最大列数

const gridBox = document.getElementById('gridBox')
const perWidth = (gridBox.offsetWidth / maxColumns).toFixed(3) // 每个格子宽度
const perHeight = (gridBox.offsetHeight / maxRows).toFixed(3) // 每个格子高度

let startPoint = {}  // 起始坐标
let endPoint = {} // 终止坐标

// 划线模式
function drawLineMode() {
}
//关闭区域侦测回显数据
function closeDrawArea(){
  document.getElementById('gridBox').style.display = "none"
  let domArr = document.getElementsByClassName("item")
  for(var i=0;i<domArr.length;i++){
    domArr[i].style.background = "rgba(0, 0, 0, 0.3)"
  }
}
// 区域模式
function drawAreaMode() {
  document.getElementById('gridBox').style.display = ""
  var id = document.getElementById("dev_id").value;
  let session = GetSessionById(id);
  if (!session) {
    alert("请先连接设备（页面左上角点击‘连接设备’）");
    return
  }
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "1.3.0",
    "Method": "get",
    "IPCam": {
      "AlarmSetting":{
        "MotionDetection":{
        }
      },
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);

  const GRID_BOX = document.getElementById('gridBox')
  var items = document.querySelectorAll("#gridBox .item");
  for (var i = 0; i < items.length; i++) {
    items[i].remove();
  }
  const widthPercentage = (100 / maxColumns).toFixed(3)
  const heightPercentage = (100 / maxRows).toFixed(3)
  let fragment = document.createDocumentFragment()
  for (let i = 0; i < maxRows; i++) {
    for (let j = 0; j < maxColumns; j++) {
      var div = document.createElement("div");
      div.style.width = widthPercentage + '%'
      div.style.height = heightPercentage + '%'
      div.className = 'item'
      fragment.appendChild(div)
    }
  }
  setTimeout(() => {
    GRID_BOX.appendChild(fragment)
  }, 10)

  var promise = drawScreenPromise();
      promise.then(function (data) {
    var jArr = binaryStr.split('')
    var areaArr = []
    for(var i=0;i<girdData.length;i++){
      for(var j=0;j<jArr.length;j++){
        if(girdData[i] == 0){
          areaArr.push(0)
        }else{
          areaArr.push(jArr[j])
        }
      }
    }
    let domArr = document.getElementsByClassName("item")
    for(var i=0;i<areaArr.length;i++){
      if(areaArr[i] ==1){
        domArr[i].style.background = "#ff3333"
        domArr[i].style.opacity  = ".5"
      }else{
        domArr[i].style.background = "rgba(0, 0, 0, 0.3)"
      }
    }
      })

}

var drawScreenPromise = function drawScreenPromise() {
  var promise = new Promise(function (resolve, reject) {
    var timeOut = setTimeout(function () {
    var decimalNum = null;
    var binaryStr = null;
    for(var i=0;i<window.girdData.length;i++){
      if(window.girdData[i]>0){
          decimalNum =  window.girdData[i]
          let binaryStr = decimalNum.toString(2);
          while (binaryStr.length < 32) {
            binaryStr = '0' + binaryStr;
          }
          window.binaryStr = binaryStr
          console.log(binaryStr);
          return resolve(true);
      }
    }
    clearTimeout(timeOut);
    }, 1000);
  });
  return promise;
};
// 起始坐标
function getStartPoint() {
  const area = document.getElementById('area')
  document.getElementById('gridBox').onmousedown = function (event) {
    let start = {}
    start.x = event.layerX
    start.y = event.layerY
    startPoint.x = Math.ceil(event.layerX / perWidth) - 1
    startPoint.y = Math.ceil(event.layerY / perHeight) - 1
    console.log('Down! Start X is', startPoint.x, ', Start Y is', startPoint.y);

    area.style.left = start.x + 'px'
    area.style.top = start.y + 'px'
    area.style.border = '1px solid red'
    document.getElementById('gridBox').onmousemove = function (event) {
      event.preventDefault()
      area.style.width = event.offsetX - start.x + 'px'
      area.style.height = event.offsetY - start.y + 'px'
    }
  }
}
// 终止坐标
function getEndPoint() {
  document.getElementById('gridBox').onmouseup = function (event) {
    event.preventDefault()
    endPoint.x = Math.ceil(event.layerX / perWidth) - 1
    endPoint.y = Math.ceil(event.layerY / perHeight) - 1
    console.log('Up! End X is', endPoint.x, ', End Y is', endPoint.y);

    document.getElementById('gridBox').onmousemove = null
    area.style.width = 0
    area.style.height = 0
    area.style.border = '0'
  }
}

// 远程设置 - 区域侦测（区域入侵）
function setRegionMotionDetection() {
  let top = startPoint.y; // 起始行
  let left = startPoint.x; // 起始列
  let bottom = endPoint.y; // 结束行
  let right = endPoint.x; // 结束列



  // let grid = [];
  // for (let i = 0; i < maxRows; i++) { // 行
  // 	for (let j = 0; j < maxColumns; j++) { // 列
  // 		let val = 0;
  // 		if (i >= top && i <= bottom && j >= left && j <= right) {
  // 			val = 1;
  // 		}
  // 		if (j < 31) {// js int 是有符号的，所以最多移到30位
  // 			grid[i] = (0 == j ? val : grid[i] << 1);
  // 		}
  // 		grid[i] |= val
  // 	}
  // }

  let grid = [];
  for (let i = 0; i < maxRows; i++) { // 行
    for (let j = 0; j < maxColumns; j++) { // 列
      let val = 0;
      if (i >= top && i <= bottom && j >= left && j <= right) {
        val = 1;
      }
      if (j < 31) {// js int 是有符号的，所以最多移到30位
        grid[i] = (0 == j ? val : grid[i] << 1);
      }
      if(j==31){
          if(0==j){
            grid[i] = val
          }else{
            let num1 = grid[i]; 
            let num2 = 1n;  
            let shiftedNum = BigInt(num1) << num2;  
            grid[i] = shiftedNum.toString();  
          }
              }
      grid[i] |= val
    }
  }
  
  let nums = grid;  
  let strNums = [];  
  for (let i = 0; i < nums.length; i++) {  
    let strNum = nums[i]
    if(nums[i]<0){
      strNum = nums[i]+ Math.pow(2, 32)
      
    }
    strNums.push(strNum);  
  }
  grid = strNums
  console.log('[setRegionMotionDetection] grid:', grid);

  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;

  let config = {
    "Version": "1.3.0",
    "Method": "set",
    "IPCam": {
      "AlarmSetting": {
        // 
        "MotionDetection": {
          "Enabled": true, // 运动侦测开关
          "MotionRecord": true, // 移动侦测录像开关
          "SensitivityLevel": "normal", // 灵敏度水平可选项[“lowest”,”low”,”normal”,”high”,”highest”]
          "MotionWarningTone": true, // 使能报警声音
          "Duration": 20, // 报警声音持续时间 (秒)
          "motionTrackEnabled": true, // 移动跟踪开关
          "type": "region", // 侦测类型“line”,”region”
          "line": [],
          "grid": grid
        },
        "MessagePushEnabled": true
      },
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}

function startRecord(){
  Player.ctrlRecordOn(0, 'test', null)
}
function endRecord(){
  Player.ctrlRecordOff(0)
}
window.sharedevid = document.getElementById("dev_id").value;
window.sharechannel = document.getElementById("channel").value;

function playRecord(tBegin, tEnd, tType, id){
  var devid = document.getElementById("dev_id").value;
  var channel = document.getElementById("channel").value;
  Player.StartPlayBack(devid, '', channel, tBegin, tEnd, 255, 0, false,0);
  document.getElementById("div_recList").style.display="none";

  var videoList = getRecordList()
  var startTime = videoList[videoList.length - id-1].file_begintime
  var endTime = videoList[videoList.length - id-1].file_endtime
  document.getElementById("startTime").innerHTML =new Date((startTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
  document.getElementById("endTime").innerHTML = new Date((endTime+ new Date().getTimezoneOffset() *60) * 1000).toLocaleString();
}
document.getElementById('playback_startTime').value = new Date().toLocaleDateString() + " 00:00:00"
document.getElementById('playback_endTime').value = new Date().toLocaleDateString() + " 23:59:59"
function getFTP(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "V2":{
        "Network": {
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
      };

  sendRemoteConfig(config);
  
}	
function testFtp(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "V2":{
        "R/FtpTest": {
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}
function getSIMCardDetails(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "Lte":{

      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}
function getRecordSet(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "V2":{
        "Record": {
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}
function setTimeRecordDuration(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "Record": {
          "TimeRecordDuration":Number(document.getElementById('timeRecordDuration').value)
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}
function getTimeZoneSetting(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;		

  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      "SystemOperation":{
        "TimeSync":{
        }
      },
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}
function setRecordingResolution(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "Record": {
          "Stream": document.getElementById('recordingResolution').value
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}
function setTimeZoneSetting(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
        "SystemOperation":{
          "TimeSync":{
            "TimeZone": parseInt(document.getElementById('timeZoneSetting').value)
          }
        },
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}
function getDeviceUser(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "UserManager" : {
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}
function setDeviceUser(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "UserManager" : {
      "Method": "modify",
      "Verify": "",
      "username": "admin",
      "password":document.getElementById('devicePassword').value
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}
function setFtp(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "set",
    "IPCam": {
      "V2":{
        "Network":{
          "Ftp" : {
              "bEnableFTP": document.getElementById('bEnableFTP').checked,
              "nFTPPort":Number(document.getElementById('nFTPPort').value),
              "strFTPuser": document.getElementById('strFTPuser').value,
              "strFTPpassword":document.getElementById('strFTPpassword').value,
              "szFTPServerIP": document.getElementById('szFTPServerIP').value,
              "szFTPfolder":   document.getElementById('szFTPfolder').value,
              "szFtpServerVideoPath": document.getElementById('szFtpServerVideoPath').value,
              "szFtpServerPicturePath":document.getElementById('szFtpServerPicturePath').value,
              "nFtpTimeInterval": Number( document.getElementById('nFtpTimeInterval').value),
              "nFtpUploadWays": Number( document.getElementById('nFtpUploadWays').value),
              "nFtpUploadContent":Number( document.getElementById('nFtpUploadContent').value),
              "bFtpSchduleEnable":   document.getElementById('bFtpSchduleEnable').checked,
              "stFtpSchedule": getStFtpSchedule(),
              "bServerSyncEnble": document.getElementById('bServerSyncEnble').checked,
              "nServerSyncType": Number( document.getElementById('nServerSyncType').value),
              "nServerSyncTime": getnServerSyncTime()
          }
        }
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };

  sendRemoteConfig(config);
}
createStFtpScheduleHtmL([0,0,0,0,0,0,0])
function createStFtpScheduleHtmL(stFtpSchedule){
  let timeHtml = ''
  for(let i = 0;i<24;i++){
    timeHtml+=`<span>${i+1}</span>`
  }
  document.getElementById('selectTimeBox').innerHTML = timeHtml
  let selectTimeArr = stFtpSchedule.map(item => item.toString(2).padStart(24,'0') )
  let getWeekDay = getWeekDayArr()
  let selectSchduleDayBoxHtml = ''
  for(let i = 0; i<=6; i++){
    let selectTime = selectTimeArr[i]
    let inputBoxHtml = ''
    for(let j = 23; j >= 0; j--){
      inputBoxHtml+=`<div class='inputBox'> <input type="checkbox" ${selectTime[j] === '1'? 'checked':''}></div>`
    }
    selectSchduleDayBoxHtml +=
    `<div class="day_item">
      <span class='left' >${getWeekDay[i]}</span>
      ${inputBoxHtml}
    </div>`
  }
  document.getElementById('selectSchduleDayBox').innerHTML = selectSchduleDayBoxHtml
}
function selectSchduleDay(){
  let dialog = document.getElementById('selectSchduleDayDialog')
  dialog.showModal();
}
function closeDialog(){
  let dialog = document.getElementById('selectSchduleDayDialog')
  dialog.close();
}
function getWeekDayArr(){
  if(getCookie("languageType") === 'zh_CN'){
    return ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  }else{
    return ['Sunday','Monday','Tuesday','Wednesday','ThursDay','Friday','Saturday']
  }
}
function getStFtpSchedule(){
  let dayItemDom= document.getElementsByClassName('day_item')
  if(dayItemDom.length === 0){
    return [0,0,0,0,0,0,0]
  }
  let StFtpSchedule = []
  for (const item of dayItemDom) {
    let inputArr = item.querySelectorAll('input')
    let StFtpScheduleItem = ''
    for(i =23;i>=0;i--){
      StFtpScheduleItem += inputArr[i].checked ? '1':'0'
    }
    StFtpSchedule.push( parseInt(StFtpScheduleItem, 2))
  }
  return StFtpSchedule
}
function getnServerSyncTime(){
  let DateStr = document.getElementById('nServerSyncTime').value
  if(!DateStr){
    return Math.floor(new Date(DateStr).getTime() / 1000);
  }
  return  Math.floor(new Date(DateStr).getTime() / 1000);
}
window.testRecordFlag = false
function testRecord(){
  window.testRecordFlag = true
  window.testRecordChunkTimeStamps= []
  window.testVideoChunck =  new Uint8Array()
  window.testAudioChunck =  new Uint8Array()
  window.testVideAndAudioChunck =  []
  window.test_decode_type = ''
}
function stopRecord(){
  window.testRecordFlag = false
  console.log( 'testChunck',{testVideoChunck,testAudioChunck,testRecordChunkTimeStamps,test_decode_type,testVideAndAudioChunck});
  const mp4Array  =  Module.convertMix2Mp4(testVideoChunck, testRecordChunkTimeStamps, test_decode_type,testAudioChunck)
  console.log('mp4Array',mp4Array);
  const blob = new Blob([mp4Array], {
    type: "video/mp4"
  });
  var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.href = url;
  a.download =  'test.mp4';
	document.body.appendChild(a);
	a.click();
}
function setResolution(width, height){
  Player.setResolution(0, width, height)
}
function searchVideoDates(){
  const now = new Date();
  const currentTimestampMillis = now.getTime();
  const endTime = Math.floor(currentTimestampMillis / 1000);
  const oneYearAgoTimestampMillis = currentTimestampMillis - (365 * 24 * 60 * 60 * 1000);
  const beginTime = Math.floor(oneYearAgoTimestampMillis / 1000);
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "IPCam": {
      'recordInfo': {
        'recordScheduleDateInfo': [{
          'chnNum': 1,
          'beginTimeS': beginTime,
          'endTimeS': endTime,
          'recordDay': []
        }]
      }
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    }
  };
  sendRemoteConfig(config);
}

// 固件更新 update firmware
// 获取设备信息 get device information
let DeviceInfo = {}
function getDeviceInfo(){
  var user = document.getElementById("user").value;
  var pwd = document.getElementById("pwd").value;
  let config = {
    "Version": "2.0.0",
    "Method": "get",
    "UserManager" : {
    },
    "Authorization": {
      "Verify": '',
      "username": user,
      "password": pwd
    },
    "IPCam": {
      "DeviceInfo": {},
    },
  };
  sendRemoteConfig(config);
}
// 更新固件指令 Instruction to update firmware
function updateFirmware() {
  var username = document.getElementById("user").value;
  var password = document.getElementById("pwd").value;
  const LocalTime = parseInt(new Date().getTime() / 1000).toString()
  let dataStr = {
    Version: "1.0.2",
    Method: "set",
    Authorization: {
      Verify: "",
      username,
      password
    },
    IPCam: {
      SystemOperation: {
        Upgrade: {
          Enabled: true
        },
        TimeSync: {
          LocalTime
        }
      }
    }
  }; 
  sendRemoteConfig(dataStr);
}
// 检查是否有新固件 check if there is new firmware
async function checkFirmware() {
  const { FWVersion, FWMagic, OEMNumber, ID } = DeviceInfo
  const updateInfo = {
    firmwareMagic: FWMagic,
    swVersion: FWVersion,
    deviceSn: ID,
    odmNum: OEMNumber,
    release: 1,
  }
  const res = await userApi.checkCommonUpdate([updateInfo])
  var yesEl = document.getElementById("update-yes");
  var noEl = document.getElementById("update-no");
  if(res.status == 200 && res.data.length > 0) {
    yesEl.style.display = "inline"
    noEl.style.display = "none"
  } else {
    yesEl.style.display = "none"
    noEl.style.display = "inline"
  }
  console.log(res)
}
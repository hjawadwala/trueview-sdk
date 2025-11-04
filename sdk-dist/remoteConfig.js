/*
 * @Author: shenlilu 212293975@qq.com
 * @Date: 2022-07-01 14:41:29
 * @LastEditors: your Name
 * @LastEditTime: 2022-07-16 16:43:48
 * @FilePath: \SDK\src\remoteConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


let UIState = ''
// 监听远程设置对象改变
let remoteDeviceStore = new Proxy(remoteDeviceData, {
    get(target, key) {
        let result = target[key] || new Error('没有该属性!');
        console.log('获取', result);
        return result;
    },
    set(target, key, value) {
        target[key] = value
        console.log('检测到变化', target, key, value,remoteDeviceData.deviceInfo);
        if (key == 'deviceInfo' && remoteDeviceData.deviceInfo && Object.keys(remoteDeviceData.deviceInfo).length > 0) {
            getDeviceInfo(remoteDeviceData.deviceInfo)
        } 
        if (key == 'setConfigStatu') {
            if (target.setConfigStatu.option == 'success') {
                handleMessage('设置成功')
            } else {
                handleMessage('设置失败')
            }
        }
        return true
    },
})
let activeRemoteType = '1'
let recordDate = new Date();
recordDate.setFullYear(recordDate.getFullYear() - 1);
let username = ''
let password = ''
// 默认获取设备信息
const ordinaryInfo = {
    "Version": "1.0.0",
    "Method": "get",
    "CapabilitySet": {},
    "IPCam": {
        "DeviceInfo": {},
        "recordInfo": {
            "recordScheduleDateInfo": [{
                "chnNum": 0,
                "beginTimeS": parseInt
                    (recordDate.getTime() / 1000),
                "endTimeS": parseInt(new Date
                    ().getTime() / 1000),
                "recordDay": []
            }]
        },
        "ModeSetting": {
            "AudioVolume": {}
        },
        "AlarmSetting": {
            "HumanoidDetection": {},
            "MotionDetection": {},
            "MessagePushSchedule": [],
            "FaceDetection": {},
            "MessagePushBitSchedule": [],

        },
        "SystemOperation": {
            "TimeSync": {},
            "DaylightSavingTime": {
                "week": [{}, {}]
            },
            "Upgrade": {}
        },
        "PromptSounds": {},
        "TfcardManager": {
            "TFcard_recordSchedule": [],
            // "TimeRecordEnabled": true
        },
        "WirelessManager": {},
        "ChannelStatus": [],
        "ChannelInfo": [],
        "videoManager": {},
        "devCoverSetting": [],
        "RecordManager": {},
        "powerLineFrequencyMode": "",
        //注意：暂时加任何参数，也要加在获取附近 wifi方法里面加，否则就会报错
    },
    "Authorization": {
        "Verify": '',
        "username": username || '',
        "password": password || '',
    },
    "UserManager": {}
}
// 特殊设备获取设备信息
const specialInfo = {
    "Version": "1.0.0",
    "Method": "get",
    "CapabilitySet": {},
    "IPCam": {
        "ledPwm": {
            "channelInfo": []
        },
        "SystemOperation": {
            "TimeSync": {},
            "DaylightSavingTime": {},
            "UpgradeStatus": {}
        },
        "PromptSounds": {},
        "WirelessManager": {},
        "ChannelManager": {},
        "ChannelInfo": [],
        "ModeSetting": {
            "AudioVolume": {}
        },
        "TfcardManager": {
            "TFcard_recordSchedule": []
        },
        "DeviceInfo": {},
        "powerLineFrequencyMode": "",
        //注意：暂时加任何参数，也要加在获取附近wifi方法里面加，否则就会报错
    },
    "Authorization": {
        "Verify": '',
        "username": username,
        "password": password
    }
}
// IPC录像声音开关
const setAudioEnabledConfig = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "ModeSetting": {
            "AudioEnabled": '',//录像声音开关
        },
    },
    "Authorization": {
        "Verify": '',
        "username": username || '',
        "password": password || '',
    }
}
// (单品)保存提示音
const setPromptLang = {
    "Version": "1.1.23",
    "Method": "set",
    "IPCam": {
        "PromptSounds": {
            "Enabled": '',//提示音开关
            "Type": '',//当前选择的提示音语言
        },
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
}
// GW设置音量
const setAudioVolume = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "ModeSetting": {
            "AudioVolume": {
                "AudioInputVolume": '',
                "AudioOutputVolume": '',
            },
        },
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
};
// 移动侦测管理设置
const setMotionDetection = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "AlarmSetting": {
            "MotionDetection": {// 运动检测
                "Enabled": '',
                "MotionRecord": '',
                "MotionWarningTone": '',
                "SensitivityLevel": '',
                "motionTrackEnabled": '',
                "MdRecDuration": '',
            },
            
            "MessagePushBitSchedule": '',// 消息推送位时间表
            "HumanoidDetection": {// 人形检测
                "enable": '',
                "drawRegion": '',
            },
            "MessagePushEnabled": '',// 消息推送启用
            "FaceDetection":{// 人脸检测
                "enable": '',
                "drawRegion": '',
            }
        }
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": '',
    }
};

// 格式化TF卡
const formatTFCard = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "TfcardManager": {
            "Operation": "format"
        }
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
}
// 同步电脑时间
const AsyncWindowsTime = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "SystemOperation": {
            "TimeSync": {
                "LocalTime": '',
                "UTCTime": '',
                "TimeZone": '',
            },
        },
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
};
// 重启摄像机
const rebootDevice = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "SystemOperation": {
            "Reboot": true,
        }
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
}
// 时间设置
const setSystemOperation = {
    "Version": "1.0.0",
    "Method": "set",
    "IPCam": {
        "SystemOperation": {
            "dateFormat": '',
            "TimeSync": {
                // "UTCTime": parseInt(new Date().getTime() / 1000),
                "TimeZone": ''
            },
            "DaylightSavingTime": {
                "Enabled": '',
                "Country": '',
            }
        },
    },
    "Authorization": {
        "Verify": '',
        "username": '',
        "password": ''
    }
};
// 时区翻译 ——b
const timeZoneTranslation = [
    {"Pacific/Midway": "中途岛",},
    {"Pacific/Honolulu": "檀香山",},
    {"America/Anchorage": "安克雷奇",},
    {"America/Los_Angeles": "洛杉矶/美国太平洋",},
    {"America/Tijuana": "提华纳/美国太平洋",},
    {"America/Phoenix": "凤凰城美国山区",},
    {"America/Chihuahua": "奇瓦瓦",},
    {"America/Denver": "丹佛/美国山区",},
    {"America/Costa_Rica": "哥斯达黎加/美国中部",},
    {"America/Regina": "里贾纳/美国中部",},
    {"America/Chicago": "芝加哥/美国中部",},
    {"America/Mexico_City": "墨西哥城/美国中部",},
    {"America/Bogota": "波哥大/哥伦比亚",},
    {"America/New_York": "纽约/美国东部",},
    {"America/Caracas": "加拉加斯/委内瑞拉",},
    {"America/Barbados": "巴巴多斯/大西洋",},
    {"America/Manaus": "马瑙斯/亚马逊",},
    {"America/Santiago": "圣地亚哥",},
    {"America/Halifax": "哈利法克斯",},
    {"America/Recife":"累西腓",},
    {"America/Sao_Paulo":"圣保罗",},
    {"America/Argentina/Buenos_Aires": "布宜诺斯艾利斯",},
    {"America/Montevideo": "蒙得维的亚/乌拉圭",},
    {"America/St_Johns":"圣约翰/纽芬兰",},
    {"America/Godthab": "戈特霍布",},
    {"Atlantic/South_Georgia": "南乔治亚",},
    {"Atlantic/Cape_Verde": "佛得角",},
    {"Atlantic/Azores":"亚述尔群岛",},
    {"Africa/Casablanca": "卡萨布兰卡",},
    {"Europe/London":"伦敦/格林尼治",},
    {"Africa/Brazzaville": "布拉扎维/西部非洲",},
    {"Europe/Amsterdam":"阿姆斯特丹/中欧",},
    {"Europe/Belgrade": "贝尔格莱德/中欧",},
    {"Europe/Madrid": "马德里",},
    {"Europe/Brussels": "布鲁塞尔/中欧",},
    {"Europe/Sarajevo": "萨拉热窝/中欧",},
    {"Africa/Windhoek": "温得和克",},
    {"Africa/Cairo": "开罗/东欧",},
    {"Africa/Harare": "哈拉雷/中部非洲",},
    {"Asia/Amman": "安曼/东欧",},
    {"Europe/Athens":"雅典/东欧",},
    {"Europe/Istanbul": "伊斯坦布尔",},
    {"Asia/Beirut": "贝鲁特/东欧",},
    {"Europe/Helsinki": "赫尔辛基/东欧",},
    {"Asia/Jerusalem": "耶路撒冷/以色列",},
    {"Europe/Minsk": "明斯克",},
    {"Asia/Baghdad": "巴格达",},
    {"Europe/Moscow": "莫斯科",},
    {"Asia/Kuwait": "科威特",},
    {"Africa/Nairobi": "内罗毕/东部非洲",},
    {"Asia/Baku":"巴库",},
    {"Asia/Tbilisi": "第比利斯",},
    {"Asia/Yerevan": "埃里温",},
    {"Asia/Dubai": "迪拜",},
    {"Asia/Tehran":"德黑兰/伊朗",},
    {"Asia/Kabul": "喀布尔/阿富汗",},
    {"Asia/Karachi": "卡拉奇",},
    {"Asia/Oral": "乌拉尔",},
    {"Asia/Yekaterinburg": "叶卡捷林堡",},
    {"Asia/Colombo": "科伦坡",},
    {"Asia/Almaty": "阿拉木图",},
    {"Asia/Yangon": "仰光/缅甸",},
    {"Asia/Krasnoyarsk": "克拉斯诺亚尔斯克",},
    {"Asia/Bangkok": "曼谷",},
    {"Asia/Shanghai": "北京/中国",},
    {"Asia/Hong_Kong": "香港/中国",},
    {"Asia/Irkutsk": "伊尔库茨克",},
    {"Asia/Kuala_Lumpur": "吉隆坡",},
    {"Australia/Perth": "佩思",},
    {"Asia/Taipei": "台北时间 (台北)",},
    {"Asia/Seoul": "首尔",},
    {"Asia/Tokyo": "东京/日本",},
    {"Asia/Yakutsk": "雅库茨克",},
    {"Australia/Adelaide": "阿德莱德",},
    {"Australia/Darwin": "达尔文",},
    {"Australia/Brisbane": "布里斯班",},
    {"Australia/Hobart": "霍巴特",},
    {"Australia/Sydney": "悉尼",},
    {"Asia/Vladivostok": "符拉迪沃斯托克",},
    {"Pacific/Guam": "关岛",},
    {"Asia/Magadan": "马加丹",},
    {"Pacific/Noumea": "努美阿",},
    {"Pacific/Majuro": "马朱罗",},
    {"Pacific/Auckland": "奥克兰",},
    {"Pacific/Fiji": "斐济",},
    {"Pacific/Tongatapu":"东加塔布",},
    {"Asia/Jakarta": "雅加达",},
]
// 获取远程设置设备信息
function getDeviceRemoteConfig(params) {
    if (params) {
        return JSON.parse(JSON.stringify(eval(params)))
    } else {
        return JSON.parse(JSON.stringify(ordinaryInfo))
    }
}
/**
 * @function onRemoteFunc
 * @description 去远程设置
 * @return {*}
 * @author QAQ
 * @todo 
 */     
function onRemoteFunc() {
        console.log('去远程设置')
        // qweqwe()
        // return
        let remoteType = document.getElementById("remoteSelect").value;
        console.log('去远程设置', remoteType, )
        let specialDevice = ['JAT','JAR','JAG']
        let devid = document.getElementById("dev_id").value;
        let user = document.getElementById("user").value;
        let pwd = document.getElementById("pwd").value;
        let config = null
        if (!devid) {
            handleMessage('请输入设备id')
            return
        }
        const deviceState = GetSessionById(devid)
        console.log('GetSessionById(devid) :>> ', deviceState);
        if (!deviceState) {
            handleMessage('没有连接设备')
            return
        }
        if (specialDevice.indexOf(remoteType) >= 0) {
            // special 七寸屏或者Gateway
            config = getDeviceRemoteConfig('specialInfo')
        } else {
            config = getDeviceRemoteConfig()
        }
        console.log('GetSessionById()',deviceState)
        config.Authorization.username = user
        config.Authorization.password = pwd
        Player.RemoteSetting(devid, '', JSON.stringify(config))
        
}

// 

function getDeviceInfo() {
    // console.log('getRemoteDeviceInfo', remoteDeviceData.deviceInfo)
    console.log('remoteDeviceStore', remoteDeviceStore, remoteDeviceStore.deviceInfo,'>>>',isremoteing)
    let loading = document.querySelector('.loading-view')
    if (loading.style.display != 'none') {
        loading.style.display = 'none'
    }
    if (remoteDeviceStore.deviceInfo.success) {
        console.log('remote-Modal', document.getElementsByClassName('remote-Modal').length)
        if (document.getElementsByClassName('remote-Modal').length > 0) {
            let listDOM = document.getElementsByClassName("remote-Modal")
            console.log('listDOM', listDOM)
            for (let index = 0; index < listDOM.length; index++) {
                const element = listDOM[index];
                element.remove()
            }
        }
        const modalView = document.createElement("div");
        modalView.className = 'remote-Modal';
        modalView.id = 'modal';
        modalView.innerHTML = `
			<div class="left-nav">
				<ul id="nav-menubar" class="menubar">
					<li data-value="1" class="menu-item">
                        设备设置
					</li>
					<li data-value="2" class="menu-item submenu">
						<div class="title">基础设置</div>
						<ul class="list">
                            <li data-value="2-1" class="menu-item">录像声音</li>
                            <li data-value="2-2" class="menu-item">提示音</li>
                            <li data-value="2-3" class="menu-item">设备音量</li>
                            <li data-value="2-4" class="menu-item">移动侦测管理</li>
                            <li data-value="2-5" class="menu-item">时间录像管理</li>
                            <!-- <li data-value="2-6" class="menu-item">固件更新</li> -->
                            <li data-value="2-7" class="menu-item">设备存储</li>

                        </ul>
					</li>
					<li data-value="3" class="menu-item">
						时间设置
					</li>
					<li data-value="4" class="menu-item">
                        网络设置
					</li>
                    <li data-value="5" class="menu-item submenu">
                        <div class="title">高级设置</div>
						<ul class="list">
                            <!-- <li data-value="5-1" class="menu-item">录像声音</li> -->
                            <li data-value="5-2" class="menu-item">视频图像设置</li>
                        </ul>
					</li>
                    <li data-value="6" class="menu-item">
						密码设置
					</li>
				</ul>
			    <div class="reboot-container">
                    <button class="reboot-device" onclick="toRebootDeviceFunc()">重启摄像机</button>
                    <button class="reboot-device" onclick="toresetDeviceFunc()">恢复出厂设置</button>
                </div>
			</div>
			<div id="rightNav" class="right-nav">
			    <div class="container"></div>
                <div onclick="saveConfig()" class="right-save">保存</div>
            </div>
            <span class="closeModal">关闭</span>
			`
        document.body.appendChild(modalView)
       setTimeout(() => {
            let tabArr = document.querySelectorAll('[data-value]')
            console.log('tabArr', tabArr, UIState)
            if (UIState) {
                for (let index = 0; index < tabArr.length; index++) {
                    const element = tabArr[index];
                    const dataValue = element.getAttribute('data-value')
                    if (UIState == dataValue) {
                        tabArr[index].classList.add('is-active')
                        setrightNav(null, dataValue)
                    } else {
                        tabArr[index].classList.remove('is-active')
                    }
                }
            } else {
                tabArr[0].classList.add('is-active')
                setrightNav(null, '1')
            }
            document.getElementById('nav-menubar').addEventListener(
            'click',
            (el) => {
                let menuItemList = document.getElementsByClassName('menu-item')
                let clickItem = {}
                if (el.target.tagName == 'DIV') {
                    clickItem = el.target.parentElement
                } else {
                    clickItem = el.target
                }
                const activeitem = clickItem.getAttribute('data-value')
                for (let index = 0; index < menuItemList.length; index++) {
                    const element = menuItemList[index];
                    const dataValue = element.getAttribute('data-value')
                    if (dataValue && dataValue == activeitem) {
                        if (element.classList.contains('submenu')) {
                            for (let i = 0; i < element.children.length; i++) {
                                const childrenComp = element.children[i];
                                if (childrenComp.tagName == 'UL') {
                                    if (childrenComp.classList.contains('list')) {
                                        childrenComp.classList.remove('list')
                                    } else {
                                        childrenComp.classList.add('list')
                                    }
                                }
                            }
                        } else {
                            clickItem.classList.add('is-active')
                            UIState = activeitem
                            setrightNav(el, activeitem)
                        }
                    } else {
                        if (element.classList.contains('is-active')) {
                            element.classList.remove('is-active')
                        }
                    }
                }
                console.log('231231321321', menuItemList, el, clickItem)
            }
            , true)
            document.querySelector('.closeModal').onclick = () => {
                document.querySelector('.remote-Modal').remove()
            }
        }, 0);
        // <div class="tip">直接关闭</div>
        // document.getElementsByClassName('tip').addEventListener(
        //     'click',
        //     () => {
        //         let remoteModal = document.querySelector('.remote-Modal')
        //         if (remoteModal) {
        //             let loading = document.querySelector('.loading-view')
        //             loading.style.display = 'none'
        //             remoteModal.remove()
        //         }
        //     }
        // , true)
        // rightNav deviceSettings is-active .getAttribute('data-value')

    } else {
        console.error('设备信息获取失败');
    }
}

function setrightNav(el,dataValue) {
    console.log('选择左侧tab', el, dataValue)
    const rightContainer = document.querySelector('.container')
    const deviceInfo = remoteDeviceStore.deviceInfo
    const deviceid = deviceInfo.deviceid || ''
    const Model = deviceInfo.IPCam?.DeviceInfo?.Model || ''
    const FWVersion = deviceInfo.IPCam?.DeviceInfo?.FWVersion || ''
    // 录音开关
    const AudioEnabled = deviceInfo.IPCam?.ModeSetting?.AudioEnabled || ''
    // 提示音 Enabled: true
    const PromptSounds = deviceInfo.IPCam?.PromptSounds || {}
    // 设备音量
    const AudioVolume = deviceInfo.IPCam?.ModeSetting?.AudioVolume || {}
    // 移动侦测管理设置
    const AlarmSetting = deviceInfo.IPCam?.AlarmSetting || {}
    // 时间录像管理(获取TF卡相关配置)
    const TfcardManager = deviceInfo.IPCam?.TfcardManager || {}
    // 时区配置设置
    const SystemOperation = deviceInfo.IPCam?.SystemOperation || {}
    // 设备通道信息
    const ChannelStatus = deviceInfo.IPCam?.ChannelStatus || []
    // 设备能力集
    const CapabilitySet = deviceInfo.CapabilitySet
    // wifi列表
    const WirelessStation = deviceInfo.IPCam?.WirelessStation || {}
    // 摄像机模式
    const IRCutFilterMode = deviceInfo.IPCam?.ModeSetting.IRCutFilterMode || ''
    // 用户信息
    const Authorization = deviceInfo.Authorization || {}
    // 保存按钮
    let saveBtn = document.querySelector('.right-save')
    saveBtn.style.display = 'block'
    switch (dataValue) {
        case '1':
            rightContainer.setAttribute('data-type', '1')
            rightContainer.innerHTML = `
            <ul class="info">
                <li class="line-item-box">
                    <span class="item-title">设备ID:</span>
                    <span class="item-value">${deviceid}</span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">设备类型:</span>
                    <span class="item-value">${Model}</span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">设备版本:</span>
                    <span class="item-value">${FWVersion}</span>
                </li>
            </ul>
            `
            break;
        case '2-1':
            rightContainer.setAttribute('data-type', '2-1')
            rightContainer.innerHTML = `
            <ul class="AudioEnabled">
                <li class="line-item-box">
                    <span class="item-title">录像声音 开关:</span>
                    <span data-AudioEnabled="${AudioEnabled}" onclick="setAudioEnabled()" class="item-value AudioEnabled-text">${AudioEnabled?'开':'关'}</span>
                </li>
            </ul>
            `
            saveBtn.style.display = 'none'
            break;
        case '2-2':// 提示音 PromptSounds
            rightContainer.setAttribute('data-type', '2-2')
            let langComp = ''
            PromptSounds.TypeOption.forEach(element => {
                langComp = langComp + `<option value=${element}>${element}</option>`
            });
            rightContainer.innerHTML = `
            <ul class="PromptSounds">
                <li class="line-item-box">
                    <span class="item-title">提示音开关 ：</span>
                    <span data-PromptEnabled="${PromptSounds.Enabled}" class="promptBtn btn-switch ${PromptSounds.Enabled?'open':''}"></span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">选择设备提示音语言：</span>
                    <select class="promptBeepLanguage" style="width:100px">
                        ${langComp}
                    </select>
                </li>
            </ul>
            `
            let promptBtn = document.querySelector(".promptBtn");
            let promptBeepLanguages = document.querySelector(".promptBeepLanguage");
            promptBtn.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-PromptEnabled') == 'true') {
                    this.setAttribute('data-PromptEnabled', 'false')
                } else {
                    this.setAttribute('data-PromptEnabled', 'true')
                }
            }
            promptBeepLanguages.value = PromptSounds.Type
            break;
        case '2-3': // 设备音量
            rightContainer.setAttribute('data-type', '2-3')
            rightContainer.innerHTML = `
            <ul class="AudioVolume">
                <li class="line-item-box">
                    <span class="item-title">设备录像音量 ：</span>
                    <input type="text" class="recordingVolume" value="">
                </li>
                <li class="line-item-box">
                    <span class="item-title">设备播放音量 ：</span>
                    <input type="text" class="playbackVolume" value="">
                </li>
            </ul>
            `
            let recordingVolumeInpt = document.querySelector('.recordingVolume')
            let playbackVolumeInpt = document.querySelector('.playbackVolume')
            recordingVolumeInpt.value = AudioVolume.AudioInputVolume
            playbackVolumeInpt.value = AudioVolume.AudioOutputVolume
            recordingVolumeInpt.oninput = (el) => {
                let num = el.target.value.replace(/\D|^[0]+/g,'')
                if (num>100) {
                    num = 100
                }
                recordingVolumeInpt.value = num
            console.log('recordingVolumeInpt', el,'>>>',recordingVolumeInpt.value)
            }
            playbackVolumeInpt.oninput = (el) => {
                let num = el.target.value.replace(/\D|^[0]\+/g,'')
                if (num>100) {
                    num = 100
                }
                playbackVolumeInpt.value = num
            console.log('playbackVolumeInpt', el,'>>>',playbackVolumeInpt.value)
            }
            break;
        case '2-4': // 移动侦测管理
            rightContainer.setAttribute('data-type', '2-4')
            let MdRecdurationComp = ''
            let SensitivityLevelComp = ''
            let MdRecdurationList = [
                {lable: '10s', value: '10'}, 
                {lable: '20s', value: '20'},
                {lable: '30s', value: '30'}
            ] //移动侦测录像时长数组
            let SensitivityLevelList = [
                {lable: '最高', value: 'highest'}, 
                {lable: '高', value: 'high'}, 
                {lable: '中', value: 'normal'}, 
                {lable: '低', value: 'low'}, 
                {lable: '最低', value: 'lowest'}
            ] //灵敏度
            MdRecdurationList.forEach(element => {
                MdRecdurationComp = MdRecdurationComp + `<option value=${element.value}>${element.lable}</option>`
            });
            SensitivityLevelList.forEach(element => {
                SensitivityLevelComp = SensitivityLevelComp + `<option value=${element.value}>${element.lable}</option>`
            });
            console.log('AlarmSetting', AlarmSetting)
            rightContainer.innerHTML = `
            <ul class="AlarmSetting">
            ${
                AlarmSetting.hasOwnProperty('MotionDetection') && Object.prototype.toString.call(AlarmSetting?.MotionDetection) == '[object Object]' ?
                `<li class="line-item-box">
                    <span class="item-title">移动侦测 ：</span>
                    <span data-MotionDetectionEnabled="${AlarmSetting.MotionDetection.Enabled}" class="MotionDetectionEnabledBtn btn-switch ${AlarmSetting.MotionDetection.Enabled?'open':''}"></span>
                </li>` : ''
            }
                
            ${
                AlarmSetting.hasOwnProperty('MotionDetection') && Object.prototype.toString.call(AlarmSetting?.HumanoidDetection) == '[object Object]' ?
                `<li class="line-item-box">
                    <span class="item-title">人形侦测 ：</span>
                    <span data-HumanoidDetectionEnable="${AlarmSetting.HumanoidDetection.enable}" class="HumanoidDetectionEnableBtn btn-switch ${AlarmSetting.HumanoidDetection.enable?'open':''}"></span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">人形画框 ：</span>
                    <span data-HumanoidDrawRegion="${AlarmSetting.HumanoidDetection.drawRegion}" class="HumanoidDrawRegionBtn btn-switch ${AlarmSetting.HumanoidDetection.drawRegion?'open':''}"></span>
                </li>` : ''
            }
                
            ${
                AlarmSetting.hasOwnProperty('MotionDetection') && Object.prototype.toString.call(AlarmSetting?.FaceDetection) == '[object Object]' ?
                `<li class="line-item-box">
                    <span class="item-title">人脸侦测 ：</span>
                    <span data-FaceDetectionEnable="${AlarmSetting.FaceDetection?.enable}" class="FaceDetectionEnableBtn btn-switch ${AlarmSetting.FaceDetection.enable?'open':''}"></span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">人脸画框 ：</span>
                    <span data-FaceDetectionDrawRegion="${AlarmSetting.FaceDetection.drawRegion}" class="FaceDetectionDrawRegionBtn btn-switch ${AlarmSetting.FaceDetection.drawRegion?'open':''}"></span>
                </li>` : ''
            }
                <li class="line-item-box">
                    <span class="item-title">移动侦测录像时长 ：</span>
                    <select class="MdRecDuration" style="width:100px">
                        ${MdRecdurationComp}
                    </select>
                    </li>
            ${
                AlarmSetting.hasOwnProperty('MotionDetection') && Object.prototype.toString.call(AlarmSetting.MotionDetection) == '[object Object]' ?
                `
                <li class="line-item-box">
                    <span class="item-title">移动侦测录像 ：</span>
                    <span data-MotionRecord="${AlarmSetting.MotionDetection.MotionRecord}" class="MotionRecordBtn btn-switch ${AlarmSetting.MotionDetection.MotionRecord?'open':''}"></span>
                </li>
                `:''
            }
                <li class="line-item-box">
                    <span class="item-title">移动侦测报警 ：</span>
                    <span data-MessagePushEnabled="${AlarmSetting.MessagePushEnabled}" class="MessagePushEnabledBtn btn-switch ${AlarmSetting.MessagePushEnabled?'open':''}"></span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">移动侦测灵敏度 ：</span>
                    <select class="SensitivityLevel" style="width:100px">
                        ${SensitivityLevelComp}
                    </select>
                </li>
                ${
                    AlarmSetting.hasOwnProperty('MotionDetection') && Object.prototype.toString.call(AlarmSetting.MotionDetection) == '[object Object]' ?
                    `
                    <li class="line-item-box">
                        <span class="item-title">移动侦测提示音 ：</span>
                        <span data-MotionWarningTone="${AlarmSetting.MotionDetection.MotionWarningTone}" class="MotionWarningToneBtn btn-switch ${AlarmSetting.MotionDetection.MotionWarningTone?'open':''}"></span>
                    </li>
                    `:''
                }
            </ul>
            `
            let MdRecDurationValue = document.querySelector('.MdRecDuration')
            let SensitivityLevelValue = document.querySelector('.SensitivityLevel')
            MdRecDurationValue.value = AlarmSetting.MotionDetection.MdRecDuration
            SensitivityLevelValue.value = AlarmSetting.MotionDetection.SensitivityLevel
            // 批量监听开关事件
            let onMotionDetectionEnabled = document.querySelector('.MotionDetectionEnabledBtn')
            let onHumanoidDetectionEnable = document.querySelector('.HumanoidDetectionEnableBtn')
            let onHumanoidDrawRegion = document.querySelector('.HumanoidDrawRegionBtn')
            let onFaceDetectionEnable = document.querySelector('.FaceDetectionEnableBtn')
            let onFaceDetectionDrawRegion = document.querySelector('.FaceDetectionDrawRegionBtn')
            let onMotionRecord = document.querySelector('.MotionRecordBtn')
            let onMessagePushEnabled = document.querySelector('.MessagePushEnabledBtn')
            let onMotionWarningTone = document.querySelector('.MotionWarningToneBtn')
            onMotionDetectionEnabled.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-MotionDetectionEnabled') == 'true') {
                    this.setAttribute('data-MotionDetectionEnabled', 'false')
                } else {
                    this.setAttribute('data-MotionDetectionEnabled', 'true')
                }
            }
            onHumanoidDetectionEnable.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-HumanoidDetectionEnable') == 'true') {
                    this.setAttribute('data-HumanoidDetectionEnable', 'false')
                } else {
                    this.setAttribute('data-HumanoidDetectionEnable', 'true')
                }
            }
            onHumanoidDrawRegion.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-HumanoidDrawRegion') == 'true') {
                    this.setAttribute('data-HumanoidDrawRegion', 'false')
                } else {
                    this.setAttribute('data-HumanoidDrawRegion', 'true')
                }
            }
            if (onFaceDetectionEnable) {
                onFaceDetectionEnable.onclick=function () {
                    this.classList.toggle("open")
                    if (this.getAttribute('data-FaceDetectionEnable') == 'true') {
                        this.setAttribute('data-FaceDetectionEnable', 'false')
                    } else {
                        this.setAttribute('data-FaceDetectionEnable', 'true')
                    }
                }
            }
            if (onFaceDetectionDrawRegion) {
                onFaceDetectionDrawRegion.onclick=function () {
                    this.classList.toggle("open")
                    if (this.getAttribute('data-FaceDetectionDrawRegion') == 'true') {
                        this.setAttribute('data-FaceDetectionDrawRegion', 'false')
                    } else {
                        this.setAttribute('data-FaceDetectionDrawRegion', 'true')
                    }
                }
            }
            onMotionRecord.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-MotionRecord') == 'true') {
                    this.setAttribute('data-MotionRecord', 'false')
                } else {
                    this.setAttribute('data-MotionRecord', 'true')
                }
            }
            onMessagePushEnabled.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-MessagePushEnabled') == 'true') {
                    this.setAttribute('data-MessagePushEnabled', 'false')
                } else {
                    this.setAttribute('data-MessagePushEnabled', 'true')
                }
            }
            onMotionWarningTone.onclick=function () {
                this.classList.toggle("open")
                if (this.getAttribute('data-MotionWarningTone') == 'true') {
                    this.setAttribute('data-MotionWarningTone', 'false')
                } else {
                    this.setAttribute('data-MotionWarningTone', 'true')
                }
            }
            
            break;
        case '2-5': // 时间录像管理
            rightContainer.setAttribute('data-type', '2-5')
            // TfcardManager
            // "IPCam": {
            //     "TfcardManager": {
            //         "TimeRecordEnabled": arg.Enabled,
            //         "TFcard_recordSchedule": arg.TFcard_recordSchedule
            //     },
            // },
            
            // rightContainer.innerHTML = `
            // <ul class="TfcardManager">
            //     <li class="line-item-box">
            //         <span class="item-title">录像日程 ：</span>
            //         <span data-PromptEnabled="${TfcardManager.TimeRecordEnabled}" class="promptBtn btn-switch ${TfcardManager.TimeRecordEnabled?'open':''}"></span>
            //     </li>
            //     ${TimeRecordComp}
            // </ul>
            // `
            setFcard_recordTime(rightContainer, TfcardManager)
            
            // delweekDaysBtn.addEventListener('click', function name(params) {
            //     console.log('delweekDaysBtn.onclick', this,params)
            // },true)
            break;
        case '2-6': // 固件更新
            
            break;
        case '2-7': // 设备存储
            rightContainer.setAttribute('data-type', '2-7')
            let TFcardStatus = '没有插入TF卡'
            if (TfcardManager.Status == 'ok' || (TfcardManager.hasOwnProperty('TotalSpacesize') && TfcardManager.hasOwnProperty('LeaveSpacesize'))) {
                TFcardStatus = 'TF卡已插入'
            }
            rightContainer.innerHTML = TfcardManager.Status == 'ok' ? `
            <ul class="devicestorage">
                <li class="line-item-box">
                    <span class="item-title">TF卡状态 ：</span>
                    <span class="TFcardStatus">${TFcardStatus}</span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">可用容量 ：</span>
                    <span class="LeaveSpacesize">${TfcardManager.LeaveSpacesize||0}</span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">格式化TF卡 ：</span>
                    <button class="toFormatTFCard">格式化</button>
                </li>
            </ul>` : '没有TF卡'
            saveBtn.style.display = 'none'
            let toFormatTFCardEl = document.querySelector('.toFormatTFCard')
            console.log('TfcardManager :>> ', TfcardManager);
            toFormatTFCardEl.onclick = function () {
                let config = getDeviceRemoteConfig('formatTFCard')
                let devid = document.getElementById("dev_id").value;
                let user = document.getElementById("user").value;
                let pwd = document.getElementById("pwd").value;
                config.Authorization.username = user
                config.Authorization.password = pwd
                console.log('config', )
                isremoteing = true
                Player.RemoteSetting(devid, '', JSON.stringify(config))
            }
            break;
        case '3':
            rightContainer.setAttribute('data-type', '3')
            let timezoneList =  [
                {
                  name: "Asia/Shanghai",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Asia/Hong_Kong",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Asia/Irkutsk",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Asia/Kuala_Lumpur",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Australia/Perth",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Asia/Taipei",
                  val: 8,
                  GMT: "GMT+08:00"
                },
                {
                  name: "Asia/Seoul",
                  val: 9,
                  GMT: "GMT+09:00"
                },
                {
                  name: "Asia/Tokyo",
                  val: 9,
                  GMT: "GMT+09:00"
                },
                {
                  name: "Asia/Yakutsk",
                  val: 9,
                  GMT: "GMT+09:00"
                },
                {
                  name: "Australia/Brisbane",
                  val: 10,
                  GMT: "GMT+10:00"
                },
                {
                  name: "Australia/Hobart",
                  val: 10,
                  GMT: "GMT+10:00"
                },
                {
                  name: "Australia/Sydney",
                  val: 10,
                  GMT: "GMT+10:00"
                },
                {
                  name: "Asia/Vladivostok",
                  val: 10,
                  GMT: "GMT+10:00"
                },
                {
                  name: "Pacific/Guam",
                  val: 10,
                  GMT: "GMT+10:00"
                },
                {
                  name: "Asia/Magadan",
                  val: 11,
                  GMT: "GMT+11:00"
                },
                {
                  name: "Pacific/Noumea",
                  val: 11,
                  GMT: "GMT+11:00"
                },
                {
                  name: "Pacific/Majuro",
                  val: 12,
                  GMT: "GMT+12:00"
                },
                {
                  name: "Pacific/Auckland",
                  val: 12,
                  GMT: "GMT+12:00"
                },
                {
                  name: "Pacific/Fiji",
                  val: 12,
                  GMT: "GMT+12:00"
                },
                {
                  name: "Pacific/Tongatapu",
                  val: 13,
                  GMT: "GMT+13:00"
                },
                {
                  name: "Pacific/Midway",
                  val: -11,
                  GMT: "GMT-11:00"
                },
                {
                  name: "Pacific/Honolulu",
                  val: -10,
                  GMT: "GMT-10:00"
                },
                {
                  name: "America/Anchorage",
                  val: -8,
                  GMT: "GMT-08:00"
                },
                {
                  name: "America/Los_Angeles",
                  val: -7,
                  GMT: "GMT-07:00"
                },
                {
                  name: "America/Tijuana",
                  val: -7,
                  GMT: "GMT-07:00"
                },
                {
                  name: "America/Phoenix",
                  val: -7,
                  GMT: "GMT-07:00"
                },
                {
                  name: "America/Chihuahua",
                  val: -6,
                  GMT: "GMT-06:00"
                },
                {
                  name: "America/Denver",
                  val: -6,
                  GMT: "GMT-06:00"
                },
                {
                  name: "America/Costa_Rica",
                  val: -6,
                  GMT: "GMT-06:00"
                },
                {
                  name: "America/Regina",
                  val: -6,
                  GMT: "GMT-06:00"
                },
                {
                  name: "America/Chicago",
                  val: -5,
                  GMT: "GMT-05:00"
                },
                {
                  name: "America/Mexico_City",
                  val: -5,
                  GMT: "GMT-05:00"
                },
                {
                  name: "America/Bogota",
                  val: -5,
                  GMT: "GMT-05:00"
                },
                {
                  name: "America/New_York",
                  val: -4,
                  GMT: "GMT-04:00"
                },
                {
                  name: "America/Caracas",
                  val: -4,
                  GMT: "GMT-04:00"
                },
                {
                  name: "America/Barbados",
                  val: -4,
                  GMT: "GMT-04:00"
                },
                {
                  name: "America/Manaus",
                  val: -4,
                  GMT: "GMT-04:00"
                },
                {
                  name: "America/Santiago",
                  val: -4,
                  GMT: "GMT-04:00"
                },
                {
                  name: "America/Halifax",
                  val: -3,
                  GMT: "GMT-03:00"
                },
                {
                  name: "America/Recife",
                  val: -3,
                  GMT: "GMT-03:00"
                },
                {
                  name: "America/Sao_Paulo",
                  val: -3,
                  GMT: "GMT-03:00"
                },
                {
                  name: "America/Argentina/Buenos_Aires",
                  val: -3,
                  GMT: "GMT-03:00"
                },
                {
                  name: "America/Montevideo",
                  val: -3,
                  GMT: "GMT-03:00"
                },
                {
                  name: "America/Godthab",
                  val: -2,
                  GMT: "GMT-02:00"
                },
                {
                  name: "Atlantic/South_Georgia",
                  val: -2,
                  GMT: "GMT-02:00"
                },
                {
                  name: "Atlantic/Cape_Verde",
                  val: -1,
                  GMT: "GMT-01:00"
                },
                {
                  name: "Atlantic/Azores",
                  val: 0,
                  GMT: "GMT+00:00"
                },
                {
                  name: "Africa/Casablanca",
                  val: 1,
                  GMT: "GMT+01:00"
                },
                {
                  name: "Europe/London",
                  val: 1,
                  GMT: "GMT+01:00"
                },
                {
                  name: "Africa/Brazzaville",
                  val: 1,
                  GMT: "GMT+01:00"
                },
                {
                  name: "Europe/Amsterdam",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Europe/Belgrade",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Europe/Brussels",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Europe/Madrid",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Europe/Sarajevo",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Africa/Windhoek",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Africa/Cairo",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Africa/Harare",
                  val: 2,
                  GMT: "GMT+02:00"
                },
                {
                  name: "Asia/Amman",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Europe/Athens",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Europe/Istanbul",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Asia/Beirut",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Europe/Helsinki",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Asia/Jerusalem",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Europe/Minsk",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Asia/Baghdad",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Europe/Moscow",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Asia/Kuwait",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Africa/Nairobi",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                 {
                  name: "Asia/Tehran",
                  val: 3,
                  GMT: "GMT+03:00"
                },
                {
                  name: "Asia/Baku",
                  val: 4,
                  GMT: "GMT+04:00"
                },
                {
                  name: "Asia/Tbilisi",
                  val: 4,
                  GMT: "GMT+04:00"
                },
                {
                  name: "Asia/Yerevan",
                  val: 4,
                  GMT: "GMT+04:00"
                },
                {
                  name: "Asia/Dubai",
                  val: 4,
                  GMT: "GMT+04:00"
                },
                {
                  name: "Asia/Karachi",
                  val: 5,
                  GMT: "GMT+05:00"
                },
                {
                  name: "Asia/Oral",
                  val: 5,
                  GMT: "GMT+05:00"
                },
                {
                  name: "Asia/Yekaterinburg",
                  val: 5,
                  GMT: "GMT+05:00"
                },
                {
                  name: "Asia/Almaty",
                  val: 6,
                  GMT: "GMT+06:00"
                },
                {
                  name: "Asia/Krasnoyarsk",
                  val: 7,
                  GMT: "GMT+07:00"
                },
                {
                  name: "Asia/Bangkok",
                  val: 7,
                  GMT: "GMT+07:00"
                },
                {
                  name: "Asia/Jakarta",
                  val: 7,
                  GMT: "GMT+07:00"
                }
            ] //时区数据
            let SummerTimeList= [
                {value: "Germany", lable: '德国',},
                {value: "Holand", lable: '荷兰',},
                {value: "Poland", lable: '波兰',},
                {value: "Iran", lable: '伊朗',},
                {value: "Israel", lable: '以色列',},
                {value: "Brazil", lable: '巴西',},
            ] // 夏令时数据
            let selectTimeZoneComp = ``
            timezoneList.forEach(element => {
                let lable = ''
                for (let index = 0; index < timeZoneTranslation.length; index++) {
                    const obj = timeZoneTranslation[index];
                    if (obj.hasOwnProperty(element.name)) {
                        lable=obj[element.name]
                        break
                    }
                }
                
                selectTimeZoneComp = selectTimeZoneComp + `<div data-value="${element.val}" data-GMT="${element.GMT}">${lable} ${element.GMT}</div>`
            });
            let SummerTimeComp = ``
            SummerTimeList.forEach(element => {
                SummerTimeComp = SummerTimeComp + `<option value=${element.value}>${element.lable}</option>`
            });
            console.log('SystemOperation', SystemOperation)
            // <select class="selectTimeZone" style="width:250px">
            //     ${selectTimeZoneComp}
            // </select>
            rightContainer.innerHTML = `
            <ul class="SystemOperation">
                <li class="line-item-box">
                    <span class="item-title">同步时间:</span>
                    <button class="toFormatTFCard">同步设备时间</button>
                </li>
                <li class="line-item-box">
                    <span class="item-title">选择时区:</span>
                    <span>
                        <span data-selectTimeZone="" class="selectTimeZone"></span>
                        <button class="open-select-timezonen" data-value="false">展开</button>
                    </span>
                    
                    <div class="select-timezonen-item" style="display:none">
                        ${selectTimeZoneComp}
                    </div>
                </li>
                <li class="line-item-box">
                    <span class="item-title">夏令时:</span>
                    <span data-DaylightSavingTimeEnabled="${SystemOperation.DaylightSavingTime.Enabled}" class="DaylightSavingTimetBtn btn-switch ${SystemOperation.DaylightSavingTime.Enabled?'open':''}"></span>
                </li>
                <li class="line-item-box selectSummerTime-view" style="display:${SystemOperation.DaylightSavingTime.Enabled ? 'flex' : 'none'}">
                    <span class="item-title">选择夏令时:</span>
                    <select class="selectSummerTime" style="width:100px">
                        ${SummerTimeComp}
                    </select>
                </li>
            </ul>
            `
            let selectTimeZone = document.querySelector('.selectTimeZone')
            let openSelectTimezonen = document.querySelector('.open-select-timezonen')
            let selectTimezonenItem = document.querySelector('.select-timezonen-item')
            selectTimezonenItem.onclick = function (el) {
                let selectValue = el.target.getAttribute('data-value')
                let selecGMT = el.target.getAttribute('data-GMT')
                selectTimeZone.setAttribute('data-selectTimeZone', selectValue)
                selectTimeZone.innerText = selecGMT
                selectTimezonenItem.style.display = 'none'
                openSelectTimezonen.setAttribute('data-value', false)
                openSelectTimezonen.innerText = '收起'
                console.log('selectTimezonenItem.onclick',selectValue, selecGMT, el.target.getAttribute('data-value'))
            }
            openSelectTimezonen.onclick = function (el) {
                if (this.getAttribute('data-value') == 'false') {
                    this.setAttribute('data-value', true)
                    selectTimezonenItem.style.display = 'block'
                    openSelectTimezonen.innerText = '收起'
                } else if (this.getAttribute('data-value') == 'true') {
                    this.setAttribute('data-value', false)
                    selectTimezonenItem.style.display = 'none'
                    openSelectTimezonen.innerText = '展开'
                }
            }
            let timeZoon = isNaN(Number(SystemOperation.TimeSync.TimeZone)) ?
            '' : Number(SystemOperation.TimeSync.TimeZone) / 100
            selectTimeZone.setAttribute('data-selectTimeZone', timeZoon)
            for (let index = 0; index < timezoneList.length; index++) {
                const textValue = timezoneList[index];
                if (textValue.val == timeZoon) {
                    selectTimeZone.innerText = selectTimeZone.innerText = textValue.GMT
                    break
                }
            }
            if (SystemOperation.DaylightSavingTime.Enabled) {
                let selectSummerTime = null
                selectSummerTime = document.querySelector('.selectSummerTime')
                selectSummerTime.value = SystemOperation.DaylightSavingTime.Country
            }
            let DaylightSavingTimetBtn = document.querySelector('.DaylightSavingTimetBtn')
            DaylightSavingTimetBtn.onclick =function (params) {
                let selectSummerTimeiew = document.querySelector('.selectSummerTime-view')
                this.classList.toggle("open")
                if (this.getAttribute('data-DaylightSavingTimeEnabled') == 'true') {
                    this.setAttribute('data-DaylightSavingTimeEnabled', 'false')
                    selectSummerTimeiew.style.display = 'none'
                } else {
                    this.setAttribute('data-DaylightSavingTimeEnabled', 'true')
                    selectSummerTimeiew.style.display = 'flex'
                }
            }
            let toFormatTFCard = document.querySelector('.toFormatTFCard')
            toFormatTFCard.onclick =function (params) {
                let config = getDeviceRemoteConfig('AsyncWindowsTime')
                let devid = document.getElementById("dev_id").value;
                let user = document.getElementById("user").value;
                let pwd = document.getElementById("pwd").value;
                let date = new Date();
                config.IPCam.SystemOperation.TimeSync.LocalTime = date.toISOString(),
                config.IPCam.SystemOperation.TimeSync.UTCTime = parseInt(date.getTime() / 1000).toString(),
                config.IPCam.SystemOperation.TimeSync.TimeZone = parseInt(-date.getTimezoneOffset() / 60) * 100 + (-date.getTimezoneOffset() / 60 - parseInt(-date.getTimezoneOffset() / 60)) * 60
                config.Authorization.username = user
                config.Authorization.password = pwd
                console.log('config', )
                isremoteing = true
                Player.RemoteSetting(devid, '', JSON.stringify(config))
            }
            break;
        case '4': // 网络设置
            rightContainer.setAttribute('data-type', '4')
            let ChannelSignalComp = ``
            ChannelStatus.forEach((element, index) => {
                let signalLevel = '强'
                if (element.Signal>=70) {
                    signalLevel = '强'
                } else if (element.Signal>=40 && element.Signal < 70) {
                    signalLevel = '一般'
                } else if (element.Signal>=20 && element.Signal < 40) {
                    signalLevel = '差'
                } else if (element.Signal>0 && element.Signal < 20) {
                    signalLevel = '极差'
                } else {
                    signalLevel = '无信号'
                }
                ChannelSignalComp = ChannelSignalComp + `
                <li class="line-item-box">
                    <span class="item-title">${ChannelStatus.length>1?`设备通道${index}`:'设备'}信号强度:</span>
                    <span class="item-value">${signalLevel}</span>
                </li>
                `
            });
            let selectWIFIComp = ``
            console.log('WirelessStation', WirelessStation)
            
            rightContainer.innerHTML = CapabilitySet.wifiStationCanSet ? `
            <ul class="networkSettings">
                <li class="line-item-box">
                    <span class="item-title">设备信号状态</span>
                </li>
                ${ChannelSignalComp}
                <li class="line-item-box">
                    <span class="item-title">更改设备WIFI:</span>
                    <button class="item-value getWifiAPsData">></button>
                    <div class="select-WIFI-item" data-type="false" data-account="" style="display:none"></div>
                </li>
            </ul>` : '设备不支持WIFI'
            setTimeout(() => {
                if (Array.isArray(WirelessStation.APs)) {
                    let selectWIFIList = document.querySelector('.select-WIFI-item')
                    selectWIFIList.style.display = 'block'
                    selectWIFIList.setAttribute('data-type', 'true')
                    WirelessStation.APs.forEach((element, index) => {
                        selectWIFIComp = selectWIFIComp + `<div data-id="${element.ssid}">${remoteApi.decode64(element.ssid)}</div>`
                    })
                    selectWIFIList.innerHTML = selectWIFIComp
                    selectWIFIList.onclick = function (el) {
                        console.log('点击wifi', el)
                        // 选中wifi
                        let itemValue = el.target.getAttribute('data-id')
                        selectWIFIList.setAttribute('data-account', itemValue)
                        let ismodal = document.querySelector('.wifipassword')
                        console.log('first', ismodal)
                        if (ismodal) {
                            ismodal.remove()
                        }
                        const modalView = document.createElement("div");
                        modalView.className = 'wifipassword';
                        modalView.id = 'modal';
                        modalView.innerHTML = `
                        <div class="flex">
                            <span class="close-modal">关闭</span>
                        </div>
                        <input type="password" name="password" class="inpt-password" id=""/>
                        <div class="flex">
                            <span class="save-modal">保存</span>
                        </div>
                        `
                        rightContainer.appendChild(modalView)
                        document.querySelector('.close-modal').onclick = function (params) {
                            selectWIFIList.setAttribute('data-account', '')
                            modalView.remove()
                        }
                        document.querySelector('.save-modal').onclick = function (params) {
                            let account = selectWIFIList.getAttribute('data-account')
                            let passValue = remoteApi.encode64(document.querySelector('.inpt-password').value)
                            // console.log('点击保存', account,passValue)
                            remoteApi.setNetwork(account, passValue)
                            modalView.remove()
                            selectWIFIList.style.display = 'none'
                        }
                    }
                }
            }, 0);
            if (CapabilitySet.wifiStationCanSet) {
                let getWifiAPsDataBtn = document.querySelector('.getWifiAPsData')
                getWifiAPsDataBtn.onclick = function (params) {
                    let loading = document.querySelector('.loading-view')
                    let selectWIFIList = document.querySelector('.select-WIFI-item')
                            console.log('selectWIFIList', selectWIFIList)
                    if (selectWIFIList.getAttribute('data-type') == 'true') {
                        selectWIFIList.style.display = 'none'
                        selectWIFIList.setAttribute('data-type', 'false')
                        WirelessStation.APs = []
                        loading.style.display = 'none'
                        document.querySelector('.wifipassword').remove()
                        console.log('隐藏')
                    } else {
                        selectWIFIList.setAttribute('data-type', 'true')
                        selectWIFIList.style.display = 'block'
                        loading.style.display = 'block'
                        console.log('显示')
                        remoteApi.getWifiAPsData()
                    }
                }
            }
            break;
        case '5-2': // 视频图像设置
            rightContainer.setAttribute('data-type', '5-2')
            let modeListComp = ``
            let modeList = []
            // 判断显示类型，灯控或者普通类型
            if (IRCutFilterMode == "auto" || IRCutFilterMode == "daylight" || IRCutFilterMode == "night") {
                modeList = [
                    {id: 'auto', lable: '自动'}, 
                    {id: 'daylight', lable: '白天'}, 
                    {id: 'night', lable: '黑夜'}
                ];
            } else {
                modeList = [
                    {id: 'ir', lable: '红外'}, 
                    {id: 'light', lable: '全彩'},
                    {id: 'smart', lable: '智能'}
                ];
            }
            modeList.forEach(element => {
                modeListComp = modeListComp + `<option value=${element.id}>${element.lable}</option>`
            });
            rightContainer.innerHTML = `
            <ul class="networkSettings">
                <li class="line-item-box">
                    <span class="item-title">模式</span>
                    <select class="modeSelect" style="width:100px">
                        ${modeListComp}
                    </select>
                </li>
            </ul>`
            document.querySelector('.modeSelect').value = IRCutFilterMode
            break;
        case '6': // 密码设置
            rightContainer.setAttribute('data-type', '6')
            rightContainer.innerHTML = `
            <ul class="networkSettings">
                <li class="line-item-box">
                    <span class="item-title">设备用户名</span>
                    <span class="item-value">${Authorization.username ? Authorization.username : 'admin'}</span>
                </li>
                <li class="line-item-box">
                    <span class="item-title">密码:</span>
                    <button class="item-value RevisePassword">修改</button>
                    <!-- <div class="RevisePassword-view" data-type="false" data-account="" style="display:none"></div> -->
                </li>
            </ul>`
            let RevisePasswordBtn = document.querySelector('.RevisePassword')
            RevisePasswordBtn.onclick = function (params) {
                let RevisePasswordView = document.querySelector('.RevisePassword-view')
                // if (RevisePasswordView.getAttribute('data-type') == 'true') {
                //     RevisePasswordView.style.display = 'none'
                //     RevisePasswordView.setAttribute('data-type', 'false')
                //     console.log('隐藏')
                // } else {
                //     RevisePasswordView.setAttribute('data-type', 'true')
                //     RevisePasswordView.style.display = 'block'
                //     let ismodal = document.querySelector('.devicepassword')
                //     console.log('first', ismodal)
                //     if (ismodal) {
                //         ismodal.remove()
                //     }
                // }
                const modalView = document.createElement("div");
                    modalView.className = 'devicepassword';
                    modalView.id = 'modal';
                    modalView.innerHTML = `
                    <div class="flex">
                        <span class="close-modal">关闭</span>
                    </div>
                    <input type="password" name="password" class="inpt-password" id=""/>
                    <div class="flex">
                        <span class="save-modal">保存</span>
                    </div>
                    `
                    rightContainer.appendChild(modalView)
                    document.querySelector('.close-modal').onclick = function (params) {
                        selectWIFIList.setAttribute('data-account', '')
                        modalView.remove()
                    }
                    document.querySelector('.save-modal').onclick = function (params) {
                        let username = Authorization.username || 'admin'
                        let passValue = document.querySelector('.inpt-password').value
                        console.log('点击保存', Authorization.username, passValue)
                        remoteApi.setDevicePassword(username, passValue)
                        setTimeout(() => {
                            document.querySelector('.remote-Modal').remove()
                            handleMessage('输入密码后重新连接')
                        }, 300);
                        modalView.remove()
                    }
            }
            break;
        default:
            break;
    }
}
// 设置设备音频开关 (设置区只有一个)
function setAudioEnabled(params) {
    let theAudioEnabled = document.querySelector('.AudioEnabled-text')
    if (theAudioEnabled.getAttribute('data-AudioEnabled') == 'true') {
        theAudioEnabled.setAttribute('data-AudioEnabled', 'false')
        theAudioEnabled.innerText = '关'
    } else {
        theAudioEnabled.setAttribute('data-AudioEnabled', 'true')
        theAudioEnabled.innerText = '开'
    }
    console.log('设置设备音频开关', theAudioEnabled,theAudioEnabled.getAttribute('data-AudioEnabled'))
}
// 设置时间录像管理显示
function setFcard_recordTime(rightContainer, TfcardManager) {
    // if (TfcardManager.Status == 'no_tfcard') {
    //     rightContainer.innerHTML = `
    //     <ul class="TfcardManager">
    //         <li class="line-item-box">
    //             <span class="e">没有TF卡</span>
    //         </li>
    //     </ul>
    //     `
    //     return
    // }
    let timeline = ``
    let startTimeList = [
        //开始时间列表
        { id: 1, displaytext: "00:00" },
        { id: 2, displaytext: "00:30" },
        { id: 3, displaytext: "01:00" },
        { id: 4, displaytext: "01:30" },
        { id: 5, displaytext: "02:00" },
        { id: 6, displaytext: "02:30" },
        { id: 7, displaytext: "03:00" },
        { id: 8, displaytext: "03:30" },
        { id: 9, displaytext: "04:00" },
        { id: 10, displaytext: "04:30" },
        { id: 11, displaytext: "05:00" },
        { id: 12, displaytext: "05:30" },
        { id: 13, displaytext: "06:00" },
        { id: 14, displaytext: "06:30" },
        { id: 15, displaytext: "07:00" },
        { id: 16, displaytext: "07:30" },
        { id: 17, displaytext: "08:00" },
        { id: 18, displaytext: "08:30" },
        { id: 19, displaytext: "09:00" },
        { id: 20, displaytext: "09:30" },
        { id: 21, displaytext: "10:00" },
        { id: 22, displaytext: "10:30" },
        { id: 23, displaytext: "11:00" },
        { id: 24, displaytext: "11:30" },
        { id: 25, displaytext: "12:00" },
        { id: 26, displaytext: "12:30" },
        { id: 27, displaytext: "13:00" },
        { id: 28, displaytext: "13:30" },
        { id: 29, displaytext: "14:00" },
        { id: 30, displaytext: "14:30" },
        { id: 31, displaytext: "15:00" },
        { id: 32, displaytext: "15:30" },
        { id: 33, displaytext: "16:00" },
        { id: 34, displaytext: "16:30" },
        { id: 35, displaytext: "17:00" },
        { id: 36, displaytext: "17:30" },
        { id: 37, displaytext: "18:00" },
        { id: 38, displaytext: "18:30" },
        { id: 39, displaytext: "19:00" },
        { id: 40, displaytext: "19:30" },
        { id: 41, displaytext: "20:00" },
        { id: 42, displaytext: "20:30" },
        { id: 43, displaytext: "21:00" },
        { id: 44, displaytext: "21:30" },
        { id: 45, displaytext: "22:00" },
        { id: 46, displaytext: "22:30" },
        { id: 47, displaytext: "23:00" },
        { id: 48, displaytext: "23:30" },
        { id: 49, displaytext: "23:59" }
    ]

    let endTimeList = [
        //结束时间列表
        { id: 1, displaytext: "00:00" },
        { id: 2, displaytext: "00:30" },
        { id: 3, displaytext: "01:00" },
        { id: 4, displaytext: "01:30" },
        { id: 5, displaytext: "02:00" },
        { id: 6, displaytext: "02:30" },
        { id: 7, displaytext: "03:00" },
        { id: 8, displaytext: "03:30" },
        { id: 9, displaytext: "04:00" },
        { id: 10, displaytext: "04:30" },
        { id: 11, displaytext: "05:00" },
        { id: 12, displaytext: "05:30" },
        { id: 13, displaytext: "06:00" },
        { id: 14, displaytext: "06:30" },
        { id: 15, displaytext: "07:00" },
        { id: 16, displaytext: "07:30" },
        { id: 17, displaytext: "08:00" },
        { id: 18, displaytext: "08:30" },
        { id: 19, displaytext: "09:00" },
        { id: 20, displaytext: "09:30" },
        { id: 21, displaytext: "10:00" },
        { id: 22, displaytext: "10:30" },
        { id: 23, displaytext: "11:00" },
        { id: 24, displaytext: "11:30" },
        { id: 25, displaytext: "12:00" },
        { id: 26, displaytext: "12:30" },
        { id: 27, displaytext: "13:00" },
        { id: 28, displaytext: "13:30" },
        { id: 29, displaytext: "14:00" },
        { id: 30, displaytext: "14:30" },
        { id: 31, displaytext: "15:00" },
        { id: 32, displaytext: "15:30" },
        { id: 33, displaytext: "16:00" },
        { id: 34, displaytext: "16:30" },
        { id: 35, displaytext: "17:00" },
        { id: 36, displaytext: "17:30" },
        { id: 37, displaytext: "18:00" },
        { id: 38, displaytext: "18:30" },
        { id: 39, displaytext: "19:00" },
        { id: 40, displaytext: "19:30" },
        { id: 41, displaytext: "20:00" },
        { id: 42, displaytext: "20:30" },
        { id: 43, displaytext: "21:00" },
        { id: 44, displaytext: "21:30" },
        { id: 45, displaytext: "22:00" },
        { id: 46, displaytext: "22:30" },
        { id: 47, displaytext: "23:00" },
        { id: 48, displaytext: "23:30" },
        { id: 49, displaytext: "23:59" }
    ]
    let startTimeListComp = ``
    let endTimeListComp = ``
    startTimeList.forEach(element => {
        startTimeListComp = startTimeListComp + `<option value=${element.id}>${element.displaytext}</option>`
    });
    endTimeList.forEach(element => {
        endTimeListComp = endTimeListComp + `<option value=${element.id}>${element.displaytext}</option>`
    });
    timeline = `
        
            <div>
                时间范围：从
                <select class="startTimeSelect" style="width:100px">
                    ${startTimeListComp}
                </select>
                到
                <select class="endTimeSelect" style="width:100px">
                    ${endTimeListComp}
                </select>
            </div>
            <div class="checkbox-group">
                <span class="">一<input type="checkbox" name="1" id=""/></span>
                <span class="">二<input type="checkbox" name="2" id=""/></span>
                <span class="">三<input type="checkbox" name="3" id=""/></span>
                <span class="">四<input type="checkbox" name="4" id=""/></span>
                <span class="">五<input type="checkbox" name="5" id=""/></span>
                <span class="">六<input type="checkbox" name="6" id=""/></span>
                <span class="">日<input type="checkbox" name="0" id=""/></span>
            </div>
            <button class="addAgenda">添加日程</button>
    `
    let TimeRecordComp = ``
    let TFcard_recordScheduleArr = TfcardManager.TFcard_recordSchedule
    if (TFcard_recordScheduleArr.length > 0) {
        TimeRecordComp = `
            <li class="line-item-box">
                <span class="item-title">日程列表 ：</span>
            </li>
        `
        TFcard_recordScheduleArr.forEach((element, index) => {
            // BeginTime: "00:00:00"
            // EndTime: "23:59:59"
            // ID: 0
            // Weekday: "0,1,2,3,4,5,6"
            let weekArr = element.Weekday.split(",")
            let weekText = ''
            let weekDays = ''
            // var a = weekDays.slice(0, weekDays.length - 1);
            // return a;
            weekArr.sort(function(m, n) {
                if (m < n) return -1;
                else if (m > n) return 1;
                else return 0;
            })
            // 转字符串
            weekText = weekArr.join(",");
                if (weekText.search("1") > -1) {
                    weekDays += '一' + "、";
                }
                if (weekText.search("2") > -1) {
                    weekDays += '二' + "、";
                }
                if (weekText.search("3") > -1) {
                    weekDays += '三' + "、";
                }
                if (weekText.search("4") > -1) {
                    weekDays += '四' + "、";
                }
                if (weekText.search("5") > -1) {
                    weekDays += '五' + "、";
                }
                if (weekText.search("6") > -1) {
                    weekDays += '六' + "、";
                }
                if (weekText.search("0") > -1) {
                    weekDays += '日' + "、";
                }
                console.log('first', weekDays,weekDays.slice(0, weekDays.length - 1))
                weekDays = weekDays.slice(0, weekDays.length - 1);
            TimeRecordComp = TimeRecordComp + `
            <li class="line-item-box" ${element.ID?.toString() ? `data-id="${element.ID}"` : ''} data-key="${index}">
                <span class="">
                    <span class="">录像日程${index + 1}</span>
                    <span class="">${element.BeginTime} - ${element.EndTime}</span>
                    <span class="" data-weekValue="${weekText}">重复：${weekDays}</span>
                </span>
                <span class="delweekDays">删除</span>
            </li>
            `
        });
    }
    console.log('TFcard_recordSchedule', TFcard_recordScheduleArr)
    rightContainer.innerHTML = `
    <ul class="TfcardManager">
        <li class="line-item-box">
            <span class="item-title">录像日程 ：</span>
            <span data-PromptEnabled="${TfcardManager.TimeRecordEnabled || false}" class="promptBtn btn-switch ${TfcardManager.TimeRecordEnabled?'open':''}"></span>
        </li>
        <li class="timelineConfig">
           
        </li>
        ${TimeRecordComp}
    </ul>
    `
    console.log('TfcardManager.TimeRecordEnabled', TfcardManager.TimeRecordEnabled)
    if (TfcardManager.TimeRecordEnabled) {
        // rightContainer.innerHTML = `
        // <ul class="TfcardManager">
        //     <li class="line-item-box">
        //         <span class="item-title">录像日程 ：</span>
        //         <span data-PromptEnabled="${TfcardManager.TimeRecordEnabled || false}" class="promptBtn btn-switch ${TfcardManager.TimeRecordEnabled?'open':''}"></span>
        //     </li>
        //     <li class="timelineConfig">
        //         ${TfcardManager.TimeRecordEnabled ? timeline:''}
        //     </li>
        //     ${TimeRecordComp}
        // </ul>
        // `
        document.querySelector('.timelineConfig').innerHTML = timeline
        let startTimeSelectEL = document.querySelector('.timelineConfig .startTimeSelect')
        let endTimeSelectEL = document.querySelector('.timelineConfig .endTimeSelect')
        startTimeSelectEL.value = startTimeSelectEL&&startTimeList[0].id
        endTimeSelectEL.value = endTimeSelectEL&&endTimeList[endTimeList.length - 1].id
    }
    let TfcardManagerEL = document.querySelector('.TfcardManager')
    TfcardManagerEL.onclick = function (el) {
        console.log('delweekDaysBtn.onclick', this,el)
        if (el.target.tagName == 'SPAN' && el.target.classList.contains('btn-switch')) {
            el.target.classList.toggle("open")
            let timelineConfig = document.querySelector('.timelineConfig')
            if (el.target.getAttribute('data-PromptEnabled') == 'true') {
                el.target.setAttribute('data-PromptEnabled', 'false')
                timelineConfig.innerHTML = ''
            } else {
                el.target.setAttribute('data-PromptEnabled', 'true')
                console.log('timelineConfig', timelineConfig)
                timelineConfig.innerHTML = timeline
                let startTimeSelectValue = document.querySelector('.startTimeSelect')
                let endTimeSelectValue = document.querySelector('.endTimeSelect')
                startTimeSelectValue.value = startTimeList[0].id
                endTimeSelectValue.value = endTimeList[endTimeList.length - 1].id
            }
            return
        }
        if (el.target.tagName == 'BUTTON' && el.target.classList.contains('addAgenda')) {
            let checkboxList = document.querySelectorAll('.checkbox-group input')
            let check = [] // 默认一开始没有勾选
            console.log('checkboxList', checkboxList)
            for (let index = 0; index < checkboxList.length; index++) {
                const element = checkboxList[index];
                if (element.checked == true) {
                    check.push(element.name)
                }
            }
            
            if (check.length>0) {
                check.sort(function(m, n) {
                    if (m < n) return -1;
                    else if (m > n) return 1;
                    else return 0;
                })
                let checkText = check.join(",");
                let startTimeSelect = document.querySelector('.startTimeSelect')
                let endTimeSelect = document.querySelector('.endTimeSelect')
                TfcardManager.TimeRecordEnabled = true
                TfcardManager.TFcard_recordSchedule.push({
                    Weekday: checkText,
                    BeginTime: startTimeList[startTimeSelect.value - 1].displaytext,
                    EndTime: endTimeList[endTimeSelect.value - 1].displaytext,
                })
                // startTimeSelect.value = startTimeList[0].id
                // endTimeSelect.value = endTimeList[endTimeList.length - 1].id
                setFcard_recordTime(rightContainer, TfcardManager)
            } else {
			    handleMessage('请选择录像时间')
            }
        }
        if (el.target.tagName == 'SPAN' && el.target.innerText == '删除') {
            console.log('parentElement', el.target.parentElement.getAttribute('data-id'),el.target.parentElement.getAttribute('data-key'))
            // el.target.parentElement.remove()
            let num = el.target.parentElement.getAttribute('data-key')
            TfcardManager.TFcard_recordSchedule.splice(num, 1)
            setFcard_recordTime(rightContainer, TfcardManager)
        }
    }
    // addAgenda.onclick = function () {
    // }
}
// 保存当前配置
function saveConfig(params) {
    let rightSave = document.querySelector('.right-save')
    let container = document.querySelector('.container')
    let containerKey = container.getAttribute('data-type')
    let devid = document.getElementById("dev_id").value;
    let user = document.getElementById("user").value;
    let pwd = document.getElementById("pwd").value;
    let config = {}
    switch (containerKey) {
        case '2-1':
            let theAudioEnabled = document.querySelector('.AudioEnabled-text')
            let enabled = theAudioEnabled.getAttribute('data-AudioEnabled') == 'true' ? true : false
            remoteApi.setAudioEnabled(enabled)
            break;
        case '2-2':
            let promptBtn = document.querySelector('.promptBtn')
            let promptBeepLanguage = document.querySelector('.promptBeepLanguage')
            let promptEnabled = promptBtn.getAttribute('data-PromptEnabled') == 'true' ? true : false
            let type = promptBeepLanguage.value
            remoteApi.setPromptSounds(promptEnabled, type)
            break;
        case '2-3':
            let recordingVolumeInpt = document.querySelector('.recordingVolume')
            let playbackVolumeInpt = document.querySelector('.playbackVolume')
            let AudioInputVolume = parseInt(recordingVolumeInpt.value)
            let AudioOutputVolume = parseInt(playbackVolumeInpt.value)
            remoteApi.setAudioVolume(AudioInputVolume, AudioOutputVolume)
            break;
        case '2-4':
            let getMotionDetectionEnabledBtn = document.querySelector('.MotionDetectionEnabledBtn')
            let getHumanoidDetectionEnableBtn = document.querySelector('.HumanoidDetectionEnableBtn')
            let getHumanoidDrawRegionBtn = document.querySelector('.HumanoidDrawRegionBtn')
            let getFaceDetectionEnableBtn = document.querySelector('.FaceDetectionEnableBtn')
            let getFaceDetectionDrawRegionBtn = document.querySelector('.FaceDetectionDrawRegionBtn')
            let getMdRecDuration = document.querySelector('.MdRecDuration')
            let getMotionRecordBtn = document.querySelector('.MotionRecordBtn')
            let getMessagePushEnabledBtn = document.querySelector('.MessagePushEnabledBtn')
            let getSensitivityLevel = document.querySelector('.SensitivityLevel')
            let getMotionWarningToneBtn = document.querySelector('.MotionWarningToneBtn')
            // 移动侦测
            let MotionDetectionEnabled = getMotionDetectionEnabledBtn.getAttribute('data-MotionDetectionEnabled') == 'true' ? true : false
            // 人形侦测
            let HumanoidDetectionenable = getHumanoidDetectionEnableBtn.getAttribute('data-HumanoidDetectionEnable') == 'true' ? true : false
            // 人形画框
            let HumanoidDetectiondrawRegion = getHumanoidDrawRegionBtn.getAttribute('data-HumanoidDrawRegion') == 'true' ? true : false
            // 人脸侦测
            let FaceDetectionenable = getFaceDetectionEnableBtn.getAttribute('data-FaceDetectionEnable') == 'true' ? true : false
            // 人脸画框
            let FaceDetectiondrawRegion = getFaceDetectionDrawRegionBtn.getAttribute('data-FaceDetectionDrawRegion') == 'true' ? true : false
            // 移动侦测录像时长
            let MotionDetectionMdRecDuration = Number(getMdRecDuration.value)
            // 移动侦测录像
            let MotionDetectionMotionRecord = getMotionRecordBtn.getAttribute('data-MotionRecord') == 'true' ? true : false
            // 移动侦测报警
            let MessagePushEnabled = getMessagePushEnabledBtn.getAttribute('data-MessagePushEnabled') == 'true' ? true : false
            // 移动侦测灵敏度
            let MotionDetectionSensitivityLevel = getSensitivityLevel.value
            // 移动侦测提示音
            let MotionDetectionMotionWarningTone = getMotionWarningToneBtn.getAttribute('data-MotionWarningTone') == 'true' ? true : false
            remoteApi.setMobileAlarmSetting({
                MotionDetectionEnabled,
                HumanoidDetectionenable,
                HumanoidDetectiondrawRegion,
                FaceDetectionenable,
                FaceDetectiondrawRegion,
                MotionDetectionMdRecDuration,
                MotionDetectionMotionRecord,
                MessagePushEnabled,
                MotionDetectionSensitivityLevel,
                MotionDetectionMotionWarningTone,
            })
            break;
        case '2-5':
            console.log('保存2-5', remoteDeviceStore.deviceInfo.IPCam?.TfcardManager)
            let TimeRecordEnabled = remoteDeviceStore.deviceInfo.IPCam?.TfcardManager.TimeRecordEnabled|| false 
            let TFcardRecordScheduleArr = remoteDeviceStore.deviceInfo.IPCam?.TfcardManager.TFcard_recordSchedule|| [] 
            remoteApi.setTFcardRecordSchedule(TimeRecordEnabled, TFcardRecordScheduleArr)
            break;
        case '3':
            let selectTimeZone = document.querySelector('.selectTimeZone')
            let DaylightSavingTimetBtn = document.querySelector('.DaylightSavingTimetBtn')
            let selectSummerTime = document.querySelector('.selectSummerTime')
            let theDaylightSavingTimeEnabled = DaylightSavingTimetBtn.getAttribute('data-DaylightSavingTimeEnabled') == 'true' ? true : false
            config = getDeviceRemoteConfig('setSystemOperation')
            config.IPCam.SystemOperation.dateFormat = undefined
            config.IPCam.SystemOperation.TimeSync.TimeZone = Number(selectTimeZone.getAttribute('data-selectTimeZone')) * 100
            config.IPCam.SystemOperation.DaylightSavingTime.Enabled = theDaylightSavingTimeEnabled
            config.IPCam.SystemOperation.DaylightSavingTime.Country = theDaylightSavingTimeEnabled?selectSummerTime.value:remoteDeviceStore.deviceInfo.IPCam?.SystemOperation.DaylightSavingTime.Country
            config.Authorization.username = user
            config.Authorization.password = pwd
            console.log('config', config)
            isremoteing = true
            Player.RemoteSetting(devid, '', JSON.stringify(config))
            break;
        case '5-2':
            let modeSelectValue = document.querySelector('.modeSelect').value
            remoteApi.setVideoimage({
                IRCutFilterMode:modeSelectValue
            })
            break;
        // case value:
            
        //     break;
    
        default:
            break;
    }
    console.log('保存当前配置', container,containerKey)
}
// 去重启摄像头
function toRebootDeviceFunc() {
    // let devid = document.getElementById("dev_id").value;
    // let user = document.getElementById("user").value;
    // let pwd = document.getElementById("pwd").value;
    let loading = document.querySelector('.loading-view')
    // // let config = getDeviceRemoteConfig('rebootDevice')
    // let config = {
    //     "Version": "1.0.0",
    //     "Method": "set",
    //     "IPCam": {
    //         "SystemOperation": {
    //             "Reboot": true,
    //         }
    //     },
    //     "Authorization": {
    //         "Verify": '',
    //         "username": '',
    //         "password": ''
    //     }
    // }
    // config.Authorization.username = user
    // config.Authorization.password = pwd
    // console.log('config', config)
    // // isremoteing = true
    // loading.style.display = 'block'
    // setTimeout(() => {
    // }, 300);
    // Player.RemoteSetting(devid, '', JSON.stringify(config))
    // window.toRebootDevice()
    console.log('window', window)
    remoteApi.rebootDevice()
}
function toresetDeviceFunc(params) {
    remoteApi.resetDevice()
}
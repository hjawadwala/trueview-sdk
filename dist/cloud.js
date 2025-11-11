document.getElementById('searchCloudDate').value = new Date().toLocaleDateString()
let cloudService = null
let jessibucaPlayer = null
let m3u8url = ''
let m3u8TsList = [] 
function initJessibucaPlayer(){
    jessibucaPlayer = new JessibucaPro( {
      "container":document.getElementById('container'),
      "videoBuffer": 0.2,
      "videoBufferDelay": 1,
      "isResize": false,
      "loadingText": "loading",
      "debug": false,
      "debugLevel": "debug",
      "useMSE": false,
      "useSIMD": true,
      "useWCS": false,
      "showBandwidth": false,
      "showPerformance": false,
      "operateBtns": {
          "audio": true,
      },
      "timeout": 10000,
      "heartTimeoutReplayUseLastFrameShow": true,
      "audioEngine": "worklet",
      "forceNoOffscreen": true,
      "isNotMute": false,
      "heartTimeout": 10,
      "ptzZoomShow": true,
      "useCanvasRender": true,
      "useWebGPU": true,
      "supportHls265": true,
      "recordType": "webm"
  });
  jessibucaPlayer.on('loadM3U8End', (playlist) => {
      m3u8TsList.map((item,index) => {
          playlist.segments[index].url = item
      })
  })
}
initJessibucaPlayer()
function getCloudPlaybackDate(){
  let cloudPlaybackDate = new Date(document.getElementById('searchCloudDate').value)
  let year = cloudPlaybackDate.getFullYear()
  let month =  cloudPlaybackDate.getMonth()+1+''
  let day = ''+cloudPlaybackDate.getDate() + ''
  if(month.length < 2){
    month = '0' + month 
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return {  
    year,
    month,
    day
   }
}
function cloudSnapshot(){
  jessibucaPlayer.screenshot('test')
}
async function eseeLogin(){
  let user = document.getElementById('eseeUser').value
  let pwd = stringChangeMd5(document.getElementById('eseePwd').value) 
  let getCloudTmptokenRes = await userApi.getCloudTmptoken()
  let { nonce, request_id } = getCloudTmptokenRes.data
  let verify = stringChangeMd5(`${nonce.toUpperCase()}${user.toUpperCase()}${request_id.toUpperCase()}Japass^2>.j`)
  await userApi.login(user,pwd,request_id,verify)
  alert('Login Success')
}
async function searchCloudFile(){
  let deviceId = document.getElementById('dev_id').value
  let channel =  document.getElementById('channel').value
  let cloudPlaybackDate = getCloudPlaybackDate()
  let playbackDate = `${cloudPlaybackDate.year}/${cloudPlaybackDate.month}/${cloudPlaybackDate.day}`
  // 先请求临时凭证
  let getCloudTmptokenRes = await userApi.getCloudTmptoken()
  let { nonce, request_id } = getCloudTmptokenRes.data
  let verify = stringChangeMd5(`${nonce.toUpperCase()}${deviceId.toUpperCase()}${request_id.toUpperCase()}Japass^2>.j`)
  let res = await userApi.getDeviceService({ request_id, verify, eseeid: deviceId, channel, video_date: playbackDate });
  cloudService = res.data.list[0].channel[0]
  getCloudm3u8List(cloudService)
}
// 请求m3u8列表
async function getCloudm3u8List(service){
  let cloudPlaybackDate = getCloudPlaybackDate()
  let playbackDateStr = `${cloudPlaybackDate.year}${cloudPlaybackDate.month}${cloudPlaybackDate.day}`
  let deviceId = document.getElementById('dev_id').value
  var headCenter= `${service.Prefix}/${service.usr_id}/${deviceId}/0/${playbackDateStr}/index/${playbackDateStr}.index`
  var urlHead = `https://${service.Bucket}.${service.Endpoint.split("/")[2]}/${encodeURIComponent(headCenter)}`
  var beforeEncryption = `GET\n\n\n${Math.round(new Date().getTime()/1000+28800).toString()}\n/${service.Bucket}/${service.Prefix}/${service.usr_id}/${deviceId }/0/${playbackDateStr}/index/${playbackDateStr}.index?security-token=${service.SecurityToken}`
  const hmacDigest = CryptoJS.HmacSHA1(beforeEncryption, service.AccessKeySecret);
  const encryption = CryptoJS.enc.Base64.stringify(hmacDigest);
  let url = `${urlHead}?security-token=${encodeURIComponent(service.SecurityToken)}&OSSAccessKeyId=${service.AccessKeyId}&Expires=${Math.round(new Date().getTime() / 1000 + 28800).toString()}&Signature=${encodeURIComponent(encryption)}`
  let res  = await userApi.getContent(url)
  let regex = /{\s*[^{}]*\s*}/g;
  let m3u8List = res.data.match(regex).map(item=>JSON.parse(item));
  console.log('m3u8List', m3u8List);
  createCloudFileTable(m3u8List)
}
// 生成云存录像表格
function createCloudFileTable(m3u8List){
  const lang = document.getElementById("language").value
  var recListTable = document.getElementById("cloud_recListTable");
  for (var i = recListTable.rows.length - 1; i >= 1; i--) {
    recListTable.deleteRow(i);
  }
  m3u8List.map((item)=>{
    const newRow = recListTable.insertRow(1);
    const td_begin = newRow.insertCell(0);
    const td_times = newRow.insertCell(1);
    const td_type = newRow.insertCell(2);
    const td_download  = newRow.insertCell(3);
    const td_play  = newRow.insertCell(4);
    td_download.innerHTML = `<button onclick="downloadm3u8Video('${item.m3u8name}')">download</button>`
    td_play.innerHTML = `<button onclick="playCloudVideo('${item.m3u8name}')">play</button>`

    td_begin.innerText =formatStartTime(String( item.starttime))
    td_times.innerText = item.duration
    if(item.vedio_type == "T"){
      td_type.innerText = lang=="zh_CN" ? "日程录像" : "Schedule recording"
    }
    else{
      td_type.innerText = lang=="zh_CN" ? "报警录像" : "Alarm recording"
    }		
    // td_type.innerText = td_type.innerText + '-' + file_type
  })
}
function formatStartTime(timestamp) {
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`; 
}
async function getm3uUrl(m3u8name) {
    // 根据m3u8name拼接得到m3u8url
    let urlHead  = `https://${cloudService.Bucket}.${cloudService.Endpoint.split("/")[2]}/${encodeURIComponent(m3u8name)}`
    let encryption = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(`GET\n\n\n${Math.round(new Date().getTime()/1000+28800).toString()}\n/${cloudService.Bucket}/${m3u8name}?security-token=${cloudService.SecurityToken}`,cloudService.AccessKeySecret))
    m3u8url = `${urlHead}?security-token=${encodeURIComponent(cloudService.SecurityToken)}&OSSAccessKeyId=${cloudService.AccessKeyId}&Expires=${Math.round(new Date().getTime()/1000+28800).toString()}&Signature=${encodeURIComponent(encryption)}`
    // 获取m3u8内容
    let res = await userApi.getContent(m3u8url) 
    getm3u8TsList(res.data)
}
// 加签ts地址
function getm3u8TsList(m3u8Str){
  m3u8TsList = []
  var tsArr = m3u8Str.toString().match(/ht[^\s].+ts/g)
  tsArr.forEach(item => {
   let url = item +`?security-token=${encodeURIComponent(cloudService.SecurityToken)}&OSSAccessKeyId=${cloudService.AccessKeyId}&Expires=${Math.round(new Date().getTime()/1000+28800).toString()}&Signature=${encodeURIComponent(
    CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(`GET\n\n\n${Math.round(new Date().getTime()/1000+28800).toString()}\n/${cloudService.Bucket}/${item.split('com/')[1]}?security-token=${cloudService.SecurityToken}`, cloudService.AccessKeySecret))
    )}`
    m3u8TsList.push(url)
  });
  console.log('m3u8TsList',m3u8TsList);
}
async function playCloudVideo(m3u8name){
  await getm3uUrl(m3u8name)
  await jessibucaPlayer.destroy()
  initJessibucaPlayer()
  jessibucaPlayer.play(m3u8url)
}
async function stopPlayCloudVideo(){
  await jessibucaPlayer.destroy()
  initJessibucaPlayer()
}
async function downloadm3u8Video(m3u8name){
  document.getElementById('cloudVideoDownloadTip').innerText ='downloading...'
  await getm3uUrl(m3u8name)
  downloadTSFiles(m3u8TsList)
}
async function downloadTSFiles(tsUrls) {
  try {
    const responses = await Promise.all(tsUrls.map(async url => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return response.arrayBuffer();
    }));
    blob = new Blob(
      responses,
      { type: 'video/MP2T' }
    )
    // 创建一个 Blob URL
    const downloadUrl = URL.createObjectURL(blob);
    console.log('downloadblob',blob);
    const a = document.createElement('a')
    a.href = downloadUrl
    a.target = '_blank'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.download = 'test.ts'
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
    document.body.removeChild(a)
    document.getElementById('cloudVideoDownloadTip').innerText ='download success'
  } catch (error) {
    console.error('Error downloading files:', error);
  }
}
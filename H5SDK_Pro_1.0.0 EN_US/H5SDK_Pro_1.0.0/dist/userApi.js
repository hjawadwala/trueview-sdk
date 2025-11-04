/*
 * @Author: wujiantao leftstan@qq.com
 * @Date: 2024-07-26 16:16:29
 * @LastEditors: wzk 1178743535@qq.com
 * @LastEditTime: 2024-08-06 15:41:08
 * @FilePath: \h5-sdk-player\public\userApi.js
 */
const appBound = "om9Adm4SojoVcz4Pdj0Ncz0T"
let userApi = {}
let access_token =''
userApi.checkCommonUpdate = function(checkList) {
    for (let i = 0; i < checkList.length; i++) {
        checkList[i].appBound = appBound
    }
    return axios({
        method: 'POST',
        url: `https://update.dvr163.com/XVR/common/checkCommonUpdate_v3.php`,
        data: JSON.stringify(checkList),
        headers: {
            "Content-Type": "application/json"
        },
    })
}
userApi.getCloudTmptoken =function() {
  return axios({
    url: 'https://openapi.dvr163.com/message/nonce?method=get',
    method: 'get', 
  })
}
userApi.login = function(user,password,request_id,verify) {
  let data = {
    user,
    password,
    request_id,
    verify,
    app_bundle:appBound
  }
  return axios({
    method: 'POST',
    url: `https://openapi.dvr163.com:440/user/user?method=login_v2`,
    data:data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // 设置Content-Type
    }
  }).then((res)=>{
    access_token = res.data.access_token
  })
}
userApi.getDeviceService = function({request_id,verify,eseeid,channel,video_date}){
  let data = {
      request_id,
      verify,
      access_token,
      eseeid,
      channel,
      video_date
  }
  let formData = new FormData()
  console.log();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return axios({
      noLoading:true,
      url: 'https://openapi.dvr163.com/cloud/tmptoken?method=gettoken',
      method: 'post',
      data:formData,
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
  })
}
userApi.getContent = function(signedUrl){
  return axios({
    url: signedUrl,
    method: 'get',
  })
}
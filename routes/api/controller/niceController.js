import path from "path";
import exec from "child_process";
import querystring from "querystring";
import pgInfo from "../../../config/pginfo.js";

const __dirname = path.resolve();

async function createSecretKey(req, res, next) {
  const { returnUrl } = req.query;

  const niceInfo = pgInfo.nice;
  const moduleName = "CPClient_linux_x64";
  const modulePath = path.join(__dirname, "/middleware", "/nice", "/", moduleName);
  const sSiteCode = niceInfo.siteCode;
  const sSitePW = niceInfo.sitePW;
  const date = new Date();

  const sCPRequest = `${sSiteCode}_${date.getTime()}`;
  console.log(returnUrl);
  let sEncData = "";
  let sAuthType = "M";
  let sCustomize = "";
  let sReturnUrl = returnUrl;
  let sErrorUrl = returnUrl;
  let sRtnMSG = "";
  let sPlainData =
    `7:REQ_SEQ${sCPRequest.length}:${sCPRequest}` +
    `8:SITECODE${sSiteCode.length}:${sSiteCode}` +
    `9:AUTH_TYPE${sAuthType.length}:${sAuthType}` +
    `7:RTN_URL${sReturnUrl.length}:${sReturnUrl}` +
    `7:ERR_URL${sErrorUrl.length}:${sErrorUrl}` +
    `9:CUSTOMIZE${sCustomize.length}:${sCustomize}`;

  const cmd = `${modulePath} ENC ${sPlainData} ${sSiteCode} ${sSitePW}`;
  console.warn(cmd);

  let child = exec.exec(cmd, { encoding: "euc-kr" });
  child.stdout.on("data", function (data) {
    sEncData += data;
  });

  console.log(sEncData);
  child.on("close", function () {
    //처리 결과 확인
    if (sEncData == "-1") {
      sRtnMSG = "암/복호화 시스템 오류입니다.";
    } else if (sEncData == "-2") {
      sRtnMSG = "암호화 처리 오류입니다.";
    } else if (sEncData == "-3") {
      sRtnMSG = "암호화 데이터 오류 입니다.";
    } else if (sEncData == "-9") {
      sRtnMSG = "입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.";
    } else {
      sRtnMSG = "";
    }

    if (sRtnMSG) {
      console.error(sRtnMSG);

      res.status(500).json({
        message: sRtnMSG,
      });
    } else {
      res.status(200).json({
        message: "success",
        sEncData,
      });
    }
  });
}

async function decryptData(req, res, next) {
  const method = req.method;
  const sEncData = method === "GET" ? req.query.EncodeData : req.body.EncodeData;
  const redirectUrl = method === "GET" ? req.query.EncodeData : req.body.EncodeData;

  const niceInfo = pgInfo.nice;
  const moduleName = "CPClient_linux_x64";
  const modulePath = path.join(__dirname, "/middleware", "/nice", "/", moduleName);
  const sSiteCode = niceInfo.siteCode;
  const sSitePW = niceInfo.sitePW;

  let cmd = "";
  let responseData = {};

  if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
    responseData.msg = "입력값 오류";
  }

  if (sEncData != "") {
    cmd = `${modulePath} DEC ${sSiteCode} ${sSitePW} ${sEncData}`;
  }

  let sDecData = "";

  const child = exec.exec(cmd, { encoding: "euc-kr" });
  child.stdout.on("data", function (data) {
    sDecData += data;
  });

  child.on("close", function () {
    //처리 결과 확인
    if (sDecData == "-1") {
      responseData.msg = "암/복호화 시스템 오류";
    } else if (sDecData == "-4") {
      responseData.msg = "복호화 처리 오류";
    } else if (sDecData == "-5") {
      responseData.msg = "HASH값 불일치 - 복호화 데이터는 리턴됨";
    } else if (sDecData == "-6") {
      responseData.msg = "복호화 데이터 오류";
    } else if (sDecData == "-9") {
      responseData.msg = "입력값 오류";
    } else if (sDecData == "-12") {
      responseData.msg = "사이트 비밀번호 오류";
    } else {
      /* 인증 성공 -> 인증 결과 파싱 */
      var requestnumber = decodeURIComponent(parseNiceData(sDecData, "REQ_SEQ")); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
      var responsenumber = decodeURIComponent(parseNiceData(sDecData, "RES_SEQ")); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
      var authtype = decodeURIComponent(parseNiceData(sDecData, "AUTH_TYPE")); //인증수단
      var name = decodeURIComponent(parseNiceData(sDecData, "UTF8_NAME")); //이름
      var birthdate = decodeURIComponent(parseNiceData(sDecData, "BIRTHDATE")); //생년월일(YYYYMMDD)
      var gender = decodeURIComponent(parseNiceData(sDecData, "GENDER")); //성별
      var nationalinfo = decodeURIComponent(parseNiceData(sDecData, "NATIONALINFO")); //내.외국인정보
      var dupinfo = decodeURIComponent(parseNiceData(sDecData, "DI")); //중복가입값(64byte)
      var conninfo = decodeURIComponent(parseNiceData(sDecData, "CI")); //연계정보 확인값(88byte)
      var mobileno = decodeURIComponent(parseNiceData(sDecData, "MOBILE_NO")); //휴대폰번호(계약된 경우)
      var mobileco = decodeURIComponent(parseNiceData(sDecData, "MOBILE_CO")); //통신사(계약된 경우)

      responseData.requestnumber = requestnumber;
      responseData.responsenumber = responsenumber;
      responseData.authtype = authtype;
      responseData.name = name;
      responseData.birthdate = birthdate;
      responseData.gender = gender;
      responseData.nationalinfo = nationalinfo;
      responseData.dupinfo = dupinfo;
      responseData.conninfo = conninfo;
      responseData.mobileno = mobileno;
      responseData.mobileco = mobileco;

      res.redirect(`${redirectUrl}?${querystring.stringify(responseData)}`);
    }
  });
}

//결과 데이터 파싱 함수
function parseNiceData(plaindata, key) {
  let arrData = plaindata.split(":");
  let value = "";
  for (let i in arrData) {
    let item = arrData[i];
    if (item.indexOf(key) == 0) {
      let valLen = parseInt(item.replace(key, ""));
      arrData[i++];
      value = arrData[i].substr(0, valLen);
      break;
    }
  }
  return value;
}
export { createSecretKey, decryptData };

import md5 from "md5";
import sunmiEnv from "./sunmiEnv";
import Des from "./Des";

const { MD5_KEY, IS_ENCRYPTED } = sunmiEnv({
  dev: {
    MD5_KEY: "Woyouxinxi666",
    IS_ENCRYPTED: 0
  },
  test: {
    MD5_KEY: "Woyouxinxi666",
    IS_ENCRYPTED: 0
  },
  uat: {
    MD5_KEY: "Jihewobox15",
    IS_ENCRYPTED: 0
  },
  release: {
    MD5_KEY: "Jihewobox15",
    IS_ENCRYPTED: 1
  }
});

export const signEncode = (form: any) => {
  const key = MD5_KEY;
  const { params, timeStamp, randomNum } = form;
  // console.log("MD5_KEY", MD5_KEY);
  // console.log(md5(key));
  const sign = md5(params + IS_ENCRYPTED + timeStamp + randomNum + md5(key));
  // console.log("sign", sign);
  return sign;
};

export const paramsEncode = (params: object) => {
  const paramsString = JSON.stringify(params);
  if (IS_ENCRYPTED) {
    return Des.encrypt(paramsString);
  }
  return paramsString;
};

interface NormalizedParams {
  timeStamp: number;
  randomNum: number;
  isEncrypted: 0 | 1;
  params: string;
  sign: string;
  lang: string;
  file: File;
  debug_key: string;
}

export default function normalizeParams(params: any) {
  const formData: Partial<NormalizedParams> = {};
  formData.timeStamp = Math.floor(new Date().getTime() / 1000);
  formData.randomNum = Math.floor(Math.random() * 1000000);
  formData.isEncrypted = IS_ENCRYPTED;
  if (params.file) {
    formData.file = params.file;
    delete params.file;
  }
  // console.log("params", params);
  formData.params = paramsEncode(params);
  // formData.debug_key = "QSZ1%2FQb7%2B18xZlHSBSSD3xbZCCKoK";
  // console.log("encodedParams", formData.params);
  formData.sign = signEncode(formData);
  formData.lang = "zh";
  return formData;
}

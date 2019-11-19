import md5 from "md5";
import env from "./env";
import Des from "./Des";

const { MD5_KEY, IS_ENCRYPTED } = env({
  dev: {
    MD5_KEY: "Woyouxinxi666",
    IS_ENCRYPTED: 0
  },
  test: {
    MD5_KEY: "5a899a41f4fdad2eea546038aa6daf1b",
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
  const orderly = Object.keys(form).sort();
  orderly.push("key");
  form.key = MD5_KEY;
  let sign = "";
  orderly.map((_d: string, index: number) => {
    sign += `${_d}=${form[_d]}${index !== orderly.length - 1 ? "&" : ""}`;
  });
  const md5_sign = md5(sign).toUpperCase();
  return md5_sign;
};

export const paramEncode = (param: object) => {
  const paramString = JSON.stringify(param);
  if (IS_ENCRYPTED) {
    return Des.encrypt(paramString);
  }
  return paramString;
};

interface NormalizedParams {
  timestamp: number;
  // isEncrypted: 0 | 1;
  param: string;
  sign: string;
  file: File;
  // debug_key: string;
  version: string;
  format: string;
  model: string;
  action: string;
}

export default function normalizeParams(param: any) {
  const formData: Partial<NormalizedParams> = {};
  formData.timestamp = Math.floor(new Date().getTime() / 1000);
  formData.version = "CV1";
  formData.format = "json";
  // formData.isEncrypted = IS_ENCRYPTED;
  if (param.file) {
    formData.file = param.file;
    delete param.file;
  }
  // console.log("param", param);
  formData.param = paramEncode(param);
  formData.model = param.model;
  formData.action = param.action;
  // formData.debug_key = "QSZ1%2FQb7%2B18xZlHSBSSD3xbZCCKoK";
  return formData;
}

import Taro from "@tarojs/taro";
import createHttpUtil from "@/shared/httpUtil";
import normalizeParams from "./normalizeParams";
import env from "./env";

const path = Taro.getEnv() === "ALIPAY" ? "/ali/conv" : "/wechat/conv";
export const host = env({
  dev: "",
  test: `https://hytest.hycas.com${path}`,
  uat: "",
  release: ""
});

const http = createHttpUtil({
  host,
  normalizeParams
});

export default http;

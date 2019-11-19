import createHttpUtil from "@/shared/httpUtil";
import normalizeParams from "./normalizeParams";
import env from "./env";

export const host = env({
  // dev: "http://10.10.160.73:45502",
  dev: "https://dev.webapi.sunmi.com/webapi/businesslink",
  test: "http://hytest1.hycas.com/wechat/conv",
  uat: "https://uat.webapi.sunmi.com/webapi/businesslink",
  release: "https://webapi.sunmi.com/webapi/businesslink"
});

const http = createHttpUtil({
  host,
  normalizeParams
});

export default http;

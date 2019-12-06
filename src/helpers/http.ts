import createHttpUtil from "@/shared/httpUtil";
import normalizeParams from "./normalizeParams";
import env from "./env";

export const host = env({
  dev: "",
  test: "https://hytest.hycas.com/wechat/conv",
  uat: "",
  release: ""
});

const http = createHttpUtil({
  host,
  normalizeParams
});

export default http;

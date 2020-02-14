import Taro from "@tarojs/taro";
import ERROR_MAP from "@/constants/ERROR_MAP";
import logger from "./logger";
import { signEncode } from "@/helpers/normalizeParams";
import FetchError from "./FetchError";
import normalizeWxResponse from "./normalizeWxResponse";

const overdueCode = [4003, 4004]; // 4004过期code, 4003验证错误

const defaultHttpUtilOption = {
  host: "",
  catchedCode: Object.keys(ERROR_MAP).map(Number),
  onError: error => logger.error(error),
  resolveFullURL: ({ host, api, method }) => {
    logger.info(method);
    return `${host}`;
  },
  normalizeParams: (params: object) => {
    logger.info(params);
    return {};
  }
};

type createHttpHelperOption = Partial<typeof defaultHttpUtilOption>;

export default function createHttpUtil(createOption: createHttpHelperOption) {
  const { host, catchedCode, resolveFullURL, normalizeParams } = {
    ...defaultHttpUtilOption,
    ...createOption
  };
  const fetch = async (api, opt) => {
    const token = Taro.getStorageSync("token");
    const fullUrl = resolveFullURL({ host, api, method: opt.method });
    const data = normalizeParams({
      ...opt.body
    });
    logger.info(`[ ${opt.method} ] ${fullUrl} fetching...`);
    const result = await Taro.request({
      url: fullUrl,
      method: opt.method,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token
      },
      data: { ...data, ...api, sign: signEncode({ ...data, ...api }) }
    });

    const res = normalizeWxResponse(result);
    console.log("11=");
    if (res.statusCode !== 0 || catchedCode.includes(res.statusCode)) {
      if (overdueCode.includes(res.statusCode)) {
        Taro.hideLoading();
        Taro.showModal({
          title: "提示",
          showCancel: false,
          content: "你的身份已失效，请重新登录",
          confirmText: "重新登录",
          success: () => {
            Taro.setStorageSync("token", "");
            Taro.setStorageSync("phone", "");
            Taro.setStorageSync("color", "");
            Taro.setStorageSync("headimgurl", "");
            Taro.setStorageSync("headimgurl", "");
            Taro.setStorageSync("headimgurl", "");
            Taro.reLaunch({ url: "/pages/index/index" });
          }
        });
        return;
      }
      if (catchedCode.includes(res.statusCode)) {
        Taro.showToast({ icon: "none", title: ERROR_MAP[res.statusCode] });
        return Promise.reject();
      } else {
        if (res.errMsg === "没有开启签到活动!") {
          return Promise.reject(res);
        }
        if (api.action === "getphone" && api.model === "alilogin") {
          return Promise.reject(res);
        }
        Taro.showToast({ icon: "none", title: res.errMsg });
        return Promise.reject(res);
      }
    }
    logger.info(`[ ${opt.method} ] ${fullUrl} fetched`, result);
    Taro.hideLoading();
    return res.data;
  };
  return {
    get: (api, body?) => fetch(api, { method: "GET", body }),
    post: (api, body?) => fetch(api, { method: "POST", body }),
    put: (api, body?) => fetch(api, { method: "PUT", body }),
    delete: (api, body?) => fetch(api, { method: "DELETE", body })
  };
}

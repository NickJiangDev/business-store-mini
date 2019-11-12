import Taro from "@tarojs/taro";
import ERROR_MAP from "@/constants/ERROR_MAP";
import logger from "./logger";
import FetchError from "./FetchError";
import normalizeWxResponse from "./normalizeWxResponse";

const defaultHttpUtilOption = {
  host: "",
  catchedCode: Object.keys(ERROR_MAP).map(Number),
  onError: error => logger.error(error),
  resolveFullURL: ({ host, api, method }) => {
    logger.info(method);
    return `${host}${api}`;
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
      data
    });
    const res = normalizeWxResponse(result);
    if (res.statusCode !== 1 || catchedCode.includes(res.statusCode)) {
      if (res.statusCode === 999) {
        const { confirm } = await Taro.showModal({
          title: "提示",
          showCancel: false,
          content: "你的身份已失效，请重新登录",
          confirmText: "重新登录"
        });
        if (confirm) {
          Taro.setStorageSync("token", "");
          Taro.reLaunch({ url: "/pages/login/index" });
        }
        return;
      }
      if (catchedCode.includes(res.statusCode)) {
        Taro.showToast({ icon: "none", title: ERROR_MAP[res.statusCode] });
      } else {
        Taro.showToast({ icon: "none", title: res.errMsg });
        throw new FetchError(res.statusCode, res.errMsg);
      }
    }
    logger.info(`[ ${opt.method} ] ${fullUrl} fetched`, result);
    return res.data;
  };
  return {
    get: (api, body?) => fetch(api, { method: "GET", body }),
    post: (api, body?) => fetch(api, { method: "POST", body }),
    put: (api, body?) => fetch(api, { method: "PUT", body }),
    delete: (api, body?) => fetch(api, { method: "DELETE", body })
  };
}
import http from "@/helpers/http";
import Taro from "@tarojs/taro";

interface ILoginParams {
  jscode: string;
}
/**
 * 登录授权
 * @param {ILoginParams} params
 * @returns
 */
function getLogin(params: ILoginParams) {
  return http.post(
    { model: "login", action: "getopenid" },
    {
      appid: "wx6b335ca80d60df42",
      ...params
    }
  );
}

interface IUnionParams {
  openid: string;
  iv: string;
  encrypteddata: string;
}
/**
 * 获取unionId
 * @param {IUnionParams} params
 * @returns
 */
function getUnionId(params: IUnionParams) {
  return http.post({ model: "login", action: "getunionid" }, params);
}

export { getLogin, getUnionId };

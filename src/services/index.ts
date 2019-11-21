import http from "@/helpers/http";

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

/**
 * 获取注册协议
 * @returns
 */
function getLoginAgreement() {
  return http.post({ model: "sys", action: "regstatement" });
}

interface IShopParams {
  pagesize: number;
  pageindex: number;
  latitude?: number;
  longitude?: number;
  keywords?: string;
}
/**
 * 获取附近门店
 * @param {IShopParams} params
 * @returns
 */
function getShop(params: IShopParams) {
  return http.post({ model: "sys", action: "nearstore" }, params);
}

interface ISelectParams {
  shopcode: string;
}
/**
 * 关注门店
 * @param {ISelectParams} params
 * @returns
 */
function selectShop(params: ISelectParams) {
  return http.post({ model: "sys", action: "selectstore" }, params);
}

interface IFindcardParams {
  shopcode: string;
}
/**
 * 关注门店
 * @param {IFindcardParams} params
 * @returns
 */
function findCard(params: IFindcardParams) {
  return http.post({ model: "sys", action: "verifymemband" }, params);
}
export {
  getLogin,
  getUnionId,
  getLoginAgreement,
  getShop,
  selectShop,
  findCard
};

import http from "@/helpers/http";

// --------------------- 支付宝接口 -----------------------

interface IAliLoginParams {
  jscode: string;
}
/*
 * 支付宝登录授权
 * @param {ILoginParams} params
 * @returns
 */
function getAliLogin(params: IAliLoginParams) {
  return http.post({ model: "alilogin", action: "getalitoken" }, params);
}

interface IAliGetPhoneParams {
  encrypteddata: any;
}
/*
 * 支付宝手机号授权
 * @param {IAliGetPhoneParams} params
 * @returns
 */
function getAliPhone(params: IAliGetPhoneParams) {
  return http.post({ model: "alilogin", action: "getphone" }, params);
}

// --------------------- 微信接口 -----------------------
/*
 * 获取首页参数
 * @returns
 */
function getHome() {
  return http.post({ model: "sys", action: "index" });
}

interface ILoginParams {
  jscode: string;
}
/*
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

interface IPhoneParams {
  openid: string;
  iv: string;
  encrypteddata: string;
  cloudid: string;
}
/*
 * 手机号授权
 * @param {IPhoneParams} params
 * @returns
 */
function getPhone(params: IPhoneParams) {
  return http.post({ model: "login", action: "getphone" }, params);
}

interface IUnionParams {
  openid: string;
  iv: string;
  encrypteddata: string;
}
/*
 * 获取unionId
 * @param {IUnionParams} params
 * @returns
 */
function getUnionId(params: IUnionParams) {
  return http.post({ model: "login", action: "getunionid" }, params);
}

/*
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
/*
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
/*
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
/*
 * 关注门店
 * @param {IFindcardParams} params
 * @returns
 */
function findCard(params: IFindcardParams) {
  return http.post({ model: "mem", action: "verifymemband" }, params);
}

interface ICardParams {
  cardid: string;
}
/*
 * 查询会员卡面配置参数
 * @param {ICardParams} params
 * @returns
 */
function getCardInfo(params: ICardParams) {
  return http.post({ model: "mem", action: "cardsurface" }, params);
}

interface ICustomNumParams {
  cardno: string;
  paycode: string;
}
/*
 * 储值消费码
 * @param {ICustomNumParams} params
 * @returns
 */
function getCustomNum(params: ICustomNumParams) {
  return http.post({ model: "mem", action: "generpaycode" }, params);
}

interface ICardInfoParams {
  cardno: string;
}
/*
 * 查询会员信息
 * @param {ICardInfoParams} params
 * @returns
 */
function getCardData(params: ICardInfoParams) {
  return http.post({ model: "mem", action: "querymeminfo" }, params);
}

interface IOrderInfoParams {
  coupontype: number;
  pageindex: number;
  pagesize: number;
}
/*
 * 我的券
 * @param {IOrderInfoParams} params
 * @returns
 */
function getOrderApi(params: IOrderInfoParams) {
  return http.post({ model: "mem", action: "myconpons" }, params);
}

interface ICalendarRoleParams {
  cardno: string;
}
/*
 * 签到规则
 * @param {ICalendarRoleParams} params
 * @returns
 */
function getCalendarRoleApi(params: ICalendarRoleParams) {
  return http.post({ model: "mem", action: "signinfo" }, params);
}

interface ISignParams {
  cardno: string;
}
/*
 * 签到
 * @param {ISignParams} params
 * @returns
 */
function signApi(params: ISignParams) {
  return http.post({ model: "mem", action: "sign" }, params);
}

/*
 * 积分规则
 * @returns
 */
function getPointApi() {
  return http.post({ model: "mem", action: "pointexchangeinfo" });
}

interface IBindParams {
  mobile: string;
  cardno: string;
}
/*
 * 绑定会员卡
 * @param {IBindParams} params
 * @returns
 */
function bindCardApi(params: IBindParams) {
  return http.post({ model: "mem", action: "bindcard" }, params);
}

interface ICenterParams {
  pagesize: number;
  pageindex: number;
}
/*
 * 领劵中心
 * @param {ICenterParams} params
 * @returns
 */
function getCenterList(params: ICenterParams) {
  return http.post({ model: "mem", action: "couponclaim" }, params);
}

interface IExchangeParams {}
/*
 * 积分储值兑换
 * @param {IExchangeParams} params
 * @returns
 */
function exchangePointApi(params: IExchangeParams) {
  return http.post({ model: "mem", action: "pointexchange" }, params);
}

interface IgetTicketParams {
  billno: string;
}

/*
 * 领劵
 * @param {IgetTicketParams} params
 * @returns
 */
function getTicketApi(params: IgetTicketParams) {
  return http.post({ model: "mem", action: "drawcoupon" }, params);
}

interface IGetDateParams {
  year: string;
  month: string;
}

/*
 * 获取签到时间
 * @param {IgetTicketParams} params
 * @returns
 */
function getDateApi(params: IGetDateParams) {
  return http.post({ model: "mem", action: "getsigndays" }, params);
}

interface IPayConfigParams {
  cardno: string;
}
/*
 * 充值config
 * @param {IPayConfigParams} params
 * @returns
 */
function payConfigApi(params: IPayConfigParams) {
  return http.post({ model: "mem", action: "rechargeinfo" }, params);
}

interface IPayParams {
  cardno: string;
  rechargemoney: string;
}
/*
 * 充值
 * @param {IPayParams} params
 * @returns
 */
function payApi(params: IPayParams) {
  return http.post({ model: "mem", action: "recharge" }, params);
}

export {
  getHome,
  getLogin,
  getPhone,
  getUnionId,
  getLoginAgreement,
  getCalendarRoleApi,
  getShop,
  selectShop,
  findCard,
  getCardInfo,
  getCustomNum,
  getCardData,
  getOrderApi,
  signApi,
  getPointApi,
  getCenterList,
  bindCardApi,
  exchangePointApi,
  getTicketApi,
  getDateApi,
  payConfigApi,
  payApi,
  getAliLogin,
  getAliPhone
};

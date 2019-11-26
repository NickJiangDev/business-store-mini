import Taro from "@tarojs/taro";

export const getPhoneHandler = () => {
  const phone = Taro.getStorageSync("phone");
  if (phone) {
    return phone;
  }
  // 非法，直接清除缓存重新登录
  Taro.setStorageSync("token", "");
  Taro.setStorageSync("phone", "");
  Taro.reLaunch({ url: "/pages/index/index" });
};

export default getPhoneHandler;

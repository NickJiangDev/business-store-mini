import Taro from "@tarojs/taro";

export const redirectToLogin = () => {
  Taro.redirectTo({
    url: "/pages/login/index?fallback=/pages/customers/index"
  });
};

export default {};

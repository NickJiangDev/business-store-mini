import Taro from "@tarojs/taro";

export const redirectToLogin = () => {
  Taro.redirectTo({
    url: "/pages/index/index"
  });
};

export default {};

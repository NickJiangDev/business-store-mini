import Taro, { useState } from "@tarojs/taro";
import { AtButton } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getLogin, getUnionId, findCard, getPhone } from "@/services/index";
import findHandler from "@/helpers/findHandler";

const LoginButton = () => {
  // 登录授权回调
  const [{ loading }, fetchLogin] = useAsyncFn<any>(getLogin);
  const [{ loading: unionIdLoading }, fetchUnionId] = useAsyncFn<any>(
    getUnionId
  );
  const [{ loading: findCardLoading }, fetchFindCardApi] = useAsyncFn<any>(
    findCard
  );
  const [{ loading: getPhoneLoading }, fetchGetPhone] = useAsyncFn<any>(
    getPhone
  );

  const [loginInfo, setLoginInfo] = useState({ openid: "", accesstoken: "" });
  const [isLogin, setIsLogin] = useState(false);
  const setUserInfo = (res: any) => {
    const { encryptedData, iv, cloudID } = res.detail;
    if (encryptedData && iv && cloudID) {
      // 成功
      Taro.login({
        async success(res) {
          try {
            if (res.code) {
              const { openid } = await fetchLogin({ jscode: res.code });
              const { accesstoken } = await fetchUnionId({
                openid,
                encrypteddata: encryptedData,
                iv
              });

              setLoginInfo({ accesstoken, openid });
              setIsLogin(true);
              Taro.showToast({ icon: "none", title: "登录成功，请继续登录" });
            } else {
              console.log("登录失败！" + res.errMsg);
            }
          } catch (error) {}
        }
      });
    } else {
      // 拒绝
      Taro.showToast({ icon: "none", title: "拒绝" });
    }
  };

  const numberLogin = async (res: any) => {
    try {
      const { encryptedData, iv, cloudID } = res.detail;
      if (encryptedData && iv && cloudID) {
        const { purephonenumber } = await fetchGetPhone({
          openid: loginInfo.openid,
          encrypteddata: encryptedData,
          iv,
          cloudid: cloudID
        });
        successHandler(loginInfo.accesstoken, purephonenumber);
      }
    } catch (error) {}
  };

  const successHandler = async (token: string, phone: string) => {
    Taro.setStorageSync("token", token);
    Taro.setStorageSync("phone", phone);

    const cardData = await fetchFindCardApi({
      mobile: phone
    });
    findHandler(cardData);
  };

  const commonParams = !isLogin
    ? {
        onGetUserInfo: setUserInfo
      }
    : {
        onGetPhoneNumber: numberLogin
      };
  return (
    <AtButton
      type="primary"
      loading={loading || unionIdLoading || findCardLoading || getPhoneLoading}
      openType={isLogin ? "getPhoneNumber" : "getUserInfo"}
      {...commonParams}
    >
      授权获取用户信息
    </AtButton>
    // <AtButton
    //   className="index"
    //   type="primary"

    // >
    //   微信手机授权登录
    // </AtButton>
  );
};

export default LoginButton;

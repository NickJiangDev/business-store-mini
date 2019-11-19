import Taro from "@tarojs/taro";
import { AtButton } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getLogin, getUnionId } from "@/services/index";

const LoginButton = () => {
  // 登录授权回调
  const [{ loading }, fetchLogin] = useAsyncFn<any>(getLogin);
  const [{ loading: unionIdLoading }, fetchUnionId] = useAsyncFn<any>(
    getUnionId
  );
  const setUserInfo = (res: any) => {
    const { encryptedData, iv } = res.detail;
    const userInfo = res.detail.userInfo;
    if (userInfo) {
      // 成功
      Taro.login({
        async success(res) {
          if (res.code) {
            const { openid } = await fetchLogin({ jscode: res.code });
            const { unionid } = await fetchUnionId({
              openid,
              encrypteddata: encryptedData,
              iv
            });
            Taro.setStorageSync("userInfo", userInfo);
            Taro.setStorageSync("openid", openid);
            Taro.setStorageSync("unionid", unionid);
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    } else {
      // 拒绝
      Taro.showToast({ icon: "none", title: "拒绝" });
    }
  };
  return (
    <AtButton
      type="primary"
      loading={loading || unionIdLoading}
      openType="getUserInfo"
      onGetUserInfo={setUserInfo}
    >
      授权获取用户信息
    </AtButton>
    // <AtButton
    //   className="index"
    //   type="primary"
    //   openType="getPhoneNumber"
    //   onGetPhoneNumber={this.numberLogin}
    // >
    //   微信手机授权登录
    // </AtButton>
  );
};

export default LoginButton;

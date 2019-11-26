import Taro from "@tarojs/taro";
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
  const [, fetchFindCardApi] = useAsyncFn<any>(findCard);
  // const [, fetchGetPhone] = useAsyncFn<any>(getPhone);
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
              // const { purephonenumber } = await fetchGetPhone({
              //   openid,
              //   encrypteddata: encryptedData,
              //   iv,
              //   cloudid: cloudID
              // });
              successHandler(accesstoken, "15641706680");
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

  const successHandler = async (token: string, phone: string) => {
    Taro.setStorageSync("token", token);
    Taro.setStorageSync("phone", phone);

    const cardData = await fetchFindCardApi({
      mobile: phone
    });
    findHandler(cardData);
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

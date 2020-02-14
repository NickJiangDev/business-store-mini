import { Button } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getAliLogin, getAliPhone, findCard } from "@/services/index";
import Taro, { useState } from "@tarojs/taro";
import findHandler from "@/helpers/findHandler";

function LoginButton() {
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState("");
  const [phoneParams, setPhoneParams] = useState({});
  const [{ loading }, fetchLogin] = useAsyncFn<any>(getAliLogin);
  const [{ loading: getPhoneLoading }, fetchGetPhone] = useAsyncFn<any>(
    getAliPhone
  );
  const [{ loading: findCardLoading }, fetchFindCardApi] = useAsyncFn<any>(
    findCard
  );

  const getPhoneNumber = () => {
    my.getPhoneNumber({
      success: (response: any) => {
        const encryptedData = response.response;
        fetchGetPhone({
          encrypteddata: encryptedData,
          ...phoneParams
        }).then((phoneRes: any) => {
          successHandler(token, phoneRes.mobile);
        });
      },
      fail: (response: any) => {}
    });
  };

  const onGetAuthorize = async () => {
    my.getOpenUserInfo({
      success: (user: any) => {
        const userInfo = JSON.parse(user.response).response;
        // token授权以及用户信息(https://opendocs.alipay.com/mini/introduce/twn8vq)
        my.getAuthCode({
          scopes: ["auth_user"],
          success: (res: any) => {
            try {
              const authCode = res.authCode;
              fetchLogin({
                authcode: authCode
              }).then((response: any) => {
                const { accesstoken, aliuid } = response;
                setIsLogin(true);
                setToken(accesstoken);
                setPhoneParams({
                  aliuserid: aliuid,
                  userinfo: JSON.stringify(userInfo)
                });
                Taro.showToast({ icon: "none", title: "登录成功，请继续登录" });
                Taro.setStorageSync("token", accesstoken);
                Taro.setStorageSync("phone", "17521524019");
              });
            } catch (error) {}
          }
        });
      }
    });
  };

  const successHandler = async (accessToken: string, phone: string) => {
    if (accessToken && phone) {
      Taro.setStorageSync("token", accessToken);
      Taro.setStorageSync("phone", phone);

      const cardData = await fetchFindCardApi({
        mobile: phone
      });
      findHandler(cardData);
    }
  };

  return (
    <Button
      onClick={isLogin ? getPhoneNumber : onGetAuthorize}
      scope={isLogin ? "phoneNumber" : "userInfo"}
      type="primary"
      loading={loading || getPhoneLoading || findCardLoading}
      open-type="getAuthorize"
      onGetAuthorize="onGetAuthorize"
      onError="onAuthError"
    >
      授权获取用户信息
    </Button>
  );
}

export default LoginButton;

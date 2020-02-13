import { Button } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getAliLogin, getAliPhone, findCard } from "@/services/index";
import Taro from "@tarojs/taro";
import findHandler from "@/helpers/findHandler";

function LoginButton() {
  const [{ loading }, fetchLogin] = useAsyncFn<any>(getAliLogin);
  const [{ loading: getPhoneLoading }, fetchGetPhone] = useAsyncFn<any>(
    getAliPhone
  );
  const [{ loading: findCardLoading }, fetchFindCardApi] = useAsyncFn<any>(
    findCard
  );

  const onGetAuthorize = async () => {
    my.getOpenUserInfo({
      success: (user: any) => {
        const userInfo = JSON.parse(user.response).response;
        // token授权以及用户信息(https://opendocs.alipay.com/mini/introduce/twn8vq)
        my.getAuthCode({
          scopes: ["auth_user"],
          success: async (res: any) => {
            try {
              const authCode = res.authCode;
              const { accesstoken, aliuid } = await fetchLogin({
                authcode: authCode
              });
              // Taro.setStorageSync("token", accesstoken);
              // Taro.setStorageSync("phone", "17521524019");
              // return;
              // 手机号授权
              my.getPhoneNumber({
                success: async (response: any) => {
                  const encryptedData = response.response;
                  const { mobile } = await fetchGetPhone({
                    encrypteddata: encryptedData,
                    aliuserid: aliuid,
                    userinfo: JSON.stringify(userInfo)
                  });
                  successHandler(accesstoken, mobile);
                },
                fail: (response: any) => {
                  console.log(response);
                  console.log("getPhoneNumber_fail");
                }
              });
            } catch (error) {}
          }
        });
      }
    });
  };

  const successHandler = async (accessToken: string, phone: string) => {
    Taro.setStorageSync("token", accessToken);
    Taro.setStorageSync("phone", phone);

    const cardData = await fetchFindCardApi({
      mobile: phone
    });
    findHandler(cardData);
  };

  return (
    <Button
      type="primary"
      onClick={onGetAuthorize}
      loading={loading || getPhoneLoading || findCardLoading}
      open-type="getAuthorize"
      onGetAuthorize="onGetAuthorize"
      onError="onAuthError"
      scope="userInfo"
    >
      授权获取用户信息
    </Button>
  );
}

export default LoginButton;

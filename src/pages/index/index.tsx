import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import LoginButton from "../../components/LoginButton";
import useAsyncFn from "@/shared/useAsyncFn";
import { findCard, getHome } from "@/services/index";
import Styles from "./index.module.scss";
import findHandler from "@/helpers/findHandler";

const Index: Taro.FunctionComponent = () => {
  const [, fetchFindCardApi] = useAsyncFn<any>(findCard);
  const [{ value }, getConfig] = useAsyncFn<any>(getHome);
  const [noLogin, setNoLogin] = useState(true);

  useEffect(() => {
    Taro.showLoading({ title: "加载中....." });
    getConfig();
    const token = Taro.getStorageSync("token");
    const phone = Taro.getStorageSync("phone");
    if (token && phone) {
      fetchFindCardApi({ mobile: phone })
        .then((res: any) => {
          findHandler(res);
          Taro.hideLoading();
        })
        .catch(() => {
          setNoLogin(false);
          Taro.hideLoading();
        });
    } else {
      setNoLogin(false);
      Taro.hideLoading();
    }
  }, []);

  const toAgreement = () => {
    Taro.navigateTo({
      url: "/pages/agreement/index?type=login"
    });
  };
  return (
    <View className={Styles.index}>
      {noLogin ? (
        false
      ) : (
        <View>
          <Image
            src={value && value.indexpic}
            mode="aspectFit"
            className={Styles.img}
          />
          <LoginButton />
          <View className={Styles.agreement}>
            登录即代表您已阅读并同意
            <Text className={Styles.span} onClick={toAgreement}>
              《用户协议及隐私政策》
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页"
};

export default Index;

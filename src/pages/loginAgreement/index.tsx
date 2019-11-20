import Taro, { useEffect } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getLoginAgreement } from "@/services/index";

import Styles from "./index.module.scss";

const LoginAgreement: Taro.FunctionComponent = () => {
  const [{ value, loading }, fetchAgreement] = useAsyncFn<any>(
    getLoginAgreement
  );
  useEffect(() => {
    fetchAgreement();
  }, []);
  return (
    <View className={Styles.pages}>
      <RichText nodes={value.regstatement} />
    </View>
  );
};

LoginAgreement.config = {
  navigationBarTitleText: "用户协议"
};

export default LoginAgreement;

import Taro, { useEffect, useRouter, useState } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getLoginAgreement } from "@/services/index";

import Styles from "./index.module.scss";

const Agreement: Taro.FunctionComponent = () => {
  const {
    params: { type }
  } = useRouter();
  const [data, setData] = useState({ regstatement: "" });
  const [, fetchAgreement] = useAsyncFn<any>(getLoginAgreement);

  const typeWithFn = {
    login: {
      fn: fetchAgreement,
      params: {}
    }
  };
  useEffect(() => {
    fetchFn();
  }, []);

  const fetchFn = async () => {
    const { fn, params } = typeWithFn[type];
    await fn(params).then(setData);
  };
  return (
    <View className={Styles.pages}>
      <RichText nodes={data.regstatement} />
    </View>
  );
};

Agreement.config = {
  navigationBarTitleText: "协议"
};

export default Agreement;

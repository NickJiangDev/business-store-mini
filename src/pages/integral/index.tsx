import Taro, { useState } from "@tarojs/taro";
import { AtInput } from "taro-ui";
import { View } from "@tarojs/components";

import Styles from "./index.module.scss";

function Integral() {
  const [integral, setIntegral] = useState("");
  const integralOnchange = (e: any) => {
    const value = (e.target && e.target.value) || "";
    setIntegral(value);
  };
  return (
    <View className={Styles.page}>
      <View className={Styles.title}>积分兑换</View>
      <AtInput
        name="积分"
        title="积分"
        value={20}
        editable={false}
        onChange={() => {}}
      ></AtInput>
      <AtInput
        name="兑换积分"
        title="兑换积分"
        type="number"
        placeholder="请输入兑换积分"
        value={integral}
        onChange={integralOnchange}
      ></AtInput>
      <View className={Styles.rules}>
        <View className={Styles.rulesTitle}>兑换规则</View>
        <View className={Styles.rulesContent}>
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </View>
      </View>
    </View>
  );
}

Integral.config = {
  navigationBarTitleText: "积分兑换"
};

export default Integral;

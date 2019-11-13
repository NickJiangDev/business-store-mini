import Taro, { useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

import Styles from "./index.module.scss";

function Pay() {
  // useEffect(() => {
  //   Taro.setScreenBrightness({ value: 0.75 });
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     Taro.setScreenBrightness({ value: 0.35 });
  //   };
  // }, []);

  return (
    <View>
      <View className={Styles.balance}>
        <View className={Styles.p}>余额</View>
        <View className={Styles.p}>￥20元</View>
      </View>
      <View className={Styles.payCell}>
        <View className={Styles.flexCell}>
          <View className={Styles.cell}>444</View>
          <View className={Styles.cell}>444</View>
          <View className={Styles.cell}>444</View>
        </View>
        <View className={Styles.flexCell}>
          <View className={Styles.cell}>444</View>
          <View className={Styles.cell}>444</View>
          <View className={Styles.cell}>444</View>
        </View>
      </View>
    </View>
  );
}

Pay.config = {
  navigationBarTitleText: "充值"
};

export default Pay;

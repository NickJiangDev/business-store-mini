import Taro, { useEffect } from "@tarojs/taro";
import { Barcode, QRCode } from "taro-code";
import { View, Button } from "@tarojs/components";

import Styles from "./index.module.scss";

function Customer() {
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
      <View className={Styles.barcode}>
        <Barcode text="hello" width={305} height={68} />
      </View>
      <View className={Styles.barcode}>
        <QRCode text="World" size={205} />
      </View>
    </View>
  );
}

Customer.config = {
  navigationBarTitleText: "储值消费"
};

export default Customer;

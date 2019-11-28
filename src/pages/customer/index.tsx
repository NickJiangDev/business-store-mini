import Taro, { useEffect } from "@tarojs/taro";
import { Barcode, QRCode } from "taro-code";
import { View, Text } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCardInfo, getCustomNum, getCardData } from "@/services";
import Styles from "./index.module.scss";

let timer;
const time = 60000;

function Customer() {
  // useEffect(() => {
  //   Taro.setScreenBrightness({ value: 0.75 });
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     Taro.setScreenBrightness({ value: 0.35 });
  //   };
  // }, []);

  const [{ value = { paycode: "" } }, getCustom] = useAsyncFn<any>(
    getCustomNum
  );
  useEffect(() => {
    return clearInterval(timer);
  });

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    try {
      const cardid = Taro.getStorageSync("cardid");
      const cardno = Taro.getStorageSync("cardno");
      if (cardid && cardno) {
        Taro.showLoading({ title: "加载中...", mask: true });
        await getCustom({ cardno, paycode: "" }).then(() => {
          timer = setInterval(refresh, time);
        });
      }
      Taro.hideLoading();
    } catch (error) {}
  };

  const refresh = async (type = "timer") => {
    Taro.showLoading({ title: "加载中...", mask: true });
    // 点击后刷新接口，重启定时器
    if (type === "click") {
      clearInterval(timer);
    }
    const cardno = Taro.getStorageSync("cardno");
    const paycode = value ? value.paycode : "";
    getCustom({ cardno, paycode }).then(() => {
      if (type === "click") {
        timer = setInterval(refresh, time);
      }
      Taro.hideLoading();
    });
  };
  return (
    <View>
      <View className={Styles.balance}>
        <View className={Styles.p}>余额</View>
        <View className={Styles.p}>￥20元</View>
      </View>
      <View className={Styles.barcode} onClick={() => refresh("click")}>
        <Barcode text={value.paycode} width={305} height={68} />
        <Text>{value.paycode}</Text>
      </View>
      <View className={Styles.barcode} onClick={() => refresh("click")}>
        <QRCode text={value.paycode} size={205} />
      </View>
    </View>
  );
}

Customer.config = {
  navigationBarTitleText: "储值消费"
};

export default Customer;

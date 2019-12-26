import Taro, { useEffect } from "@tarojs/taro";
import { Barcode, QRCode } from "taro-code";
import { View, Text, Image } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCardInfo, getCustomNum, getCardData } from "@/services";
import Styles from "./index.module.scss";

let timer;
const time = 60000;

function Customer() {
  const [{ value = { paycode: "", money: "0" } }, getCustom] = useAsyncFn<any>(
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

  const imgStyle = Taro.getStorageSync("backImg")
    ? { backgroundImage: `url(${Taro.getStorageSync("backImg")})` }
    : {};
  const colorStyle = Taro.getStorageSync("color")
    ? { backgroundColor: Taro.getStorageSync("color") }
    : {};
  console.log(
    Taro.getStorageSync("memname"),
    Taro.getStorageSync("headimgurl")
  );
  return (
    <View>
      <View className={Styles.sign} style={{ ...imgStyle, ...colorStyle }}>
        <View className={Styles.userCell}>
          <Image
            src={Taro.getStorageSync("headimgurl")}
            mode="aspectFit"
            className={Styles.img}
          />
          <View className={Styles.p}>{Taro.getStorageSync("memname")}</View>
        </View>
        <View className={Styles.flex}>
          <View>{Taro.getStorageSync("cardno")}</View>
          <View className={Styles.flex}>
            <View>余额</View>
            <View>￥{value.money}元</View>
          </View>
        </View>
      </View>
      {value.paycode ? (
        <View className={Styles.barcode} onClick={() => refresh("click")}>
          <Barcode text={value.paycode} width={305} height={68} />
          <Text>{value.paycode}</Text>
        </View>
      ) : (
        false
      )}
      {value.paycode ? (
        <View className={Styles.barcode} onClick={() => refresh("click")}>
          <QRCode text={value.paycode} size={205} />
        </View>
      ) : (
        false
      )}
    </View>
  );
}

Customer.config = {
  navigationBarTitleText: "储值消费"
};

export default Customer;

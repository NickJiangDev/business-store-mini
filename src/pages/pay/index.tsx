import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import Styles from "./index.module.scss";
import useAsyncFn from "@/shared/useAsyncFn";
import { payConfigApi, payApi } from "@/services";
import { AtButton, AtFloatLayout, AtInput } from "taro-ui";

const defaultValue = {
  customemoney: "",
  money: "",
  rechargelist: [],
  rechargestrategy: ""
};
function Pay() {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [{ value = defaultValue, loading }, getConfig] = useAsyncFn<any>(
    payConfigApi
  );
  const [{ loading: payLoading }, pay] = useAsyncFn<any>(payApi);
  useEffect(() => {
    const cardno = Taro.getStorageSync("cardno");
    getConfig({ cardno });
  }, [getConfig]);

  useEffect(() => {
    if (loading || payLoading) {
      Taro.showLoading({ title: "加载中...", mask: true });
    } else {
      Taro.hideLoading();
    }
  }, [loading, payLoading]);
  const payHandler = (count: string) => {
    console.log(count);
    debugger;
    const cardno = Taro.getStorageSync("cardno");
    pay({ cardno, rechargemoney: count }).then((data: any) => {
      Taro.requestPayment({
        timeStamp: data.timestamp,
        nonceStr: data.noncestr,
        package: data.package,
        signType: data.signtype,
        paySign: data.sign,
        success() {
          Taro.showToast({ icon: "success", title: "充值成功" });
          getConfig({ cardno });
          setInputValue("");
        }
      });
    });
  };
  const inputOnChange = (v: any) => {
    const newInput = v.replace(/[^0-9]/gi, "");
    setInputValue(newInput);
  };
  return (
    <View>
      <View
        className={Styles.balance}
        style={{
          backgroundColor: Taro.getStorageSync("color")
        }}
      >
        <View className={Styles.rule} onClick={() => setVisible(true)}>
          充值规则 >
        </View>
        <View className={Styles.p}>余额</View>
        <View className={Styles.p}>￥{value.money}元</View>
      </View>
      <View className={Styles.payCell}>
        <View className={Styles.flexCell}>
          {value.rechargelist.map((v: string, i: number) => (
            <AtButton
              key={i}
              type="secondary"
              className={Styles.cell}
              customStyle={{
                color: Taro.getStorageSync("color"),
                borderColor: Taro.getStorageSync("color")
              }}
              onClick={() => payHandler(v)}
            >
              {v}元
            </AtButton>
          ))}
          {value.customemoney ? (
            <AtInput
              className={Styles.input}
              name=""
              customStyle={{
                borderColor: Taro.getStorageSync("color")
              }}
              value={inputValue}
              placeholder={value.customemoney + "整数"}
              onChange={(v: string) => inputOnChange(v)}
              onConfirm={() => payHandler(inputValue)}
            />
          ) : (
            false
          )}
        </View>
      </View>
      <AtFloatLayout
        isOpened={!!visible}
        onClose={() => setVisible(false)}
        title="充值规则"
      >
        <RichText nodes={value.rechargestrategy} />
      </AtFloatLayout>
    </View>
  );
}

Pay.config = {
  navigationBarTitleText: "充值"
};

export default Pay;

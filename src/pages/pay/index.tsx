import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, RichText, Button } from "@tarojs/components";
import parse from "@jiahuix/mini-html-parser2";
import Styles from "./index.module.scss";
import useAsyncFn from "@/shared/useAsyncFn";
import { payConfigApi, payApi, aliPayApi } from "@/services";
import { AtFloatLayout, AtInput } from "taro-ui";

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
  const [{ loading: alipayLoading }, aliPay] = useAsyncFn<any>(aliPayApi);
  const [rules, setRules] = useState("");

  useEffect(() => {
    const cardno = Taro.getStorageSync("cardno");
    getConfig({ cardno });
  }, []);
  useEffect(() => {
    parse(value.rechargestrategy, (err, htmlNodes) => {
      if (!err) {
        setRules(htmlNodes);
      }
    });
  }, [value]);

  useEffect(() => {
    if (loading || payLoading || alipayLoading) {
      Taro.showLoading({ title: "加载中...", mask: true });
    }
  }, [loading, payLoading, alipayLoading]);
  const payHandler = (count: string) => {
    Taro.getEnv() === "ALIPAY" ? alipayHandler(count) : wechatHandler(count);
  };
  const alipayHandler = async (count: string) => {
    const cardno = Taro.getStorageSync("cardno");
    await aliPay({ cardno, rechargemoney: count }).then((data: any) => {
      Taro.hideLoading();
      my.tradePay({
        tradeNO: data.tradeno,
        success: function() {
          getConfig({ cardno });
        },
        fail: function() {
          Taro.showToast({ icon: "none", title: "失败" });
        }
      });
    });
  };
  const wechatHandler = (count: string) => {
    const cardno = Taro.getStorageSync("cardno");
    pay({ cardno, rechargemoney: count }).then((data: any) => {
      Taro.hideLoading();
      Taro.requestPayment({
        timeStamp: data.timestamp,
        nonceStr: data.noncestr,
        package: data.package,
        signType: data.signtype,
        paySign: data.sign,
        success() {
          successHandler(cardno);
        }
      });
    });
  };

  const successHandler = (cardno: string) => {
    Taro.showToast({ icon: "success", title: "充值成功" });
    getConfig({ cardno });
    setInputValue("");
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
            <Button
              key={i}
              className={Styles.cell}
              style={{
                color: Taro.getStorageSync("color"),
                borderColor: Taro.getStorageSync("color")
              }}
              onClick={() => payHandler(v)}
            >
              {v}元
            </Button>
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
        <RichText nodes={rules} />
      </AtFloatLayout>
    </View>
  );
}

Pay.config = {
  navigationBarTitleText: "充值"
};

export default Pay;

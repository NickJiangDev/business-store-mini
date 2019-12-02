import Taro, { useState, useEffect } from "@tarojs/taro";
import { AtInput, AtButton } from "taro-ui";
import { View } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getPointApi, exchangePointApi } from "@/services/index";
import Styles from "./index.module.scss";

const defaultData = {
  datalist: [],
  money: 0,
  point: 0
};
function Integral() {
  const [integral, setIntegral] = useState("");
  const [data, setData] = useState(defaultData);
  const [, fetchPoint] = useAsyncFn<any>(getPointApi);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    fetchPoint().then((res: any) => {
      setData(res);
    });
  };
  const integralOnchange = (e: any) => {
    const value = (e.target && e.target.value) || "";
    setIntegral(value);
  };
  const pointExchange = async () => {
    try {
      Taro.showLoading({ title: "加载中...", mask: true });
      await exchangePointApi({ point: integral });
      Taro.showToast({ icon: "none", title: "兑换成功" });
    } catch (error) {}
  };
  return (
    <View className={Styles.page}>
      <AtInput
        name="积分"
        title="积分"
        value={data.point}
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
      <AtButton type="primary" onClick={pointExchange}>
        积分兑换
      </AtButton>
    </View>
  );
}

Integral.config = {
  navigationBarTitleText: "积分兑换"
};

export default Integral;

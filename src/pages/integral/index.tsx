import Taro, { useState, useEffect } from "@tarojs/taro";
import { AtInput, AtButton } from "taro-ui";
import { View, Text } from "@tarojs/components";
import cx from "classnames";
import useAsyncFn from "@/shared/useAsyncFn";
import { getPointApi, exchangePointApi } from "@/services/index";
import Styles from "./index.module.scss";

const defaultData = {
  datalist: [],
  money: 0,
  point: 0
};

const getCellText = (cellData: any) => {
  const value =
    cellData.exchangevalue === 1
      ? `1积分兑换${cellData.exchangerate}元}`
      : `${cellData.exchangemoney}元`;
  const msg = cellData.exchangeflag === 1 ? "比例" : "金额";
  return cellData.endmoney
    ? `${cellData.startmoney}以上：兑换${msg}为${value}`
    : `${cellData.startmoney}-${cellData.endmoney}：兑换${msg}为${value}`;
};
function Integral() {
  const [integral, setIntegral] = useState("");
  const [data, setData] = useState(defaultData);
  const [{ loading }, fetchPoint] = useAsyncFn<any>(getPointApi);

  useEffect(() => {
    getConfig();
  }, []);
  useEffect(() => {
    if (loading) {
      Taro.showLoading({ title: "加载中...", mask: true });
      return;
    }
    Taro.hideLoading();
  }, [loading]);

  const getConfig = async () => {
    fetchPoint().then((res: any) => {
      setData(res);
      setIntegral("");
    });
  };
  const integralOnchange = (value: string) => {
    setIntegral(value);
  };
  const pointExchange = async () => {
    try {
      Taro.showLoading({ title: "加载中...", mask: true });
      await exchangePointApi({ point: integral });
      Taro.showToast({ icon: "none", title: "兑换成功" });
      getConfig();
    } catch (error) {}
  };
  return (
    <View className={Styles.page}>
      <View className={Styles.content}>
        <View className={Styles.inputCell}>
          <Text className={Styles.inputTitle}>积分</Text>
          <AtInput
            className={cx({
              [Styles.input]: true,
              [Styles.gray]: true
            })}
            name=""
            title=""
            value={data.point}
            editable={false}
            onChange={() => {}}
          />
        </View>

        <View className={Styles.inputCell}>
          <Text className={Styles.inputTitle}>兑换积分</Text>
          <AtInput
            className={Styles.input}
            name=""
            title=""
            type="number"
            placeholder="请输入兑换积分"
            value={integral}
            onChange={integralOnchange}
          />
        </View>
        <View className={Styles.rules}>
          <View className={Styles.rulesTitle}>兑换规则</View>
          <View className={Styles.rulesContent}>
            {data.datalist.map((v: any) => (
              <Text>{getCellText(v)}</Text>
            ))}
          </View>
        </View>
      </View>
      <AtButton className={Styles.btn} type="primary" onClick={pointExchange}>
        积分兑换
      </AtButton>
    </View>
  );
}

Integral.config = {
  navigationBarTitleText: "积分兑换"
};

export default Integral;

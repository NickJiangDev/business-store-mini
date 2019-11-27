import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCalendar } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCalendarRoleApi, signApi } from "@/services/index";
import Styles from "./index.module.scss";

const defaultData = {
  point: 0,
  signflag: 0,
  signpoint: 0,
  signdata: "",
  signnum: 0,
  signruleid: "",
  strategy: ""
};

const Calendar: Taro.FunctionComponent = () => {
  const [data, setData] = useState(defaultData);
  const [, fetchCalendar] = useAsyncFn<any>(getCalendarRoleApi);
  const [, fetchSign] = useAsyncFn<any>(signApi);
  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    await fetchCalendar({ cardno: Taro.getStorageSync("cardno") }).then(
      setData
    );
  };
  const toRole = () => {
    Taro.navigateTo({
      url: "/pages/agreement/index?type=calendar"
    });
  };

  const sign = async () => {
    Taro.showLoading({ title: "加载中...", mask: true });
    await fetchSign({ cardno: Taro.getStorageSync("cardno") });
    await getConfig();
    Taro.hideLoading();
  };
  return (
    <View>
      <View className={Styles.signHeader}>
        <View className={Styles.span}>积分：{data.point}</View>
        <View className={Styles.span} onClick={toRole}>
          签到攻略 >
        </View>
      </View>
      <View className={Styles.sign}>
        {data.signflag ? (
          <View className={Styles.p} style={{ opacity: 0.4 }}>
            已签到
          </View>
        ) : (
          <View className={Styles.p} onClick={sign}>
            签到
          </View>
        )}
        <View className={Styles.span}>{data.signdata}</View>
      </View>
      <AtCalendar />
    </View>
  );
};

Calendar.config = {
  navigationBarTitleText: "每日签到"
};

export default Calendar;

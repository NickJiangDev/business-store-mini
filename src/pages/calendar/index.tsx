import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCalendar, AtFloatLayout } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCalendarRoleApi, signApi, getDateApi } from "@/services/index";
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

const currentDate = new Date();

const Calendar: Taro.FunctionComponent = () => {
  const [data, setData] = useState(defaultData);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });
  const [{ loading: roleLoading }, fetchCalendar] = useAsyncFn<any>(
    getCalendarRoleApi
  );
  const [{ loading: signLoading }, fetchSign] = useAsyncFn<any>(signApi);
  const [
    { loading: dateLoading, value = { signDays: [] } },
    fetchDateApi
  ] = useAsyncFn<any>(getDateApi);
  useEffect(() => {
    getConfig();
  }, []);
  useEffect(() => {
    if (roleLoading || signLoading || dateLoading) {
      Taro.showLoading({ title: "加载中...", mask: true });
    }
  }, [roleLoading, signLoading, dateLoading]);

  const getConfig = async () => {
    await fetchCalendar({ cardno: Taro.getStorageSync("cardno") }).then(
      setData
    );
    await fetchDateApi(date);
    Taro.hideLoading();
  };
  const toRole = () => {
    setVisible(true);
  };

  const sign = async () => {
    await fetchSign({ cardno: Taro.getStorageSync("cardno") });
    await getConfig();
    Taro.hideLoading();
  };

  const onMonthChange = async (value: any) => {
    const [year, month] = value.split("-");
    setDate({ year, month });
    await fetchDateApi({ year, month });
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
      <AtCalendar
        marks={(value.signDays || []).map((dateDay: string) => {
          return [date.year, date.month, dateDay].join("-");
        })}
        onMonthChange={onMonthChange}
      />
      <AtFloatLayout
        isOpened={visible}
        title="签到规则"
        onClose={() => setVisible(false)}
      >
        这是内容区 随你怎么写这是内容区 随你怎么写这是内容区
        随你怎么写这是内容区 随你怎么写这是内容区 随你怎么写这是内容区
        随你怎么写
      </AtFloatLayout>
    </View>
  );
};

Calendar.config = {
  navigationBarTitleText: "每日签到"
};

export default Calendar;

import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCalendar, AtFloatLayout } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import cx from "classnames";
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
  const [errorData, setErrorData] = useState("");
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });

  const [{ loading: signLoading }, fetchSign] = useAsyncFn<any>(signApi);
  const [
    { loading: dateLoading, value = { signdays: [] } },
    fetchDateApi
  ] = useAsyncFn<any>(getDateApi);
  useEffect(() => {
    getConfig();
  }, []);
  useEffect(() => {
    if (signLoading || dateLoading) {
      Taro.showLoading({ title: "加载中...", mask: true });
    }
  }, [signLoading, dateLoading]);

  const getConfig = async () => {
    Taro.showLoading({ title: "加载中...", mask: true });
    await getCalendarRoleApi({ cardno: Taro.getStorageSync("cardno") })
      .then(setData)
      .catch((error: any) => {
        setErrorData(error.errMsg);
        Taro.hideLoading();
      });
    await fetchDateApi(date);
    Taro.hideLoading();
  };
  const toRole = () => {
    setVisible(true);
  };

  const sign = async () => {
    if (errorData) {
      return;
    }
    await fetchSign({ cardno: Taro.getStorageSync("cardno") });
    await getConfig();
  };

  const onMonthChange = async (values: any) => {
    const [year, month] = values.split("-");
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
      <View
        className={Styles.sign}
        style={{
          backgroundColor: Taro.getStorageSync("color")
        }}
      >
        {data.signflag ? (
          <View
            className={Styles.p}
            style={{
              opacity: 0.4,
              color: Taro.getStorageSync("color")
            }}
          >
            已签到
          </View>
        ) : (
          <View
            className={cx({ [Styles.p]: true, [Styles.disabled]: !!errorData })}
            onClick={sign}
            style={{ color: Taro.getStorageSync("color") }}
          >
            签到
          </View>
        )}
        <View className={Styles.span}>{errorData || data.signdata}</View>
      </View>
      <AtCalendar
        marks={(value.signdays || []).map((dateDay: string) => {
          return { value: [date.year, date.month, dateDay].join("-") };
        })}
        onMonthChange={onMonthChange}
      />
      <AtFloatLayout
        isOpened={visible}
        title="签到规则"
        onClose={() => setVisible(false)}
      >
        {data.strategy}
      </AtFloatLayout>
    </View>
  );
};

Calendar.config = {
  navigationBarTitleText: "每日签到"
};

export default Calendar;

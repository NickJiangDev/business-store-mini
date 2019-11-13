import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCalendar } from "taro-ui";

import Styles from "./index.module.scss";

const Calendar: Taro.FunctionComponent = () => {
  return (
    <View>
      <View className={Styles.signHeader}>
        <View className={Styles.span}>积分：2</View>
        <View className={Styles.span}>签到攻略 ></View>
      </View>
      <View className={Styles.sign}>
        <View className={Styles.p}>签到</View>
        <View className={Styles.span}>今日可领5积分</View>
      </View>
      <AtCalendar />
    </View>
  );
};

Calendar.config = {
  navigationBarTitleText: "每日签到"
};

export default Calendar;

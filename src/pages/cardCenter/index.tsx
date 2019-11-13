import Taro, { usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtProgress, AtButton } from "taro-ui";

import Styles from "./index.module.scss";

const CardCenter: Taro.FunctionComponent = () => {
  usePullDownRefresh(() => {
    debugger;
  });

  useReachBottom(() => {
    debugger;
  });
  return (
    <View className={Styles.pages}>
      {Array(3)
        .fill("")
        .map(() => {
          return (
            <View className={Styles.cell}>
              <View className={Styles.leftCell}>
                <View className={Styles.cellInfo}>
                  <View className={Styles.cellIcon}></View>
                  <View>
                    <View>优惠券名称</View>
                    <View className={Styles.count}>￥10</View>
                  </View>
                </View>
                <View className={Styles.cellDate}>2018-12-12至2019-12-12</View>
              </View>
              <View className={Styles.rightCell}>
                <View className={Styles.processNum}>1/1</View>
                <AtProgress percent={75} strokeWidth={4} isHidePercent />
                <AtButton className={Styles.btn}>立即抢</AtButton>
              </View>
            </View>
          );
        })}
    </View>
  );
};

CardCenter.config = {
  navigationBarTitleText: "领劵中心",
  enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  backgroundTextStyle: "dark"
};

export default CardCenter;

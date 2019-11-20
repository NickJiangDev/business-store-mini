import Taro, {
  useState,
  usePullDownRefresh,
  useReachBottom
} from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtButton } from "taro-ui";

import Styles from "./index.module.scss";

const Order: Taro.FunctionComponent = () => {
  usePullDownRefresh(() => {
    debugger;
  });

  useReachBottom(() => {
    debugger;
  });
  const [count, setCount] = useState(0);
  const tabList = [
    { title: "未使用" },
    { title: "已使用" },
    { title: "已过期" }
  ];

  const handleClick = (value: any) => {
    setCount(value);
  };

  const useIntroduction = () => {
    console.log("ss");
  };
  return (
    <AtTabs current={count} tabList={tabList} onClick={handleClick}>
      <AtTabsPane current={count} index={0}>
        <View className={Styles.tabs}>
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
              <AtButton className={Styles.btn}>立即使用</AtButton>
              <View onClick={useIntroduction}>使用说明 ></View>
            </View>
          </View>
        </View>
      </AtTabsPane>
      <AtTabsPane current={count} index={1}>
        <View className={Styles.tabs}>
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
              <AtButton className={Styles.btn} disabled={true}>
                已使用
              </AtButton>
              <View>使用说明 ></View>
            </View>
          </View>
        </View>
      </AtTabsPane>
      <AtTabsPane current={count} index={2}>
        <View className={Styles.tabs}>
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
              <AtButton className={Styles.btn} disabled={true}>
                已过期
              </AtButton>
              <View>使用说明 ></View>
            </View>
          </View>
        </View>
      </AtTabsPane>
    </AtTabs>
  );
};

Order.config = {
  navigationBarTitleText: "优惠券",
  enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  backgroundTextStyle: "dark"
};

export default Order;

import Taro, { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";

import Styles from "./index.module.scss";

const Order: Taro.FunctionComponent = () => {
  const [count, setCount] = useState(0);
  const tabList = [
    { title: "未使用" },
    { title: "已使用" },
    { title: "已过期" }
  ];

  const handleClick = (value: any) => {
    setCount(value);
  };
  return (
    <View className={Styles.disabled}>
      <AtTabs current={count} tabList={tabList} onClick={handleClick}>
        <AtTabsPane current={count} index={0}>
          <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;">
            标签页一的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={count} index={1}>
          <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;">
            标签页二的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={count} index={2}>
          <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;">
            标签页三的内容
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "优惠券"
};

export default Order;

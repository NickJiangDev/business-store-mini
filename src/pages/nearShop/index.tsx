import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

import "./index.scss";

const NearShop: Taro.FunctionComponent = () => {
  Taro.getLocation().then((res: any) => {
    console.log(res);
  });
  return (
    <View>
      <View className="title">附近门店</View>
    </View>
  );
};

NearShop.config = {
  navigationBarTitleText: "附近门店"
};

export default NearShop;

import Taro, { useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

import "./index.scss";

const NearShop: Taro.FunctionComponent = () => {
  useEffect(() => {
    Taro.getLocation().then((res: any) => {
      console.log(res);
    });
  }, []);

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

import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { Barcode } from "taro-code";
import { AtList, AtListItem } from "taro-ui";
import Styles from "./index.module.scss";

const Card: Taro.FunctionComponent = () => {
  const [userInfo, setUserInfo] = useState({ nickName: "", avatarUrl: "" });

  useEffect(() => {
    setUserInfo(Taro.getStorageSync("userInfo"));
  }, []);
  const { nickName, avatarUrl } = userInfo;

  const toPay = () => {
    Taro.navigateTo({
      url: "/pages/pay/index"
    });
  };

  const toIntegral = () => {
    Taro.navigateTo({
      url: "/pages/integral/index"
    });
  };
  return (
    <View>
      <View className={Styles.sign}>
        <View className={Styles.userCell}>
          <Image src={avatarUrl} mode="aspectFit" className={Styles.img} />
          <View className={Styles.p}>{nickName}</View>
        </View>
        <View className={Styles.p}>123123123123123123123</View>
      </View>
      <View className={Styles.op}>
        <View>
          <View className={Styles.viewNoLine}>
            <View>积分</View>
            <View>0</View>
          </View>
        </View>
        <View>
          <View className={Styles.view}>
            <View>金额</View>
            <View>0</View>
          </View>
        </View>
        <View>
          <View className={Styles.view}>
            <View>优惠券</View>
            <View>查看</View>
          </View>
        </View>
      </View>
      <View className={Styles.barcode}>
        <Barcode text="hello" width={305} height={68} />
      </View>
      <AtList>
        <AtListItem title="储值与消费" extraText="储值卡消费" />
        <AtListItem title="优惠券" extraText="优惠券" />
        <AtListItem title="充值" extraText="充值" onClick={toPay} />
        <AtListItem
          title="积分兑换"
          extraText="积分兑换"
          onClick={toIntegral}
        />
        <AtListItem title="每日签到" />
        <AtListItem title="关注门店" />
      </AtList>
    </View>
  );
};

Card.config = {
  navigationBarTitleText: "会员卡"
};

export default Card;

import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { Barcode } from "taro-code";
import cx from "classnames";
import { AtList, AtListItem } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCardInfo, getCustomNum, getCardData } from "@/services";
import { defaultSkeleton, defaultInfoData, time } from "./interface";
import Styles from "./index.module.scss";

let timer;
const Card: Taro.FunctionComponent = () => {
  const [{ value: skeletonValue = defaultSkeleton }, getInfo] = useAsyncFn<any>(
    getCardInfo
  );
  const [{ value: infoData = defaultInfoData }, getCardDataApi] = useAsyncFn<
    any
  >(getCardData);
  const [{ value }, getCustom] = useAsyncFn<any>(getCustomNum);
  const cellLength = [
    skeletonValue.supply_bonus,
    skeletonValue.supply_balance,
    skeletonValue.supply_coupon
  ].filter(v => v).length; // 当前积分栏的显示数量
  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    try {
      const cardid = Taro.getStorageSync("cardid");
      const cardno = Taro.getStorageSync("cardno");
      if (cardid && cardno) {
        Taro.showLoading({ title: "加载中...", mask: true });
        await getInfo({ cardid });
        await getCardDataApi({ cardno });
        await getCustom({ cardno, paycode: "" }).then(() => {
          timer = setInterval(refresh, time);
        });
      }
      Taro.hideLoading();
    } catch (error) {}
  };

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

  const refresh = async (type = "timer") => {
    Taro.showLoading({ title: "加载中...", mask: true });
    // 点击后刷新接口，重启定时器
    if (type === "click") {
      clearInterval(timer);
    }
    const cardno = Taro.getStorageSync("cardno");
    const paycode = value ? value.paycode : "";
    getCustom({ cardno, paycode }).then(() => {
      if (type === "click") {
        timer = setInterval(refresh, time);
      }
      Taro.hideLoading();
    });
  };

  const viewStyles = cx({
    [Styles.view]: true,
    [Styles.view0]: cellLength === 0,
    [Styles.view1]: cellLength === 1,
    [Styles.view2]: cellLength === 2,
    [Styles.view3]: cellLength === 3
  });
  return (
    <View>
      <View className={Styles.sign}>
        <View className={Styles.userCell}>
          <Image
            src={infoData.headimgurl}
            mode="aspectFit"
            className={Styles.img}
          />
          <View className={Styles.p}>{infoData.memname}</View>
        </View>
        <View className={Styles.p}>{infoData.cardno}</View>
      </View>
      <View className={Styles.op}>
        <View>
          <View className={viewStyles}>
            <View>积分</View>
            <View className={Styles.primary}>{infoData.point}</View>
          </View>
        </View>
        <View>
          <View className={viewStyles}>
            <View>金额</View>
            <View className={Styles.primary}>{infoData.money}</View>
          </View>
        </View>
        <View>
          <View className={viewStyles}>
            <View>优惠券</View>
            <View className={Styles.primary}>查看</View>
          </View>
        </View>
      </View>
      {value ? (
        <View className={Styles.barcode} onClick={() => refresh("click")}>
          <Barcode text={value.paycode} width={305} height={68} />
          <Text className={Styles.no}>{value.paycode}</Text>
        </View>
      ) : (
        false
      )}
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

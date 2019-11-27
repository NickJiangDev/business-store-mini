import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { Barcode } from "taro-code";
import cx from "classnames";
import { AtList, AtListItem, AtGrid } from "taro-ui";
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

  useEffect(() => {
    return clearInterval(timer);
  });

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

  const toOrder = () => {
    Taro.navigateTo({
      url: "/pages/order/index"
    });
  };

  const toIntegral = () => {
    Taro.navigateTo({
      url: "/pages/integral/index"
    });
  };

  const toCalendar = () => {
    Taro.navigateTo({
      url: "/pages/calendar/index"
    });
  };

  const toNearShop = () => {
    Taro.navigateTo({
      url: "/pages/nearShop/index"
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
        <AtListItem title="优惠券" extraText="优惠券" onClick={toOrder} />
        <AtListItem title="充值" extraText="充值" onClick={toPay} />
        <AtListItem
          title="积分兑换"
          extraText="积分兑换"
          onClick={toIntegral}
        />
        <AtListItem title="每日签到" onClick={toCalendar} />
        <AtListItem title="关注门店" onClick={toNearShop} />
      </AtList>
      {/* <AtGrid
        data={[
          {
            image:
              "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
            value: "领取中心"
          },
          {
            image:
              "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
            value: "找折扣"
          },
          {
            image:
              "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
            value: "领会员"
          },
          {
            image:
              "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
            value: "新品首发"
          },
          {
            image:
              "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
            value: "领京豆"
          },
          {
            image:
              "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
            value: "手机馆"
          }
        ]}
      /> */}
    </View>
  );
};

Card.config = {
  navigationBarTitleText: "会员卡"
};

export default Card;

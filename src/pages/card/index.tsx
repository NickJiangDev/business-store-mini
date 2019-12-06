import Taro, { useEffect, usePullDownRefresh } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { Barcode } from "taro-code";
import cx from "classnames";
import { AtList, AtListItem, AtGrid } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCardInfo, getCustomNum, getCardData } from "@/services";
import { defaultSkeleton, defaultInfoData, time, goUrl } from "./interface";
import Styles from "./index.module.scss";

let timer;
const Card: Taro.FunctionComponent = () => {
  const [{ value: skeletonValue = defaultSkeleton }, getInfo] = useAsyncFn<any>(
    getCardInfo
  );
  const [{ value: infoData = defaultInfoData }, getCardDataApi] = useAsyncFn<
    any
  >(getCardData);
  const [{ value, loading }, getCustom] = useAsyncFn<any>(getCustomNum);
  const cellLength = [
    skeletonValue.supply_bonus,
    skeletonValue.supply_balance,
    skeletonValue.supply_coupon,
    skeletonValue.supply_level
  ].filter(v => v).length; // 当前积分栏的显示数量
  useEffect(() => {
    setup();
  }, []);

  usePullDownRefresh(async () => {
    await setup();
    Taro.stopPullDownRefresh();
  });

  useEffect(() => {
    return clearInterval(timer);
  });

  const setup = async () => {
    try {
      clearInterval(timer);
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

  const goto = (v: any) => {
    const { operate_key, mini_app_url, operate_type } = v;

    if (operate_type === "openPage") {
      Taro.navigateTo({
        url: goUrl[operate_key]
      });
      return;
    }
  };

  const gridGoto = (key: string) => {
    if (key) {
      Taro.navigateTo({
        url: goUrl[key]
      });
    }
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

  const viewStyles = {
    [Styles.view]: true,
    [Styles.view1]: cellLength === 1,
    [Styles.view2]: cellLength === 2,
    [Styles.view3]: cellLength === 3,
    [Styles.view4]: cellLength === 4
  };

  const imgStyle = skeletonValue.background_url
    ? { backgroundImage: `url(${skeletonValue.background_url})` }
    : {};
  const colorStyle = skeletonValue.color
    ? { backgroundColor: skeletonValue.color }
    : {};
  return (
    <View className={Styles.pages}>
      <View className={Styles.sign} style={{ ...imgStyle, ...colorStyle }}>
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
          <View
            className={cx({
              ...viewStyles,
              [Styles.view0]: !skeletonValue.supply_bonus
            })}
          >
            <View>积分</View>
            <View
              className={Styles.primary}
              onClick={() => gridGoto(infoData.bonus_key)}
            >
              {infoData.point}
            </View>
          </View>
        </View>
        <View>
          <View
            className={cx({
              ...viewStyles,
              [Styles.view0]: !skeletonValue.supply_balance
            })}
          >
            <View>金额</View>
            <View
              className={Styles.primary}
              onClick={() => gridGoto(infoData.balance_key)}
            >
              {infoData.money}
            </View>
          </View>
        </View>
        <View>
          <View
            className={cx({
              ...viewStyles,
              [Styles.view0]: !skeletonValue.supply_coupon
            })}
          >
            <View>优惠券</View>
            <View
              className={Styles.primary}
              onClick={() => gridGoto(infoData.bonus_key)}
            >
              查看
            </View>
          </View>
        </View>
        <View>
          <View
            className={cx({
              ...viewStyles,
              [Styles.view0]: !skeletonValue.supply_level
            })}
          >
            <View>等级</View>
            <View
              className={Styles.primary}
              onClick={() => gridGoto(infoData.bonus_key)}
            >
              {infoData.levelname}
            </View>
          </View>
        </View>
      </View>
      {value ? (
        <View className={Styles.barcode} onClick={() => refresh("click")}>
          <Barcode text={value.paycode} width={285} height={68} />
          <Text className={Styles.no}>{value.paycode}</Text>
        </View>
      ) : (
        <View
          className={Styles.emptyCode}
          style={{
            width: "285px",
            height: "90px"
          }}
        />
      )}
      {skeletonValue.columnlayout === "list" ? (
        <AtList>
          {skeletonValue.column_info_list.map((v: any) => (
            <AtListItem
              title={v.title}
              extraText={v.tips}
              onClick={() => goto(v)}
            />
          ))}
        </AtList>
      ) : (
        <AtGrid
          data={skeletonValue.column_info_list.map((v: any) => {
            return { ...v, image: v.icon, value: v.title };
          })}
          onClick={goto}
        />
      )}
    </View>
  );
};

Card.config = {
  navigationBarTitleText: "会员卡",
  enablePullDownRefresh: true,
  backgroundTextStyle: "dark"
};

export default Card;

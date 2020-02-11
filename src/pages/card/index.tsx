import Taro, {
  usePullDownRefresh,
  useShareAppMessage,
  useDidHide,
  useDidShow,
  useState,
  useEffect
} from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import { Barcode } from "taro-code";
import cx from "classnames";
import { AtList, AtListItem, AtGrid, AtIcon } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCardInfo, getCustomNum, getCardData, getHome } from "@/services";
import { defaultSkeleton, defaultInfoData, time, goUrl } from "./interface";
import Styles from "./index.module.scss";

let timer;
const Card: Taro.FunctionComponent = () => {
  const [codeLoading, setCodeLoading] = useState(false);
  const defaultSData =
    (Taro.getStorageSync("skeletonData") &&
      JSON.parse(Taro.getStorageSync("skeletonData"))) ||
    defaultSkeleton;
  const defaultIData =
    (Taro.getStorageSync("infoData") &&
      JSON.parse(Taro.getStorageSync("infoData"))) ||
    defaultInfoData;
  const [{ value: skeletonValue = defaultSData }, getInfo] = useAsyncFn<any>(
    getCardInfo
  );
  const [{ value: infoData = defaultIData }, getCardDataApi] = useAsyncFn<any>(
    getCardData
  );
  const [{ value }, getCustom] = useAsyncFn<any>(getCustomNum);
  const [, getConfig] = useAsyncFn<any>(getHome);
  const cellLength = [
    skeletonValue.supply_bonus,
    skeletonValue.supply_balance,
    skeletonValue.supply_coupon,
    skeletonValue.supply_level
  ].filter(v => v).length; // 当前积分栏的显示数量

  useEffect(() => {
    if (skeletonValue.color) {
      const setObj = JSON.stringify(skeletonValue);
      Taro.setStorageSync("skeletonData", setObj);
      Taro.setStorageSync("color", skeletonValue.color);
    }
  }, [skeletonValue]);

  useEffect(() => {
    if (infoData.headimgurl) {
      Taro.setStorageSync("headimgurl", infoData.headimgurl);
    }
    if (infoData.memname) {
      Taro.setStorageSync("memname", infoData.memname);
    }
    if (infoData.cardno) {
      const setObj = JSON.stringify(infoData);
      Taro.setStorageSync("infoData", setObj);
      Taro.setStorageSync("cardno", infoData.cardno);
    }
  }, [infoData]);

  useShareAppMessage(async () => {
    Taro.showLoading({ title: "加载中...", mask: true });
    const data = await getConfig();
    Taro.hideLoading();
    return {
      title: data.brandname,
      path: "/pages/index/index",
      imageUrl: data.indexpic
    };
  });

  usePullDownRefresh(async () => {
    await setup();
    Taro.stopPullDownRefresh();
  });

  useDidShow(async () => {
    await setup();
  });
  useDidHide(() => {
    return clearInterval(timer);
  });

  const setup = async () => {
    try {
      if (timer) {
        clearInterval(timer);
      }
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
    setCodeLoading(true);
    setTimeout(() => {
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
        setCodeLoading(false);
      });
    }, 30);
  };

  const viewStyles = {
    [Styles.view]: true,
    [Styles.view1]: cellLength === 1,
    [Styles.view2]: cellLength === 2,
    [Styles.view3]: cellLength === 3,
    [Styles.view4]: cellLength === 4
  };
  return (
    <View className={Styles.pages}>
      <Swiper circular indicatorDots autoplay className={Styles.swiperItem}>
        {(skeletonValue.adv_list || []).map((v: any, i: number) => (
          <SwiperItem key={i}>
            <Image src={v} mode={"widthFix"} style={{ width: "100%" }} />
          </SwiperItem>
        ))}
      </Swiper>

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
              style={{
                color: Taro.getStorageSync("color")
              }}
              onClick={() => gridGoto(skeletonValue.bonus_key)}
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
              style={{
                color: Taro.getStorageSync("color")
              }}
              onClick={() => gridGoto(skeletonValue.balance_key)}
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
              style={{
                color: Taro.getStorageSync("color")
              }}
              className={Styles.primary}
              onClick={() => gridGoto(skeletonValue.coupon_key)}
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
              onClick={() => gridGoto(skeletonValue.level_key)}
            >
              {infoData.levelname}
            </View>
          </View>
        </View>
      </View>
      {value ? (
        <View className={Styles.barcode} onClick={() => refresh("click")}>
          <Barcode text={value.paycode} width={285} height={68} />
          <View className={Styles.textStyle}>
            <AtIcon
              value="reload"
              className={cx({
                [Styles.loading]: true,
                [Styles.active]: codeLoading
              })}
              size={18}
            />
            <Text className={Styles.no}>{value.paycode}</Text>
          </View>
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
          {skeletonValue.column_info_list.map((v: any, i: number) => {
            console.log(v);
            return (
              <AtListItem
                key={i}
                title={v.title}
                extraText={v.tips}
                onClick={() => goto(v)}
              />
            );
          })}
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

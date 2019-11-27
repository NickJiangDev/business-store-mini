import Taro, { useReachBottom, useEffect, useReducer } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtProgress, AtButton } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getCenterList } from "@/services/index";
import Styles from "./index.module.scss";

// useReducer
const initialState = {
  pageindex: 1,
  pagesize: 10,
  noMoreData: false,
  list: []
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "pageUpdate":
      return {
        ...state,
        pageindex: action.pageindex
      };
    case "concatData":
      return {
        ...state,
        list: state.list.concat(action.data)
      };
    case "noMore":
      return {
        ...state,
        noMoreData: true
      };
    default:
      return state;
  }
}

const CardCenter: Taro.FunctionComponent = () => {
  const [{ pageindex, pagesize, noMoreData, list }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    fetchApi({ pageindex, pagesize });
  }, []);

  const fetchApi = async (params: any) => {
    Taro.showLoading({ title: "加载中...", mask: true });
    await getCenterList(params).then((res: any) => {
      if (!res.couponlist.length) {
        dispatch({ type: "noMore" });
      }
      dispatch({ type: "concatData", data: res.couponlist });
    });
    Taro.hideLoading();
  };
  useReachBottom(() => {
    if (noMoreData) {
      return;
    }
    const newPageindex = pageindex + 1;
    dispatch({ type: "pageUpdate", pageindex: newPageindex });
    fetchApi({ pagesize, pageindex: newPageindex });
  });
  return (
    <View className={Styles.pages}>
      {Array(13)
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
  // enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  backgroundTextStyle: "dark"
};

export default CardCenter;

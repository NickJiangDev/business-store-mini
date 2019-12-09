import Taro, { useReachBottom, useEffect, useReducer } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtProgress, AtButton } from "taro-ui";
import { getCenterList, getTicketApi } from "@/services/index";
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
    case "resetData":
      return {
        ...state,
        list: action.list,
        pageindex: initialState.pageindex,
        noMoreData: initialState.noMoreData
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

  const goGet = async (billno: string) => {
    try {
      Taro.showLoading({ title: "加载中...", mask: true });
      await getTicketApi({ billno });
      const result = await getCenterList({ pagesize, pageindex: 1 });
      dispatch({ type: "resetData", list: result.couponlist });
      Taro.showToast({ icon: "none", title: "领取成功" });
    } catch (error) {}
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
      {list.map((v: any) => {
        return (
          <View className={Styles.cell}>
            <View className={Styles.cellFlex}>
              <View className={Styles.leftCell}>
                <View className={Styles.cellInfo}>
                  <View className={Styles.cellIcon}></View>
                  <View>
                    <View>{v.couponname}</View>
                    <View className={Styles.count}>{v.couponmoney}</View>
                  </View>
                </View>
              </View>
              <View className={Styles.rightCell}>
                <View
                  className={Styles.processNum}
                >{`${v.getamount}/${v.totalamount}`}</View>
                <AtProgress
                  percent={v.getrate}
                  strokeWidth={4}
                  isHidePercent
                  color="#ff6000"
                />
                <AtButton
                  className={Styles.btn}
                  onClick={() => goGet(v.billno)}
                  disabled={v.getamount === v.totalamount}
                >
                  {v.getamount === v.totalamount ? "抢光了" : "立即抢"}
                </AtButton>
              </View>
            </View>
            <View
              className={Styles.cellDate}
            >{`有效期：${v.starttime}至${v.endtime}`}</View>
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

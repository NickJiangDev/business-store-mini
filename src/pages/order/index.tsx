import Taro, { useReachBottom, useEffect, useReducer } from "@tarojs/taro";
import { Barcode } from "taro-code";
import { View, Text } from "@tarojs/components";
import useAsyncFn from "@/shared/useAsyncFn";
import { getOrderApi } from "@/services";
import { AtTabs, AtTabsPane, AtButton, AtFloatLayout } from "taro-ui";

import Styles from "./index.module.scss";

// useReducer
const initialState = {
  pageParams1: {
    pageindex: 1,
    pagesize: 10,
    coupontype: 1
  },
  pageParams2: {
    pageindex: 1,
    pagesize: 10,
    coupontype: 2
  },
  pageParams3: {
    pageindex: 1,
    pagesize: 10,
    coupontype: 3
  },
  hasMore1: true,
  hasMore2: true,
  hasMore3: true,
  data1: [],
  data2: [],
  data3: [],
  count: 0,
  code: ""
};
function reducer(state: any, action: any) {
  switch (action.type) {
    case "updateData":
      console.log("data=", state[`data${state.count + 1}`]);
      return {
        ...state,
        [`data${state.count + 1}`]: state[`data${state.count + 1}`].concat(
          action.data
        )
      };
    case "setCount":
      return {
        ...state,
        count: action.count
      };
    case "updateParams":
      return {
        ...state,
        [`pageParams${state.count + 1}`]: {
          ...state[`pageParams${state.count + 1}`],
          pageindex: action.pageindex
        }
      };
    case "hasMoreUpdate":
      return {
        ...state,
        [`hasMore${state.count + 1}`]: false
      };
    case "setCode":
      return {
        ...state,
        code: action.code
      };
    case "reset":
      return {
        ...state,
        pageParams1: initialState.pageParams1,
        pageParams2: initialState.pageParams2,
        pageParams3: initialState.pageParams3,
        hasMore1: initialState.hasMore1,
        hasMore2: initialState.hasMore2,
        hasMore3: initialState.hasMore3,
        code: initialState.code
      };
    default:
      return state;
  }
}

const Order: Taro.FunctionComponent = () => {
  const [
    {
      pageParams1,
      pageParams2,
      pageParams3,
      data1,
      data2,
      data3,
      count,
      hasMore1,
      hasMore2,
      hasMore3,
      code
    },
    dispatch
  ] = useReducer(reducer, initialState);
  const paramsObj = {
    0: {
      params: pageParams1,
      data: data1,
      hasMore: hasMore1
    },
    1: {
      params: pageParams2,
      data: data2,
      hasMore: hasMore2
    },
    2: {
      params: pageParams3,
      data: data3,
      hasMore: hasMore3
    }
  };

  const [, getOrder] = useAsyncFn<any>(getOrderApi);
  // usePullDownRefresh(() => {
  //   debugger;
  // });

  useReachBottom(() => {
    if (paramsObj[count].hasMore) {
      Taro.showLoading({ title: "加载中...", mask: true });
      const newPageindex = paramsObj[count].params.pageindex + 1;
      dispatch({ type: "updateParams", pageindex: newPageindex });
      getOrder({ ...paramsObj[count].params, pageindex: newPageindex }).then(
        (res: any) => {
          const data = res.couponlist;
          if (!data.length) {
            dispatch({ type: "hasMoreUpdate" });
          }
          dispatch({ type: "updateData", data });
          Taro.hideLoading();
        }
      );
    }
  });

  useEffect(() => {
    dispatch({ type: "reset" });
    Taro.showLoading({ title: "加载中...", mask: true });
    getOrder({ ...paramsObj[count].params, pageindex: 1 }).then((res: any) => {
      dispatch({ type: "updateData", data: res.couponlist });
      Taro.hideLoading();
    });
  }, [count]);

  const tabList = [
    { title: "未使用" },
    { title: "已使用" },
    { title: "已过期" }
  ];

  const handleClick = (value: any) => {
    dispatch({ type: "setCount", count: value });
  };

  const useIntroduction = () => {
    console.log("ss");
  };

  const openModal = (code: string) => {
    dispatch({ type: "setCode", code });
  };

  const modalClose = () => {
    setTimeout(() => {
      dispatch({ type: "setCode", code: "" });
    }, 40);
  };

  return (
    <View className={Styles.root}>
      <AtTabs current={count} tabList={tabList} onClick={handleClick}>
        <AtTabsPane current={count} index={0}>
          {/* {
          <View className={Styles.empty}>
            <AtIcon value="shopping-bag" className={Styles.icon} />
            暂无数据
          </View>
        } */}
          <View className={Styles.tabs}>
            {Array(10)
              .fill("")
              .map(v => (
                <View className={Styles.cell}>
                  <View className={Styles.leftCell}>
                    <View className={Styles.cellInfo}>
                      <View className={Styles.cellIcon}></View>
                      <View>
                        <View>优惠券名称</View>
                        <View className={Styles.count}>￥10</View>
                      </View>
                    </View>
                    <View className={Styles.cellDate}>
                      2018-12-12至2019-12-12
                    </View>
                  </View>
                  <View className={Styles.rightCell}>
                    <AtButton
                      className={Styles.btn}
                      onClick={() =>
                        openModal(v.couponcode || "131241sadfdslkwr432wt61423")
                      }
                    >
                      立即使用
                    </AtButton>
                    <View onClick={useIntroduction}>使用说明 ></View>
                  </View>
                </View>
              ))}
          </View>
        </AtTabsPane>
        <AtTabsPane current={count} index={1}>
          <View className={Styles.tabs}>
            {Array(10)
              .fill("")
              .map(() => (
                <View className={Styles.cell}>
                  <View className={Styles.leftCell}>
                    <View className={Styles.cellInfo}>
                      <View className={Styles.cellIcon}></View>
                      <View>
                        <View>优惠券名称</View>
                        <View className={Styles.count}>￥10</View>
                      </View>
                    </View>
                    <View className={Styles.cellDate}>
                      2018-12-12至2019-12-12
                    </View>
                  </View>
                  <View className={Styles.rightCell}>
                    <AtButton className={Styles.btn} disabled={true}>
                      已使用
                    </AtButton>
                    <View>使用说明 ></View>
                  </View>
                </View>
              ))}
          </View>
        </AtTabsPane>
        <AtTabsPane current={count} index={2}>
          <View className={Styles.tabs}>
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
                <AtButton className={Styles.btn} disabled={true}>
                  已过期
                </AtButton>
                <View>使用说明 ></View>
              </View>
            </View>
          </View>
        </AtTabsPane>
        <AtFloatLayout isOpened={!!code} onClose={modalClose}>
          {code ? (
            <View className={Styles.codeCell}>
              <Barcode text={code} width={235} height={68} />
              <Text>{code}</Text>
            </View>
          ) : (
            false
          )}
        </AtFloatLayout>
      </AtTabs>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "优惠券",
  // enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  backgroundTextStyle: "dark"
};

export default Order;

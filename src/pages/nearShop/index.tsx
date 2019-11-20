import Taro, { useEffect, useReachBottom, useReducer } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtSearchBar, AtButton } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getShop } from "@/services/index";
import { initialState, reducer } from "./reducer";
import "./index.scss";

const NearShop: Taro.FunctionComponent = () => {
  const [, fetctShopApi] = useAsyncFn<any>(getShop);
  const [
    { pageindex, pagesize, inputValue, longitude, latitude, noMoreData, list },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    Taro.showLoading({ title: "加载中...", mask: true });
    Taro.getLocation({
      success: (res: any) => {
        dispatch({
          type: "jingwei",
          longitude: res.longitude,
          latitude: res.latitude
        });
        fetctShopApi({
          pagesize,
          pageindex,
          latitude: res.latitude,
          longitude: res.longitude
        }).then((listRes: any) => {
          if (listRes.length) {
            dispatch({ type: "concatList", list: listRes });
          } else {
            dispatch({ type: "noMoreData" });
          }
        });
        Taro.hideLoading();
      },
      fail: () => {
        fetctShopApi({
          pagesize,
          pageindex,
          latitude: latitude,
          longitude: longitude
        }).then((listRes: any) => {
          if (listRes.length) {
            dispatch({ type: "concatList", list: listRes });
          } else {
            dispatch({ type: "noMoreData" });
          }
        });
        Taro.hideLoading();
      }
    });
  }, []);

  useReachBottom(() => {
    if (!noMoreData) {
      dispatch({ type: "fetchMore" });
      Taro.showLoading({ title: "加载中...", mask: true });
      fetctShopApi({
        pagesize,
        pageindex: pageindex + 1,
        latitude: latitude,
        longitude: longitude
      }).then((listRes: any) => {
        if (listRes.length) {
          dispatch({ type: "concatList", list: listRes });
        } else {
          dispatch({ type: "noMoreData" });
        }
      });
      Taro.hideLoading();
    }
  });

  const onSubmit = () => {
    dispatch({ type: "pageInit" });
    fetctShopApi({
      pagesize,
      pageindex: 1,
      latitude: latitude,
      longitude: longitude,
      keyword: inputValue
    }).then((listRes: any) => {
      if (listRes.length) {
        dispatch({ type: "updateList", list: listRes });
      } else {
        dispatch({ type: "noMoreData" });
      }
    });
  };

  const onChange = (value: string) => {
    dispatch({ type: "onChange", value });
  };
  return (
    <View>
      <AtSearchBar
        showActionButton
        placeholder="请输入门店名称"
        onChange={onChange}
        value={inputValue}
        onActionClick={onSubmit}
      />
      {list.map((item: any) => (
        <View className="cell">
          <View>
            <Text className="title">{item.shopname}</Text>
            <Text className="distance">{item.distance}</Text>
            <Text className="address">{item.shopaddr}</Text>
          </View>
          <AtButton type="primary" className="btn">
            选择
          </AtButton>
        </View>
      ))}
      {!list.length && pageindex === 1 ? (
        <View className="empty">暂无数据</View>
      ) : (
        false
      )}
    </View>
  );
};

NearShop.config = {
  navigationBarTitleText: "附近门店",
  onReachBottomDistance: 50
};

export default NearShop;

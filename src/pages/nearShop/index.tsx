import Taro, { useEffect, useReachBottom, useReducer } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtSearchBar, AtButton, AtIcon } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getShop, selectShop, findCard } from "@/services/index";
import { initialState, reducer } from "./reducer";
import "./index.scss";

const NearShop: Taro.FunctionComponent = () => {
  const [, fetctShopApi] = useAsyncFn<any>(getShop);
  const [, fetchSelcetApi] = useAsyncFn<any>(selectShop);
  const [, fetchFindCardApi] = useAsyncFn<any>(findCard);
  const [
    {
      pageindex,
      pagesize,
      inputValue,
      longitude,
      latitude,
      noMoreData,
      list,
      selectstore
    },
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
          Taro.hideLoading();
          dispatch({ type: "selcetstore", selectstore: listRes.selectstore });
          if (listRes.storelist.length) {
            dispatch({
              type: "concatList",
              list: listRes.storelist
            });
          } else {
            dispatch({ type: "noMoreData" });
          }
        });
      },
      fail: () => {
        fetctShopApi({
          pagesize,
          pageindex,
          latitude: latitude,
          longitude: longitude
        }).then((listRes: any) => {
          Taro.hideLoading();
          if (listRes.storelist.length) {
            dispatch({ type: "selcetstore", selectstore: listRes.selectstore });
            dispatch({
              type: "concatList",
              list: listRes.storelist
            });
          } else {
            dispatch({ type: "noMoreData" });
          }
        });
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
        longitude: longitude,
        keyword: inputValue
      }).then((listRes: any) => {
        Taro.hideLoading();
        dispatch({ type: "selcetstore", selectstore: listRes.selectstore });
        if (listRes.storelist.length) {
          dispatch({
            type: "concatList",
            list: listRes.storelist
          });
        } else {
          dispatch({ type: "noMoreData" });
        }
      });
    }
  });

  const onSubmit = () => {
    dispatch({ type: "pageInit" });
    Taro.showLoading({ title: "加载中...", mask: true });
    fetctShopApi({
      pagesize,
      pageindex: 1,
      latitude: latitude,
      longitude: longitude,
      keyword: inputValue
    }).then((listRes: any) => {
      Taro.hideLoading();
      dispatch({ type: "selcetstore", selectstore: listRes.selectstore });
      if (listRes.storelist.length) {
        dispatch({
          type: "updateList",
          list: listRes.storelist
        });
      } else {
        dispatch({ type: "noMoreDataInit" });
      }
    });
  };

  const onChange = (value: string) => {
    dispatch({ type: "onChange", value });
  };

  const goto = async (code: string) => {
    try {
      await fetchSelcetApi({ shopcode: code });
      findCardHandler();
    } catch (error) {}
  };

  const findCardHandler = async () => {
    try {
      const phone = Taro.getStorageSync("phone");
      if (phone) {
        const { cardflag, cardid, cardno } = await fetchFindCardApi({
          mobile: phone
        });
        debugger;
        console.log(cardflag, cardid, cardno);
      } else {
        // 非法，直接清除缓存重新登录
        Taro.setStorageSync("token", "");
        Taro.setStorageSync("userinfo", {});
        Taro.setStorageSync("phone", "");
        Taro.reLaunch({ url: "/pages/index/index" });
      }
      // Taro.navigateTo({
      //   url: "/pages/bindPhone/index"
      // });
    } catch (error) {}
  };

  return (
    <View>
      <AtSearchBar
        className="search"
        showActionButton
        placeholder="请输入门店名称"
        onChange={onChange}
        value={inputValue}
        onActionClick={onSubmit}
      />
      <View className="near">
        <View className="nTitle">
          <Text>关注的门店</Text>
        </View>
        {!selectstore.shopcode ? (
          <View className="empty">
            <AtIcon value="shopping-bag" className="icon" />
            您暂未关注门店
          </View>
        ) : (
          <View className="cell">
            <View>
              <Text className="title">{selectstore.shopname}</Text>
              <Text className="distance">{selectstore.distance}</Text>
              <Text className="address">{selectstore.shopaddr}</Text>
            </View>
            <AtButton type="primary" className="btn" disabled={true}>
              已关注
            </AtButton>
          </View>
        )}
      </View>
      <View className="near">
        <View className="nTitle">
          <Text>附近的门店</Text>
        </View>
        {list.map((item: any, index: string) => (
          <View className="cell" key={index}>
            <View>
              <Text className="title">{item.shopname}</Text>
              <Text className="distance">{item.distance}</Text>
              <Text className="address">{item.shopaddr}</Text>
            </View>
            <AtButton
              type="primary"
              className="btn"
              onClick={() => goto(item.shopcode)}
            >
              关注
            </AtButton>
          </View>
        ))}
        {noMoreData && pageindex === 1 ? (
          <View className="empty">
            <AtIcon value="shopping-bag" className="icon" />
            暂无数据
          </View>
        ) : (
          false
        )}
      </View>
    </View>
  );
};

NearShop.config = {
  navigationBarTitleText: "附近门店",
  onReachBottomDistance: 50
};

export default NearShop;

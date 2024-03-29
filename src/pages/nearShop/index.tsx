import Taro, { useEffect, useReachBottom, useReducer } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtSearchBar, AtButton, AtIcon } from "taro-ui";
import useAsyncFn from "@/shared/useAsyncFn";
import { getShop, selectShop, findCard } from "@/services/index";
import { initialState, reducer } from "./reducer";
import { getPhoneHandler } from "@/helpers/getPhoneHandler";
import "./index.scss";
import findHandler from "@/helpers/findHandler";

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
      const phone = getPhoneHandler();
      const cardData = await fetchFindCardApi({
        mobile: phone
      });
      findHandler(cardData);
    } catch (error) {}
  };

  return (
    <View>
      <View className="title-flex">
        <AtSearchBar
          className="search"
          placeholder="请输入门店名称"
          onChange={onChange}
          showActionButton
          value={inputValue}
        />
        <AtButton
          className="button"
          type="primary"
          onClick={onSubmit}
          customStyle={{
            borderColor: Taro.getStorageSync("color"),
            backgroundColor: Taro.getStorageSync("color")
          }}
        >
          搜索
        </AtButton>
      </View>
      <View className="near">
        <View className="nTitle">
          <Text>关注的门店</Text>
        </View>
        {!(selectstore && selectstore.shopcode) ? (
          <View className="empty">
            <AtIcon value="shopping-bag" className="icon" />
            您暂未关注门店
          </View>
        ) : (
          <View className="cell" style={{ border: "none" }}>
            <View>
              <Text className="title">{selectstore.shopname}</Text>
              <Text className="distance">{selectstore.distance}</Text>
              <Text className="address">{selectstore.shopaddr}</Text>
            </View>
            <AtButton
              type="primary"
              className="btn"
              disabled={true}
              customStyle={{
                borderColor: Taro.getStorageSync("color"),
                backgroundColor: Taro.getStorageSync("color")
              }}
            >
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
              <View className="titleCell">
                <Text className="title">{item.shopname}</Text>
                <Text className="distance">{item.distance}</Text>
              </View>
              <Text className="address">{item.shopaddr}</Text>
            </View>
            <AtButton
              type="primary"
              className="btn"
              onClick={() => goto(item.shopcode)}
              customStyle={{
                borderColor: Taro.getStorageSync("color"),
                backgroundColor: Taro.getStorageSync("color")
              }}
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

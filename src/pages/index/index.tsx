import { ComponentType } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";
import LoginButton from "../../components/LoginButton";
import namedPng from "./images.png";

import Styles from "./index.module.scss";

type PageStateProps = {
  counterStore: {
    counter: number;
    increment: Function;
    decrement: Function;
    incrementAsync: Function;
  };
};

interface Index {
  props: PageStateProps;
}

@inject("counterStore")
@observer
class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  componentWillMount() {}

  componentWillReact() {
    console.log("componentWillReact");
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  increment = () => {
    const { counterStore } = this.props;
    counterStore.increment();
  };

  decrement = () => {
    const { counterStore } = this.props;
    counterStore.decrement();
  };

  incrementAsync = () => {
    const { counterStore } = this.props;
    counterStore.incrementAsync();
  };

  toCard = () => {
    Taro.navigateTo({
      url: "/pages/customer/index"
    });
  };

  toHooks = () => {
    Taro.navigateTo({
      url: "/pages/hooks/index"
    });
  };

  toShop = () => {
    Taro.navigateTo({
      url: "/pages/nearShop/index"
    });
  };

  toOrder = () => {
    Taro.navigateTo({
      url: "/pages/order/index"
    });
  };

  toCalendar = () => {
    Taro.navigateTo({
      url: "/pages/calendar/index"
    });
  };

  toMainCard = () => {
    Taro.navigateTo({
      url: "/pages/card/index"
    });
  };

  toCardCenter = () => {
    Taro.navigateTo({
      url: "/pages/cardCenter/index"
    });
  };
  numberLogin = (e: any) => {
    console.log(e);
  };
  render() {
    const {
      counterStore: { counter }
    } = this.props;
    return (
      <View className={Styles.index}>
        {/* <AtButton className="index" type="primary" onClick={this.toCard}>
          会员页面跳转
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toShop}>
          附近门店
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toOrder}>
          优惠券
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toCalendar}>
          签到
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toMainCard}>
          会员卡
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toCardCenter}>
          领劵中心
        </AtButton>
        <AtButton className="index" type="primary" onClick={this.toHooks}>
          Hooks页面组件
        </AtButton> */}
        <Image src={namedPng} mode="aspectFit" className={Styles.img} />
        <LoginButton />
        {/* <AtButton className="index" onClick={this.increment}>
          +
        </AtButton>
        <AtButton className="index" onClick={this.decrement}>
          -
        </AtButton>
        <AtButton className="index" onClick={this.incrementAsync}>
          Add Async
        </AtButton> */}
        {/* <Text>{counter}</Text> */}
      </View>
    );
  }
}

export default Index as ComponentType;

import { ComponentType } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";
import LoginButton from "../../components/LoginButton";
import namedPng from "@/assets/images/images.png";

import Styles from "./index.module.scss";

type PageStateProps = {
  indexStore: {
    loginStatus: boolean;
    noLogin: Function;
  };
};

interface Index {
  props: PageStateProps;
}

@inject("indexStore")
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

  componentWillMount() {
    Taro.showLoading({ title: "加载中....." });
    const token = Taro.getStorageSync("token");

    if (token) {
      Taro.redirectTo({
        url: "/pages/nearShop/index"
      });
    } else {
      this.props.indexStore.noLogin();
      Taro.hideLoading();
    }
  }

  componentWillReact() {
    console.log("componentWillReact");
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

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

  toAgreement = () => {
    Taro.navigateTo({
      url: "/pages/loginAgreement/index"
    });
  };
  numberLogin = (e: any) => {
    console.log(e);
  };
  render() {
    const {
      indexStore: { loginStatus }
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
        {loginStatus ? (
          false
        ) : (
          <View>
            <Image src={namedPng} mode="aspectFit" className={Styles.img} />
            <LoginButton />
            <View className={Styles.agreement}>
              登录即代表您已阅读并同意
              <Text className={Styles.span} onClick={this.toAgreement}>
                《用户协议及隐私政策》
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index as ComponentType;

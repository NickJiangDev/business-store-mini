import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import LoginButton from "../../components/LoginButton";
import namedPng from "@/assets/images/images.png";

import Styles from "./index.module.scss";

const Index: Taro.FunctionComponent = () => {
  const [noLogin, setNoLogin] = useState(true);
  useEffect(() => {
    Taro.showLoading({ title: "加载中....." });
    const token = Taro.getStorageSync("token");

    if (token) {
      // const { cardflag, cardid, cardno } = await fetchFindCardApi({mobile: phone});
      Taro.checkSession()
        .then(() => {
          Taro.redirectTo({
            url: "/pages/nearShop/index"
          });
        })
        .catch(() => {
          setNoLogin(false);
          Taro.hideLoading();
        });
    } else {
      setNoLogin(false);
      Taro.hideLoading();
    }
  }, []);

  const toAgreement = () => {
    Taro.navigateTo({
      url: "/pages/loginAgreement/index"
    });
  };

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
      {noLogin ? (
        false
      ) : (
        <View>
          <Image src={namedPng} mode="aspectFit" className={Styles.img} />
          <LoginButton />
          <View className={Styles.agreement}>
            登录即代表您已阅读并同意
            <Text className={Styles.span} onClick={toAgreement}>
              《用户协议及隐私政策》
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页"
};

export default Index;

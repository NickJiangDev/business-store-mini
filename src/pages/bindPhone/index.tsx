import Taro, { useState } from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";

import Styles from "./index.module.scss";

const BindPhone: Taro.FunctionComponent = () => {
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");

  const getPhoneNumber = (e: any) => {
    console.log(e);
  };
  return (
    <View>
      <View style={{ backgroundColor: "#fff" }}>
        <AtInput
          name="value"
          title="手机号"
          type="phone"
          placeholder="必填"
          value={phone || ""}
          onChange={(e: any) => setPhone(e.target.value)}
        >
          <Button
            className={Styles.bindPhone}
            open-type="getPhoneNumber"
            onGetPhoneNumber={getPhoneNumber}
          >
            手机号授权
          </Button>
        </AtInput>
        <AtInput
          name="value"
          title="卡号"
          type="number"
          placeholder="选填"
          value={card || ""}
          onChange={(e: any) => setCard(e.target.value)}
        />
      </View>
      <AtButton type="primary" className={Styles.btn}>
        确认
      </AtButton>
    </View>
  );
};

BindPhone.config = {
  navigationBarTitleText: "绑定会员卡"
};

export default BindPhone;

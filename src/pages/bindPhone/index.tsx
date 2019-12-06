import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import { getPhoneHandler } from "@/helpers/getPhoneHandler";
import useAsyncFn from "@/shared/useAsyncFn";
import { bindCardApi, findCard } from "@/services/index";
import Styles from "./index.module.scss";
import findHandler from "@/helpers/findHandler";

const BindPhone: Taro.FunctionComponent = () => {
  const [{ loading }, bindApi] = useAsyncFn<any>(bindCardApi);
  const [, fetchFindCardApi] = useAsyncFn<any>(findCard);
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");

  useEffect(() => {
    const phone = getPhoneHandler();
    setPhone(phone);
  }, []);

  const fetchBind = () => {
    bindApi({ mobile: phone, cardno: card }).then(() => {
      Taro.showLoading({ title: "加载中...", mask: true });
      fetchFindCardApi({ mobile: phone })
        .then((res: any) => {
          findHandler(res);
          Taro.hideLoading();
        })
        .catch(() => Taro.hideLoading());
    });
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
          onChange={setPhone}
          editable={false}
        />
        <AtInput
          name="value"
          title="卡号"
          type="number"
          placeholder="选填"
          value={card || ""}
          onChange={setCard}
        />
      </View>
      <AtButton
        type="primary"
        className={Styles.btn}
        onClick={fetchBind}
        loading={loading}
        disabled={!phone}
      >
        确认
      </AtButton>
    </View>
  );
};

BindPhone.config = {
  navigationBarTitleText: "绑定会员卡"
};

export default BindPhone;

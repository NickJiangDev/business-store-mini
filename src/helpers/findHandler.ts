import Taro from "@tarojs/taro";

// cardflag, cardid, cardno
interface FindHandlerProps {
  cardflag: number;
  cardid: string;
  cardno: string;
}

const redirectTo = (path: string) => {
  Taro.redirectTo({
    url: path
  });
};

// 1000—暂无返回
// 1001 –跳转到绑定会员卡界面
// 1002—提示错误信息
// 1003—跳转到会员卡界面，(查询会员卡信息和会员信息)
// 2000—跳转到关注门店界面

export const findHandler = (props: FindHandlerProps) => {
  const { cardflag, cardid, cardno } = props;
  switch (cardflag) {
    case 1001:
      redirectTo("/pages/bindPhone/index");
      break;
    case 1003:
      Taro.setStorageSync("cardid", cardid);
      Taro.setStorageSync("cardno", cardno);
      redirectTo("/pages/card/index");
      break;
    case 2000:
      redirectTo("/pages/nearshop/index");
      break;
    default:
      Taro.showToast({ icon: "none", title: "系统错误" });
      break;
  }
};

export default findHandler;

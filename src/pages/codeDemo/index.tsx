import Taro from "@tarojs/taro";
import { Barcode, QRCode } from "taro-code";
import { View, Button } from "@tarojs/components";

import "./index.scss";

function Demo() {
  return (
    <View>
      <Barcode text="hello" width={305} height={68} />
      <QRCode text="何锐" size={130} />
    </View>
  );
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Demo;

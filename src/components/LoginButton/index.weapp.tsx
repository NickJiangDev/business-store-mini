import { AtButton } from "taro-ui";

function LoginButton() {
  const setUserInfo = (res: any) => {
    const userInfo = res.detail.userInfo;
    Taro.setStorageSync("userInfo", userInfo);
  };
  return (
    <AtButton
      className="index"
      type="primary"
      openType="getUserInfo"
      onGetUserInfo={setUserInfo}
    >
      微信授权登录
    </AtButton>
    // <AtButton
    //   className="index"
    //   type="primary"
    //   openType="getPhoneNumber"
    //   onGetPhoneNumber={this.numberLogin}
    // >
    //   微信手机授权登录
    // </AtButton>
  );
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default LoginButton;

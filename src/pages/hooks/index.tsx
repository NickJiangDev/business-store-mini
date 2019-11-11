import { useState, useRouter } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

import "./index.scss";

function Counter() {
  const {
    params: { initialCount = 0 }
  } = useRouter();
  const [count, setCount] = useState(initialCount);

  return (
    <View>
      Count: {count}
      <Button onClick={() => setCount(initialCount)}>Reset</Button>
      <Button onClick={() => setCount((prevCount: number) => prevCount + 1)}>
        +
      </Button>
      <Button onClick={() => setCount((prevCount: number) => prevCount - 1)}>
        -
      </Button>
    </View>
  );
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Counter;

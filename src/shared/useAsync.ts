import Taro, { useEffect } from "@tarojs/taro";
import useAsyncFn from "./useAsyncFn";

export { AsyncState, AsyncFn } from "./useAsyncFn";

export default function useAsync<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  deps: Taro.DependencyList = []
) {
  const [state, callback] = useAsyncFn<Result, Args>(fn, deps, {
    loading: true
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}

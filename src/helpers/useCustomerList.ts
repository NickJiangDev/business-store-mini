import { useRef, useReachBottom, useDidShow, useEffect } from "@tarojs/taro";
import { getCustomersList, customersListSample } from "@/services/customer";
import useAsyncFn from "@/shared/useAsyncFn";
import useMap from "@/shared/useMap";

type CustomersResponseData = typeof customersListSample;

const defaultParam = {
  pageIndex: 1,
  pageSize: 20,
  keywords: ""
};
const useCustomerList = () => {
  const customerListRef = useRef({ customers: [], total: 0, pageIndex: 1 });
  const [fetchParams, setFetchParamsAction] = useMap(defaultParam);
  const resetPageIndex = () => {
    customerListRef.current.pageIndex = 1;
    setFetchParamsAction.set("pageIndex", customerListRef.current.pageIndex);
  };
  const [{ value: customersList = [], loading }, fetch] = useAsyncFn<
    CustomersResponseData
  >(getCustomersList);

  useEffect(() => {
    fetch({
      pageIndex: fetchParams.pageIndex,
      pageSize: fetchParams.pageSize,
      keywords: fetchParams.keywords
    }).then(data => {
      if (fetchParams.pageIndex === 1) {
        customerListRef.current.customers = data.records;
        customerListRef.current.total = data.total;
      } else {
        customerListRef.current.customers = customerListRef.current.customers.concat(
          data.records
        );
      }
    });
  }, [
    fetchParams.pageIndex,
    fetchParams.pageSize,
    fetchParams.keywords,
    fetch
  ]);
  useReachBottom(() => {
    setFetchParamsAction.set("pageIndex", ++customerListRef.current.pageIndex);
  });

  useDidShow(() => {
    customerListRef.current.pageIndex = 1;
    setFetchParamsAction.set("keywords", "");
    fetch({
      pageIndex: 1,
      pageSize: fetchParams.pageSize,
      keywords: fetchParams.keywords
    }).then(data => {
      customerListRef.current.customers = data.records;
      customerListRef.current.total = data.total;
    });
  });

  return {
    customers: customerListRef.current.customers || customersList,
    resetPageIndex,
    hasMore:
      Math.ceil(customerListRef.current.total / defaultParam.pageSize) >
      fetchParams.pageIndex,
    loading,
    fetchParams,
    setFetchParamsAction
  };
};

export default useCustomerList;

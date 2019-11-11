import { useRef, useReachBottom, useDidShow, useEffect } from "@tarojs/taro";
import useMap from "@/shared/useMap";
import { visitsSample, getVisits } from "@/services/visit";
import useAsyncFn from "@/shared/useAsyncFn";

type VisitsResponseData = typeof visitsSample;

const useVisitList = () => {
  const defaultForm = {
    pageIndex: 1,
    pageSize: 20
  };
  const visitListRef = useRef({ visitList: [], total: 0, pageIndex: 1 });
  const [fetchParams, fetchParamsAction] = useMap(defaultForm);
  const [{ value: visits = [], loading }, fetch] = useAsyncFn<
    VisitsResponseData
  >(getVisits);

  useReachBottom(() => {
    fetchParamsAction.set("pageIndex", ++visitListRef.current.pageIndex);
  });

  useEffect(() => {
    fetch(fetchParams).then(data => {
      if (fetchParams.pageIndex === 1) {
        visitListRef.current.visitList = data.records;
        visitListRef.current.total = data.total;
      } else {
        visitListRef.current.visitList = visitListRef.current.visitList.concat(
          data.records
        );
      }
    });
  }, [fetchParams.pageIndex, fetch]);

  useDidShow(() => {
    visitListRef.current.pageIndex = 1;
    fetchParamsAction.set("pageIndex", visitListRef.current.pageIndex);
    fetch(fetchParams).then(data => {
      visitListRef.current.visitList = data.records;
      visitListRef.current.total = data.total;
    });
  });

  return {
    visitList: visitListRef.current.visitList || visits,
    hasMore:
      Math.ceil(visitListRef.current.total / fetchParams.pageSize) >
      fetchParams.pageIndex,
    loading
  };
};

export default useVisitList;

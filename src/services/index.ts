import http from "@/helpers/http";

interface IGetOrderListParams {
  custId?: string;
  orderStatus: string;
  pageIndex: number;
  pageSize: number;
}

/**
 * 订单列表及检索
 * http://rapserver.sunmi.com/app/mock/169/POST/%2Forder%2Flist
 * @param {IGetOrderListParams} params
 * @returns
 */
function getOrderList(params: IGetOrderListParams) {
  return http.get("/app/mock/115/GET/%2Fapi%2Fconfig", params);
}

export { getOrderList };

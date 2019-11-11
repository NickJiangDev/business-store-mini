import objectToQueryString from "@/shared/objectToQueryString";

const toOrdersNew = (params: {
  custId: string;
  custName: string;
  custAddress: string;
}) => `/pages/order_new/index?${objectToQueryString(params)}`;

export default toOrdersNew;

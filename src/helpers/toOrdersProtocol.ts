import objectToQueryString from "@/shared/objectToQueryString";

const toOrdersProtocolPath = (params: {
  orderId: string;
  token: string;
  isShared?: any;
}) => `/pages/order_protocol/index?${objectToQueryString(params)}`;

export default toOrdersProtocolPath;

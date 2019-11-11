import objectToQueryString from "@/shared/objectToQueryString";

const toVisitNew = (params: {
  custId: string;
  custName: string;
  custAddress: string;
}) => `/pages/visit_new/index?${objectToQueryString(params)}`;

export default toVisitNew;

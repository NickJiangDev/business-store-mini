export const OrderState = {
  TOSIGN: {
    mes: "待签约",
    color: "#fa2b00",
    class: "text-bold"
  },
  SIGNED: {
    mes: "已签约",
    color: "#ff6000",
    class: "text-bold"
  },
  PAID: {
    mes: "已付款",
    color: "#333c4f",
    class: "text-bold"
  },
  DONE: {
    mes: "已交付",
    color: "#333c4f"
  },
  CANCELED: {
    mes: "已取消",
    color: "#adb1b9"
  }
};

export default OrderState;

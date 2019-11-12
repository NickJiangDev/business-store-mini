import createDes from "@/shared/Des";
import env from "./env";

const desConfig = env({
  dev: {
    Key: "wywmxxkj",
    Iv: "12345678"
  },
  test: {
    Key: "wywmxxkj",
    Iv: "12345678"
  },
  uat: {
    Key: "jihexxkj",
    Iv: "98765432"
  },
  release: {
    Key: "jihexxkj",
    Iv: "98765432"
  }
});

const Des = createDes(desConfig);

export default Des;

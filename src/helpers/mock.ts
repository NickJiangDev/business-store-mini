import createHttpUtil from "@/shared/httpUtil";
import normalizeParams from "./normalizeParams";

const mock = createHttpUtil({
  host: "http://rapserver.sunmi.com/app/mock/data",
  resolveFullURL: ({ host, method, api }) =>
    `${host}/${method}/${encodeURIComponent(api)}`,
  normalizeParams
});

export default mock;

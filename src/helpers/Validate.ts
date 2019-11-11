import { size } from "../shared/Lodash";

interface Schema {
  [key: string]: any[];
}

export default class Yup {
  schema: Schema;
  static data: any;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  validate(data: any = {}) {
    const error: any[] = [];
    Yup.data = data;
    Object.keys(this.schema).forEach(key => {
      const value = data[key];
      if (!Array.isArray(this.schema[key])) {
        throw Error(
          "数据格式错误，您的schema应该是{phone:[[Yup.required, 请输入手机号码]]}"
        );
      }
      this.schema[key].forEach(rule => {
        const validateFunc = rule[0];
        const errorMessage = rule[1];
        const result = validateFunc(value);
        if (!result) {
          error.push({ key, message: errorMessage });
        }
      });
    });
    return error;
  }
  static required(value: any) {
    return size(value) > 0;
  }
  static number(value: string) {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  }
  static digits(value: string) {
    return /^\d+$/.test(value);
  }
  static tel(value: string) {
    return /^1[34578]\d{9}$/.test(value);
  }
  static equalTo(path: any) {
    return (value: any) => {
      return value === Yup.data[path];
    };
  }
  static contains(param: string) {
    return (value: any) => value.indexOf(param) >= 0;
  }
  static minlength(num: number) {
    return (value: any) => value.length >= num;
  }
  static maxlength(num: number) {
    return (value: any) => value.length <= num;
  }
  static email(value: string) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value
    );
  }
}

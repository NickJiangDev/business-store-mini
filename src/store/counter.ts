import { observable } from "mobx";
const indexStore = observable({
  loginStatus: true,
  noLogin() {
    this.loginStatus = false;
  }
});
export default indexStore;

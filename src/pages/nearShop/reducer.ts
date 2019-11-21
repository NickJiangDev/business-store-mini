// useReducer
export const initialState = {
  pageindex: 1,
  inputValue: "",
  latitude: 0,
  longitude: 0,
  pagesize: 10,
  noMoreData: false,
  list: []
};

export function reducer(state: any, action: any) {
  switch (action.type) {
    case "jingwei":
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude
      };
    case "onChange":
      return {
        ...state,
        inputValue: action.value
      };
    case "pageInit":
      return {
        ...state,
        pageindex: initialState.pageindex,
        noMoreData: false
      };
    case "fetchMore":
      return {
        ...state,
        pageindex: state.pageindex + 1
      };
    case "concatList":
      return {
        ...state,
        list: state.list.concat(action.list)
      };
    case "updateList":
      return {
        ...state,
        list: action.list
      };
    case "noMoreData":
      return {
        ...state,
        noMoreData: true,
        list: []
      };
    default:
      return state;
  }
}

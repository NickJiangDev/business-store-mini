const normalizeWxResponse = result => {
  const { code, data, msg } = result.data;
  return {
    ...result,
    data,
    statusCode: code,
    errMsg: msg
  };
};

export default normalizeWxResponse;

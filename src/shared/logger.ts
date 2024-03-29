/* eslint-disable no-console */

const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === "production") {
      console.info(...args);
    } else {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === "production") {
      console.warn(...args);
    } else {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === "production") {
      console.error(...args);
    } else {
      console.error(...args);
    }
  }
};

export default logger;

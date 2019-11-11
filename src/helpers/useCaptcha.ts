import { useEffect, useRef } from "@tarojs/taro";
import useMap from "@/shared/useMap";
import { getSMSCaptcha } from "@/services/user";

// LOGIN
const useCaptcha = ({ type }) => {
  // TODO: ref类型定义
  const captchaRef = useRef(null as any);
  const [captcha, captchaActions] = useMap({
    clicked: false,
    disabled: false,
    second: 60
  });

  useEffect(() => {
    if (!captcha.clicked) {
      return;
    }
    const timer = setInterval(() => {
      if (captchaRef.current.second > 0) {
        captchaRef.current.second = captcha.second - 1;
        captchaActions.set("second", captchaRef.current.second);
      } else {
        captchaActions.reset();
      }
    }, 1000);
    captchaRef.current = captcha;
    return () => clearInterval(timer);
  }, [captcha, captchaActions]);

  const send = (mobileNo: string) => {
    if (!captcha.clicked) {
      getSMSCaptcha({ mobileNo, type })
        .then(() => {
          captchaActions.set("clicked", true);
          captchaActions.set("disabled", true);
        })
        .catch(() => {
          // TODO: 提示文字的统一
          // 10002
          // 10003
          captchaActions.reset();
        });
    }
  };
  const text = captcha.clicked ? `重新获取 ${captcha.second}s` : "获取验证码";
  return { text, disabled: captcha.disabled, send };
};

export default useCaptcha;

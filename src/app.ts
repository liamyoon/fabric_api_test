import {apiTest} from './apiTest';
import {createToken, setToken} from './utils';
import CustomError from './CustomError';
const token = process.env.TOKEN;

(async () => {
  // set token axios header
  // 기존에 저장된 토큰이 있는 경우 재사용.
  setToken(token || await createToken());

  try {
    await apiTest();
  } catch(e) {
    const error = e as CustomError;
    if (error.status === 401 || error.status === 403) {
      console.log('토큰 재발급');
      // 에러 발생 시 토큰 재발급 후 리트라이
      const newToken = await createToken();
      setToken(newToken);
      await apiTest();
    }

    console.log('error', error.error || error);
  }
})();

import {apiTest} from './apiTest';
import {createToken, setToken} from './utils';

(async () => {
  // set token axios header
  setToken(await createToken());

  // api test
  await apiTest();
})();

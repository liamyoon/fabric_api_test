import axios, {AxiosError, AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {WebDriver} from 'selenium-webdriver/lib/webdriver';
import {Browser, Builder, By, until} from 'selenium-webdriver';
import fireFox from 'selenium-webdriver/firefox';

const USER_ID = process.env.USER_ID;
const PASSWORD = process.env.PASSWORD;

const option = {
  baseURL: 'https://api.powerbi.com/v1.0',
};
export const request: AxiosInstance = axios.create(option);

export const setToken = (token) => {
  request.interceptors.request.use( (config: InternalAxiosRequestConfig) => {
    const headers = new AxiosHeaders({
      ...config.headers,
      Authorization: `Bearer ${token}`,
    });
    return {
      ...config,
      headers,
    };
  });
};

const errorHandler = async (error: AxiosError) => {
  const { response } = error;
  if (response) {
    if (response.status === 403) {
      setToken(await createToken());
    }
  }

  throw new Error(error.message);
};

request.interceptors.response.use((response) => response, errorHandler);

// page가 정상적으로 로드 될동안 wait 처리
const pageLoaded = (d) => {
  return d.wait(function () {
    return d.executeScript('return document.readyState').then(function (readyState) {
      return readyState === 'complete';
    });
  }, 6000);
};

const driverIsAlive = async (driver: WebDriver) => {
  try {
    await driver.getTitle();
    return true;
  } catch(e) {
    return false;
  }
};

export const createToken = async () => {
  const driver =
    await new Builder().forBrowser(Browser.FIREFOX) // browser 설정
      .setFirefoxOptions(
        new fireFox.Options()
          .addArguments('--headless') // headless 설정
          .windowSize({ width: 640, height: 480 })
      ).build();
  try {
    await driver.get('https://app.fabric.microsoft.com/'); // fabric 페이지 접근

    await driver.wait(until.elementIsVisible(await driver.findElement(By.id('email'))), 6000);

    // email 주소 입력
    const email = await driver.findElement(By.id('email'));
    email.sendKeys(USER_ID);

    // 다음 버튼 클릭
    await driver.findElement(By.id('submitBtn')).click();
    await driver.sleep(1000); // wait 처리가 정상적으로 동작안하여 1초간 강제 wait
    await pageLoaded(driver);

    // 비밀번호 입력
    const password = await driver.findElement(By.css('input[type=password]'));
    password.sendKeys(PASSWORD);

    // 로그인 버튼 클릭
    await driver.findElement(By.css('input[type=submit]')).click();
    await pageLoaded(driver);

    // 자동로그인 관련 메뉴 submit
    await driver.findElement(By.css('input[type=submit]')).click();
    await driver.sleep(1000);
    await pageLoaded(driver);

    // 관리자 콘솔에서 토큰 정보 리턴
    return await driver.executeScript('return powerBIAccessToken');
  } finally {
    if (await driverIsAlive(driver)) {
      await driver.quit();
    }
  }
};

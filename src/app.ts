import axios from 'axios';
import { Builder, Browser, By, until } from 'selenium-webdriver';
import fireFox from 'selenium-webdriver/firefox.js';



const USER_ID = process.env.USER_ID;
const PASSWORD = process.env.PASSWORD;

let request: any = undefined;

const generateAxios = (token) => {
  const option = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    baseURL: 'https://api.powerbi.com/v1.0',
  };
  request = axios.create(option);

  return request;
}


const getReports = async () => {
  return await request.get(
    '/myorg/reports',
  );
};

const apiTest = async () => {
  const response = await getReports();
  console.log(response.data);
};

// page가 정상적으로 로드 될동안 wait 처리
const pageLoaded = (d) => {
  return d.wait(function () {
    return d.executeScript('return document.readyState').then(function (readyState) {
      return readyState === 'complete';
    });
  }, 6000);
};

(async () => {
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
    const token = await driver.executeScript('return powerBIAccessToken');

    console.log('token', token);

    // set token axios header
    generateAxios(token);

    // api test
    await apiTest();
  } finally {
    await driver.quit();
  }
})();

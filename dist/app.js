"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const selenium_webdriver_1 = require("selenium-webdriver");
const firefox_js_1 = __importDefault(require("selenium-webdriver/firefox.js"));
const USER_ID = process.env.USER_ID;
const PASSWORD = process.env.PASSWORD;
let request = undefined;
const generateAxios = (token) => {
    const option = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        baseURL: 'https://api.powerbi.com/v1.0',
    };
    request = axios_1.default.create(option);
    return request;
};
const getReports = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield request.get('/myorg/reports');
});
const apiTest = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getReports();
    console.log(response.data);
});
// page가 정상적으로 로드 될동안 wait 처리
const pageLoaded = (d) => {
    return d.wait(function () {
        return d.executeScript('return document.readyState').then(function (readyState) {
            return readyState === 'complete';
        });
    }, 6000);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.FIREFOX) // browser 설정
        .setFirefoxOptions(new firefox_js_1.default.Options()
        .addArguments('--headless') // headless 설정
        .windowSize({ width: 640, height: 480 })).build();
    try {
        yield driver.get('https://app.fabric.microsoft.com/'); // fabric 페이지 접근
        yield driver.wait(selenium_webdriver_1.until.elementIsVisible(yield driver.findElement(selenium_webdriver_1.By.id('email'))), 6000);
        // email 주소 입력
        const email = yield driver.findElement(selenium_webdriver_1.By.id('email'));
        email.sendKeys(USER_ID);
        // 다음 버튼 클릭
        yield driver.findElement(selenium_webdriver_1.By.id('submitBtn')).click();
        yield driver.sleep(1000); // wait 처리가 정상적으로 동작안하여 1초간 강제 wait
        yield pageLoaded(driver);
        // 비밀번호 입력
        const password = yield driver.findElement(selenium_webdriver_1.By.css('input[type=password]'));
        password.sendKeys(PASSWORD);
        // 로그인 버튼 클릭
        yield driver.findElement(selenium_webdriver_1.By.css('input[type=submit]')).click();
        yield pageLoaded(driver);
        // 자동로그인 관련 메뉴 submit
        yield driver.findElement(selenium_webdriver_1.By.css('input[type=submit]')).click();
        yield driver.sleep(1000);
        yield pageLoaded(driver);
        // 관리자 콘솔에서 토큰 정보 리턴
        const token = yield driver.executeScript('return powerBIAccessToken');
        console.log('token', token);
        // set token axios header
        generateAxios(token);
        // api test
        yield apiTest();
    }
    finally {
        yield driver.quit();
    }
}))();

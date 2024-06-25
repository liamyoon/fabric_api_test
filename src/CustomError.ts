import { AxiosResponse } from 'axios';

class CustomError extends Error {
  public error = {};
  public code?: number;
  public status?: number;
  public reason = '';

  constructor(response?: AxiosResponse) {
    super(JSON.stringify(response?.data));

    if (!response) {
      this.error = { code: 'SERVER_ERR', message: '서버 오류 발생', title: '' };
    } else {
      const data = response.data;

      const error =
        typeof data === 'string' || !data.message
          ? { code: 'SERVER_ERR', message: '서버 오류 발생', title: '' }
          : data;

      error.status = response.status;
      if (response.status === 401) {
        error.title = '로그아웃 상태';
        error.message =
          '로그인 되지 않거나 세션이 만료되었습니다. 다시 로그인해 주세요';
      } else if (response.status === 403) {
        error.title = '접근 불가 상태';
        error.message = '사용자 권한이 없어 접근 불가 합니다.';
      }

      this.error = error;
      this.code = error.code;
      this.reason = error.message;
      this.status = response.status;
    }
  }
}

export default CustomError;

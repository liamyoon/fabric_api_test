declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      USER_ID: string;
      PASSWORD: string;
      // add more environment variables and their types here
    }
  }
}

export {}

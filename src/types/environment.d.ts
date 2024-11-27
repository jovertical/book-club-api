declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_HOST?: string;
      APP_PORT?: string;
      DATABASE_URL?: string;
    }
  }
}

export {};

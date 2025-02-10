export const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-production-url'
    : 'http://localhost:3005'
};

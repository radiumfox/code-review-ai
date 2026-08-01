export const API_ROUTES = {
  reviewsList: '/api/reviews',
  createReview: '/api/reviews/create',
  modelsListOpenai: '/api/models/openai',
  auth: '/api/auth',
  authE2E: '/api/auth/e2e-signin',
} as const;

export const ROUTES = {
  main: '/',
  models: '/models',
  login: '/login',
};
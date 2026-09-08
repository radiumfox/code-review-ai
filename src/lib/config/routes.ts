export const API_ROUTES = {
  reviewsList: '/api/reviews',
  createReview: '/api/reviews/create',
  modelsListOpenai: '/api/models/openai',
  auth: '/api/auth',
  authE2E: '/api/auth/e2e-signin',
  updateUserModel: '/api/users/model',
} as const;

export const ROUTES = {
  main: '/',
  login: '/login',
};
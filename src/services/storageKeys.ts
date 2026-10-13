export const STORAGE_KEYS = {
  session: '@taskflow:session',
  tasks: '@taskflow:tasks',
  theme: '@taskflow:theme',
  treatment: (userId: number): string => `@taskflow:treatment:${userId}`,
};

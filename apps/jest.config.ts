import type { Config } from 'jest';
const config: Config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  collectCoverageFrom: ["apps/**/src/**/*.{ts,tsx}","packages/**/src/**/*.{ts,tsx}"],
};
export default config;

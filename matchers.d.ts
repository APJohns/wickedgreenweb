import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'bun:test' {
  type Matchers<T> = TestingLibraryMatchers<typeof expect.stringContaining, T>;
  type AsymmetricMatchers = TestingLibraryMatchers;
}

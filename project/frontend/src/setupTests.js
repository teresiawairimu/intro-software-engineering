// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-fetch-mock';

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { this.callback([{ isIntersecting: true }]); }
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;
import api_base_url from './apiConfig';

describe('api_base_url', () => {
  test('exports the correct base URL', () => {
    expect(api_base_url).toBe("http://localhost:5000");
  });
});

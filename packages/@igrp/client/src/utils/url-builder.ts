/**
 * Type for URL query parameters
 */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Safely joins a base URL with an endpoint, handling "/" characters properly
 * @param baseUrl The base URL
 * @param endpoint The endpoint to join
 * @returns Properly joined URL
 */
export function joinUrl(baseUrl: string, endpoint: string): string {
  // Remove trailing slash from baseUrl if it exists
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure endpoint starts with slash if it doesn't already
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
}

/**
 * Builds a URL with query parameters, filtering out undefined/null values
 * @param baseUrl The base URL
 * @param params Object containing query parameters
 * @returns Complete URL with query string
 */
export function buildUrlWithParams(baseUrl: string, params: QueryParams = {}): string {
  const url = new URL(baseUrl, 'http://localhost'); // Use dummy base for relative URLs
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  // Return the pathname + search for relative URLs, or full URL for absolute URLs
  return baseUrl.startsWith('http') ? url.toString() : `${url.pathname}${url.search}`;
}

/**
 * Builds query string from parameters object
 * @param params Object containing query parameters
 * @returns Query string (without leading ?)
 */
export function buildQueryString(params: QueryParams = {}): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Builds a URL with path parameters and query parameters
 * @param baseUrl The base URL with path parameter placeholders (e.g., '/api/users/:id')
 * @param pathParams Object containing path parameters
 * @param queryParams Object containing query parameters
 * @returns Complete URL with path and query parameters
 */
export function buildUrlWithPathAndQuery(
  baseUrl: string,
  pathParams: Record<string, string | number> = {},
  queryParams: QueryParams = {}
): string {
  let url = baseUrl;
  
  // Replace path parameters
  Object.entries(pathParams).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  
  // Add query parameters
  const queryString = buildQueryString(queryParams);
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}
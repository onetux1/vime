import {
  isString, isArray, isNullOrUndefined, isObject, isUndefined,
} from './unit';
import { IS_CLIENT } from './support';

/**
 * Attempt to parse json into a POJO.
 */
export function tryParseJSON(json: string): object | undefined {
  if (!isString(json)) return undefined;

  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

/**
 * Check if the given input is json or a plain object.
 */
export const isObjOrJSON = (input: any): boolean => !isNullOrUndefined(input)
  && (isObject(input) || (isString(input) && input.startsWith('{')));

/**
 * If an object return otherwise try to parse it as json.
 */
export const objOrParseJSON = (input: any): object | undefined => (isObject(input)
  ? input
  : tryParseJSON(input));

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const loadImage = (src: string, minWidth = 1): Promise<HTMLImageElement> => new Promise(
  (resolve, reject) => {
    const image = new Image();
    const handler = () => {
      delete image.onload;
      delete image.onerror;
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };
    Object.assign(image, { onload: handler, onerror: handler, src });
  },
);

/**
 * Tries to parse json and return a object.
 */
export const decodeJSON = (data: any): object | undefined => {
  if (!isObjOrJSON(data)) return undefined;
  return objOrParseJSON(data);
};

/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 */
export const tryDecodeURIComponent = (component: string, fallback = ''): string => {
  if (!IS_CLIENT) return fallback;
  try {
    return window.decodeURIComponent(component);
  } catch (e) {
    return fallback;
  }
};

/**
 * Returns a simple key/value map and duplicate keys are merged into an array.
 *
 * @see https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
 */
const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
export const parseQueryString = (qs?: string): Params => {
  const params = Object.create(null);

  if (isUndefined(qs)) return params;

  let match;

  // eslint-disable-next-line no-cond-assign,@stencil/strict-boolean-conditions
  while ((match = QUERY_STRING_REGEX.exec(qs!))) {
    const name = tryDecodeURIComponent(match[1], match[1]).replace('[]', '');

    const value = isString(match[2])
      ? tryDecodeURIComponent(match[2].replace(/\+/g, ' '), match[2])
      : '';

    const currValue = params[name];

    if (currValue && !isArray(currValue)) params[name] = [currValue];

    currValue ? params[name].push(value) : (params[name] = value);
  }

  return params;
};

/**
 * Serializes the given params into a query string.
 */
export type Params = Record<string, string | number | boolean | string[]>;
export const serializeQueryString = (params: Params): string => {
  const qs: string[] = [];

  const appendQueryParam = (param: string, v: string) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };

  Object.keys(params).forEach((param) => {
    const value = params[param];

    if (isNullOrUndefined(value)) return;

    if (isArray(value)) {
      (value as string[]).forEach((v: string) => appendQueryParam(param, v));
    } else {
      appendQueryParam(param, value as string);
    }
  });

  return qs.join('&');
};

/**
 * Notifies the browser to start establishing a connection with the given URL.
 */
export const preconnect = (
  url: string,
  rel: 'preconnect' | 'prefetch' | 'preload' = 'preconnect',
  as?: string,
): boolean => {
  if (!IS_CLIENT) return false;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  if (!isUndefined(as)) link.as = as!;
  link.crossOrigin = 'true';

  document.head.append(link);

  return true;
};

/**
 * Safely appends the given query string to the given URL.
 */
export const appendQueryStringToURL = (url: string, qs?: string) => {
  if (isUndefined(qs) || qs!.length === 0) return url;
  const mainAndQuery = url.split('?', 2);
  return mainAndQuery[0]
    + (!isUndefined(mainAndQuery[1]) ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`);
};

/**
 * Serializes the given params into a query string and appends them to the given URL.
 */
export const appendParamsToURL = (
  url: string,
  params: Params,
) => appendQueryStringToURL(url, serializeQueryString(params));

/**
 * Tries to convert a query string into a object.
 */
export const decodeQueryString = (qs: string): Params | undefined => {
  if (!isString(qs)) return undefined;
  return parseQueryString(qs);
};

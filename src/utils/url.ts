import { NextRequest } from 'next/server';

/**
 * Build a path string from a path and a hash/search object
 * @param path
 * @param hash
 * @param search
 */
export const pathString = (
  path: string,
  {
    hash = '',
    search = '',
  }: {
    hash?: string;
    search?: string;
  } = {},
) => {
  const tempBase = 'https://a.com';
  const url = new URL(path, tempBase);

  if (hash) url.hash = hash;
  if (search) url.search = search;
  return url.toString().replace(tempBase, '');
};


/**
 * 获取请求的URL
 * 该函数旨在构造一个完整的请求URL，优先使用代理服务器提供的主机和协议信息
 * 如果代理服务器未提供这些信息，则直接使用Next.js提供的URL
 *
 * @param req NextRequest类型的请求对象，包含请求的相关信息
 * @returns 返回一个URL对象，表示完整的请求URL
 */
export const getClientRequestUrl = (req: NextRequest) => {
  const host = req.headers.get('x-forwarded-host');
  const proto = req.headers.get('x-forwarded-proto');
  if (host && proto) {
    return new URL(req.nextUrl.pathname, `${proto}://${host}`);
  }
  else {
    return req.nextUrl;
  }
};

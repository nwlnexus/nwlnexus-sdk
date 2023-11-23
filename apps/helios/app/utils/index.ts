import { getClientIPAddress } from 'remix-utils/get-client-ip-address';
import { ulidFactory } from 'ulid-workers';
import type { AppLoadContext } from '@remix-run/cloudflare';

const getOS = () => {
  let userAgent = window.navigator.userAgent.toLowerCase(),
    macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
    windowsPlatforms = /(win32|win64|windows|wince)/i,
    iosPlatforms = /(iphone|ipad|ipod)/i,
    os = null;

  if (macosPlatforms.test(userAgent)) {
    os = 'macos';
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios';
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (!os && /linux/.test(userAgent)) {
    os = 'linux';
  }

  return os;
};

const slugify = (str: string) => {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
    .replace(/^-+|-+$/g, ''); // remove leading and trailing hyphens
};

const getIPAddress = async (req: Request, ctx: AppLoadContext): Promise<string> => {
  let cIP = getClientIPAddress(req.headers);
  if (!cIP) {
    const q = await fetch('https://api.ipify.org?format=json');
    const { ip } = await q.json<{ ip: string }>();
    cIP = ip;
  }
  return cIP;
};
const ulid = ulidFactory();

export { getOS, getIPAddress, slugify, ulid };

// the code below can only be modified with commercial license
// if you want to use it in the commercial usage
// please contact us for more information: hello@lobehub.com
import { isQinglingCustomized } from "./version";

export const LOBE_CHAT_CLOUD = isQinglingCustomized ? 'QINGLING Copilot Cloud' : 'LobeChat Cloud';

export const BRANDING_NAME = isQinglingCustomized ? '清岭智脑' : 'LobeChat';
export const BRANDING_LOGO_URL = isQinglingCustomized ? '/qingling-icon.png?v=1' : '';

export const ORG_NAME = isQinglingCustomized ? '深圳市清岭技术有限公司' : 'LobeHub';

export const BRANDING_URL = {
  help: undefined,
  privacy: undefined,
  terms: undefined,
};

export const SOCIAL_URL = {
  discord: 'https://discord.gg/AYFPHvv2jT',
  github: 'https://github.com/lobehub',
  medium: 'https://medium.com/@lobehub',
  x: 'https://x.com/lobehub',
  youtube: 'https://www.youtube.com/@lobehub',
};

export const BRANDING_EMAIL = isQinglingCustomized ? {
  business: 'kf@qingling-ai.com',
  support: 'kf@qingling-ai.com',
} : {
  business: 'hello@lobehub.com',
  support: 'support@lobehub.com',
};

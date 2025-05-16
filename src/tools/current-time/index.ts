import { BuiltinToolManifest } from '@/types/tool';

import { systemPrompt } from './systemRole';

export const CurrentTimeManifest: BuiltinToolManifest = {
  api: [],
  identifier: 'qingling-current-time-assistant',
  meta: {
    avatar: '⏰',
    description: 'A plugin to provide current time information',
    tags: ['time'],
    title: 'Current Time Assistant',
  },
  systemRole: systemPrompt,
  type: 'builtin',
};

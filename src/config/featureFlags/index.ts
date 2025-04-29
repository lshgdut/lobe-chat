import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { appEnv } from '@/config/app';
import { merge } from '@/utils/merge';

import { DEFAULT_FEATURE_FLAGS, QINGLING_FEATURE_FLAGS, mapFeatureFlagsEnvToState } from './schema';
import { parseFeatureFlag } from './utils/parser';

const env = createEnv({
  runtimeEnv: {
    FEATURE_FLAGS: process.env.FEATURE_FLAGS,
  },

  server: {
    FEATURE_FLAGS: z.string().optional(),
  },
});

export const getServerFeatureFlagsValue = () => {
  const flags = parseFeatureFlag(env.FEATURE_FLAGS);

  if (appEnv.QINGLING_CUSTOMIZED ) {
    return merge(
      merge(DEFAULT_FEATURE_FLAGS, QINGLING_FEATURE_FLAGS),
      flags
    )
  }

  return merge(DEFAULT_FEATURE_FLAGS, flags);
};

export const serverFeatureFlags = () => {
  const serverConfig = getServerFeatureFlagsValue();

  return mapFeatureFlagsEnvToState(serverConfig);
};

export * from './schema';

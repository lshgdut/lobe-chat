import { edgeClient } from '@/libs/trpc/client';
import { globalHelpers } from '@/store/global/helpers';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { DiscoverPlugintem } from '@/types/discover';
import { convertOpenAIManifestToLobeManifest, getToolManifest } from '@/utils/toolManifest';

class ToolService {
  getToolList = async (): Promise<DiscoverPlugintem[]> => {
    const locale = globalHelpers.getCurrentLanguage();

    const { enablePlugins } = useServerConfigStore(featureFlagsSelectors);
    if (!enablePlugins) {
      return [];
    }

    const data = await edgeClient.market.getPluginIndex.query({ locale });

    return data.plugins;
  };

  getToolManifest = getToolManifest;
  convertOpenAIManifestToLobeManifest = convertOpenAIManifestToLobeManifest;
}

export const toolService = new ToolService();

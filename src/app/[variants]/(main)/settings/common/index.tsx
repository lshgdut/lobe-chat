import Appearance from './features/Appearance';
import ChatAppearance from './features/ChatAppearance';
import { serverFeatureFlags } from '@/config/featureFlags';
import Common from './features/Common';

const Page = () => {
  const qinglingCustomized = serverFeatureFlags().qinglingCustomized
  return (
    <>
      {!qinglingCustomized && <Common />}
      <Appearance />
      <ChatAppearance />
    </>
  );
};

Page.displayName = 'CommonSetting';

export default Page;

import { serverFeatureFlags } from '@/config/featureFlags';
import Common from './features/Common';
import Theme from './features/Theme';

const Page = () => {
  const qinglingCustomized = serverFeatureFlags().qinglingCustomized
  return (
    <>
      <Theme />
      {!qinglingCustomized && <Common />}
    </>
  );
};

Page.displayName = 'CommonSetting';

export default Page;

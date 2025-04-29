import Appearance from './features/Appearance';
import ChatAppearance from './features/ChatAppearance';
import { appEnv } from '@/config/app'
import Common from './features/Common';

const Page = () => {
  const qinglingCustomized = appEnv.NEXT_PUBLIC_QINGLING_CUSTOMIZED
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

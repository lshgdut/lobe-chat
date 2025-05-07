'use client';

import Appearance from './features/Appearance';
import ChatAppearance from './features/ChatAppearance';
import { useServerConfigStore } from '@/store/serverConfig';

import Common from './features/Common';

const Page = () => {
  const { isQinglingCustomized } = useServerConfigStore((s) => s.serverConfig);
  return (
    <>
      {!isQinglingCustomized && <Common />}
      <Appearance />
      <ChatAppearance />
    </>
  );
};

Page.displayName = 'CommonSetting';

export default Page;

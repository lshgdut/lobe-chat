'use client';

import { useServerConfigStore } from '@/store/serverConfig';

import Common from './features/Common';
import Theme from './features/Theme';

const Page = () => {
  const { isQinglingCustomized } = useServerConfigStore((s) => s.serverConfig);
  return (
    <>
      <Theme />
      {!isQinglingCustomized && <Common />}
    </>
  );
};

Page.displayName = 'CommonSetting';

export default Page;

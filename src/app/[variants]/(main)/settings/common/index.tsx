import { appEnv } from '@/config/app'
import Common from './features/Common';
import Theme from './features/Theme';

const Page = () => {
  const qinglingCustomized = appEnv.NEXT_PUBLIC_QINGLING_CUSTOMIZED
  return (
    <>
      <Theme />
      {!qinglingCustomized && <Common />}
    </>
  );
};

Page.displayName = 'CommonSetting';

export default Page;

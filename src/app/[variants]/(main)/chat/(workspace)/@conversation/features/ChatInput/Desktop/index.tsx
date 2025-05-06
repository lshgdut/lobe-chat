'use client';

import { memo } from 'react';

import { ActionKeys } from '@/features/ChatInput/ActionBar/config';
import DesktopChatInput, { FooterRender } from '@/features/ChatInput/Desktop';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useServerConfigStore } from '@/store/serverConfig';

import Footer from './Footer';
import TextArea from './TextArea';

const leftActions: ActionKeys[] = [
  'model',
  'search',
  'fileUpload',
  'knowledgeBase',
  'params',
  'history',
  'stt',
  'tools',
  'mainToken',
];

const qinglingLeftActions: ActionKeys[] = [
  'model',
  'search',
  'fileUpload',
  'knowledgeBase',
  // 'params',
  // 'history',
  'stt',
  'tools',
  // 'mainToken',
];

const rightActions = ['clear'] as ActionKeys[];

const renderTextArea = (onSend: () => void) => <TextArea onSend={onSend} />;
const renderFooter: FooterRender = ({ expand, onExpandChange }) => (
  <Footer expand={expand} onExpandChange={onExpandChange} />
);

const Desktop = memo(() => {
  const { isQinglingCustomized } = useServerConfigStore((s)=>s.serverConfig)
  const [inputHeight, updatePreference] = useGlobalStore((s) => [
    systemStatusSelectors.inputHeight(s),
    s.updateSystemStatus,
  ]);

  return (
    <DesktopChatInput
      inputHeight={inputHeight}
      leftActions={isQinglingCustomized ? qinglingLeftActions : leftActions}
      onInputHeightChange={(height) => {
        updatePreference({ inputHeight: height });
      }}
      renderFooter={renderFooter}
      renderTextArea={renderTextArea}
      rightActions={rightActions}
    />
  );
});

export default Desktop;

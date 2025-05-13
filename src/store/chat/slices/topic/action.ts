/* eslint-disable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */
// Note: To make the code more logic and readable, we just disable the auto sort key eslint rule
// DON'T REMOVE THE FIRST LINE
import isEqual from 'fast-deep-equal';
import { t } from 'i18next';
import useSWR, { SWRResponse, mutate } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { chainSummaryTitle } from '@/chains/summaryTitle';
import { message } from '@/components/AntdStaticMethods';
import { LOADING_FLAT } from '@/const/message';
import { TraceNameMap } from '@/const/trace';
import { useClientDataSWR } from '@/libs/swr';
import { chatService } from '@/services/chat';
import { messageService } from '@/services/message';
import { topicService } from '@/services/topic';
import { CreateTopicParams } from '@/services/topic/type';
import type { ChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { systemAgentSelectors } from '@/store/user/selectors';
import { ChatMessage } from '@/types/message';
import { ChatTopic } from '@/types/topic';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import { chatSelectors } from '../message/selectors';
import { ChatTopicDispatch, topicReducer } from './reducer';
import { topicSelectors } from './selectors';

const n = setNamespace('t');

const SWR_USE_FETCH_TOPIC = 'SWR_USE_FETCH_TOPIC';
const SWR_USE_SEARCH_TOPIC = 'SWR_USE_SEARCH_TOPIC';

export interface ChatTopicAction {
  favoriteTopic: (id: string, favState: boolean) => Promise<void>;
  openNewTopicOrSaveTopic: () => Promise<void>;
  refreshTopic: () => Promise<void>;
  removeAllTopics: () => Promise<void>;
  removeSessionTopics: () => Promise<void>;
  removeTopic: (id: string) => Promise<void>;
  removeUnstarredTopic: () => Promise<void>;
  saveToTopic: () => Promise<string | undefined>;
  createTopic: () => Promise<string | undefined>;

  autoRenameTopicTitle: (id: string) => Promise<void>;
  duplicateTopic: (id: string) => Promise<void>;
  summaryTopicTitle: (topicId: string, messages: ChatMessage[]) => Promise<void>;
  switchTopic: (id?: string, skipRefreshMessage?: boolean) => Promise<void>;
  updateTopicTitle: (id: string, title: string) => Promise<void>;
  useFetchTopics: (enable: boolean, sessionId: string) => SWRResponse<ChatTopic[]>;
  useSearchTopics: (keywords?: string, sessionId?: string) => SWRResponse<ChatTopic[]>;

  internal_updateTopicTitleInSummary: (id: string, title: string) => void;
  internal_updateTopicLoading: (id: string, loading: boolean) => void;
  internal_createTopic: (params: CreateTopicParams) => Promise<string>;
  internal_updateTopic: (id: string, data: Partial<ChatTopic>) => Promise<void>;
  internal_dispatchTopic: (payload: ChatTopicDispatch, action?: any) => void;
}

/**
 * TODO(lsh): 针对深度思考模型，需要处理 <think> 标签</think>
 *
 * 移除字符串中的思考文本
 * 该函数用于移除用户输入内容中的“思考”部分，以便进行后续处理
 * 如果内容以 "<think>" 开头，并在适当位置以 "</think>" 结尾，则移除这部分内容
 * 如果只有 "<think>" 而没有对应的 "</think>"，则返回 "..." 表示思考未完成
 *
 * @param content 用户输入的内容字符串，可能包含思考文本
 * @returns 移除思考文本后的字符串，或者返回 "..." 如果思考文本未完成
 */
const removeThinkingText = (content: string) => {
  // 检查内容是否以 "<think>" 开头
  if (content.startsWith('<think>')) {
    // 检查内容中是否包含结束标签 "</think>"
    if (content.includes('</think>')) {
      // 使用正则表达式移除思考文本部分，包括标签
      return content.replace(/^<think>[\S\s]*?<\/think>\s*/, '')
    } else {
      // 如果没有找到结束标签，返回 "..." 表示思考未完成
      return '...'
    }
  }
  // 如果内容不以 "<think>" 开头，直接返回原始内容
  else {
    return content
  }
};

export const chatTopic: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatTopicAction
> = (set, get) => ({
  // create
  openNewTopicOrSaveTopic: async () => {
    const { switchTopic, saveToTopic, refreshMessages, activeTopicId } = get();
    const hasTopic = !!activeTopicId;

    if (hasTopic) switchTopic();
    else {
      await saveToTopic();
      refreshMessages();
    }
  },

  createTopic: async () => {
    const { activeId, internal_createTopic } = get();

    const messages = chatSelectors.activeBaseChats(get());

    set({ creatingTopic: true }, false, n('creatingTopic/start'));
    const topicId = await internal_createTopic({
      sessionId: activeId,
      title: t('defaultTitle', { ns: 'topic' }),
      messages: messages.map((m) => m.id),
    });
    set({ creatingTopic: false }, false, n('creatingTopic/end'));

    return topicId;
  },

  saveToTopic: async () => {
    // if there is no message, stop
    const messages = chatSelectors.activeBaseChats(get());
    if (messages.length === 0) return;

    const { activeId, summaryTopicTitle, internal_createTopic } = get();

    // 1. create topic and bind these messages
    const topicId = await internal_createTopic({
      sessionId: activeId,
      title: t('defaultTitle', { ns: 'topic' }),
      messages: messages.map((m) => m.id),
    });

    get().internal_updateTopicLoading(topicId, true);
    // 2. auto summary topic Title
    // we don't need to wait for summary, just let it run async
    summaryTopicTitle(topicId, messages);

    return topicId;
  },
  duplicateTopic: async (id) => {
    const { refreshTopic, switchTopic } = get();

    const topic = topicSelectors.getTopicById(id)(get());
    if (!topic) return;

    const newTitle = t('duplicateTitle', { ns: 'chat', title: topic?.title });

    message.loading({
      content: t('duplicateLoading', { ns: 'topic' }),
      key: 'duplicateTopic',
      duration: 0,
    });

    const newTopicId = await topicService.cloneTopic(id, newTitle);
    await refreshTopic();
    message.destroy('duplicateTopic');
    message.success(t('duplicateSuccess', { ns: 'topic' }));

    await switchTopic(newTopicId);
  },
  // update
  summaryTopicTitle: async (topicId, messages) => {
    const { internal_updateTopicTitleInSummary, internal_updateTopicLoading } = get();
    const topic = topicSelectors.getTopicById(topicId)(get());
    if (!topic) return;

    internal_updateTopicTitleInSummary(topicId, LOADING_FLAT);

    let output = '';

    // Get current agent for topic
    const topicConfig = systemAgentSelectors.topic(useUserStore.getState());

    // Automatically summarize the topic title
    await chatService.fetchPresetTaskResult({
      onError: () => {
        internal_updateTopicTitleInSummary(topicId, topic.title);
      },
      onFinish: async (text) => {
        await get().internal_updateTopic(topicId, { title: removeThinkingText(text) });
      },
      onLoadingChange: (loading) => {
        internal_updateTopicLoading(topicId, loading);
      },
      onMessageHandle: (chunk) => {
        switch (chunk.type) {
          case 'text': {
            output += chunk.text;
          }
        }

        internal_updateTopicTitleInSummary(topicId, removeThinkingText(output));
      },
      params: merge(topicConfig, chainSummaryTitle(messages)),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.SummaryTopicTitle, topicId }),
    });
  },
  favoriteTopic: async (id, favorite) => {
    await get().internal_updateTopic(id, { favorite });
  },

  updateTopicTitle: async (id, title) => {
    await get().internal_updateTopic(id, { title });
  },

  autoRenameTopicTitle: async (id) => {
    const { activeId: sessionId, summaryTopicTitle, internal_updateTopicLoading } = get();

    internal_updateTopicLoading(id, true);
    const messages = await messageService.getMessages(sessionId, id);

    await summaryTopicTitle(id, messages);
    internal_updateTopicLoading(id, false);
  },

  // query
  useFetchTopics: (enable, sessionId) =>
    useClientDataSWR<ChatTopic[]>(
      enable ? [SWR_USE_FETCH_TOPIC, sessionId] : null,
      async ([, sessionId]: [string, string]) => topicService.getTopics({ sessionId }),
      {
        suspense: true,
        fallbackData: [],
        onSuccess: (topics) => {
          const nextMap = { ...get().topicMaps, [sessionId]: topics };

          // no need to update map if the topics have been init and the map is the same
          if (get().topicsInit && isEqual(nextMap, get().topicMaps)) return;

          set(
            { topicMaps: nextMap, topicsInit: true },
            false,
            n('useFetchTopics(success)', { sessionId }),
          );
        },
      },
    ),
  useSearchTopics: (keywords, sessionId) =>
    useSWR<ChatTopic[]>(
      [SWR_USE_SEARCH_TOPIC, keywords, sessionId],
      ([, keywords, sessionId]: [string, string, string]) =>
        topicService.searchTopics(keywords, sessionId),
      {
        onSuccess: (data) => {
          set(
            { searchTopics: data, isSearchingTopic: false },
            false,
            n('useSearchTopics(success)', { keywords }),
          );
        },
      },
    ),
  switchTopic: async (id, skipRefreshMessage) => {
    set(
      { activeTopicId: !id ? (null as any) : id, activeThreadId: undefined },
      false,
      n('toggleTopic'),
    );

    if (skipRefreshMessage) return;
    await get().refreshMessages();
  },
  // delete
  removeSessionTopics: async () => {
    const { switchTopic, activeId, refreshTopic } = get();

    await topicService.removeTopics(activeId);
    await refreshTopic();

    // switch to default topic
    switchTopic();
  },
  removeAllTopics: async () => {
    const { refreshTopic } = get();

    await topicService.removeAllTopic();
    await refreshTopic();
  },
  removeTopic: async (id) => {
    const { activeId, activeTopicId, switchTopic, refreshTopic } = get();

    // remove messages in the topic
    // TODO: Need to remove because server service don't need to call it
    await messageService.removeMessagesByAssistant(activeId, id);

    // remove topic
    await topicService.removeTopic(id);
    await refreshTopic();

    // switch bach to default topic
    if (activeTopicId === id) switchTopic();
  },
  removeUnstarredTopic: async () => {
    const { refreshTopic, switchTopic } = get();
    const topics = topicSelectors.currentUnFavTopics(get());

    await topicService.batchRemoveTopics(topics.map((t) => t.id));
    await refreshTopic();

    // 切换到默认 topic
    switchTopic();
  },

  // Internal process method of the topics
  internal_updateTopicTitleInSummary: (id, title) => {
    get().internal_dispatchTopic(
      { type: 'updateTopic', id, value: { title } },
      'updateTopicTitleInSummary',
    );
  },
  refreshTopic: async () => {
    return mutate([SWR_USE_FETCH_TOPIC, get().activeId]);
  },

  internal_updateTopicLoading: (id, loading) => {
    set(
      (state) => {
        if (loading) return { topicLoadingIds: [...state.topicLoadingIds, id] };

        return { topicLoadingIds: state.topicLoadingIds.filter((i) => i !== id) };
      },
      false,
      n('updateTopicLoading'),
    );
  },

  internal_updateTopic: async (id, data) => {
    get().internal_dispatchTopic({ type: 'updateTopic', id, value: data });

    get().internal_updateTopicLoading(id, true);
    await topicService.updateTopic(id, data);
    await get().refreshTopic();
    get().internal_updateTopicLoading(id, false);
  },
  internal_createTopic: async (params) => {
    const tmpId = Date.now().toString();
    get().internal_dispatchTopic(
      { type: 'addTopic', value: { ...params, id: tmpId } },
      'internal_createTopic',
    );

    get().internal_updateTopicLoading(tmpId, true);
    const topicId = await topicService.createTopic(params);
    get().internal_updateTopicLoading(tmpId, false);

    get().internal_updateTopicLoading(topicId, true);
    await get().refreshTopic();
    get().internal_updateTopicLoading(topicId, false);

    return topicId;
  },

  internal_dispatchTopic: (payload, action) => {
    const nextTopics = topicReducer(topicSelectors.currentTopics(get()), payload);
    const nextMap = { ...get().topicMaps, [get().activeId]: nextTopics };

    // no need to update map if is the same
    if (isEqual(nextMap, get().topicMaps)) return;

    set({ topicMaps: nextMap }, false, action ?? n(`dispatchTopic/${payload.type}`));
  },
});

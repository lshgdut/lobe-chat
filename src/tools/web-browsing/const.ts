import {
  CodeIcon,
  FileIcon,
  FlaskConicalIcon,
  ImageIcon,
  MapIcon,
  MusicIcon,
  NewspaperIcon,
  SearchIcon,
  Share2Icon,
  VideoIcon,
} from 'lucide-react';

export const CATEGORY_ICON_MAP: Record<string, any> = {
  files: FileIcon,
  general: SearchIcon,
  images: ImageIcon,
  it: CodeIcon,
  map: MapIcon,
  music: MusicIcon,
  news: NewspaperIcon,
  science: FlaskConicalIcon,
  social_media: Share2Icon,
  videos: VideoIcon,
};

export const ENGINE_ICON_MAP: Record<string, string> = {
  'arxiv': '//arxiv.org/favicon.ico',
  'baidu': '//baidu.com/favicon.ico',
  'bilibili': '//bilibili.com/favicon.ico',
  'bing': '//www.bing.com/favicon.ico',
  'brave': '//brave.com/favicon.ico',
  'duckduckgo': '//www.duckduckgo.com/favicon.ico',
  'google': '//google.com/favicon.ico',
  'google scholar': '//scholar.google.com/favicon.ico',
  'npm': '//npmjs.com/favicon.ico',
  'qwant': '//www.qwant.com/favicon.ico',
  'youtube': '//youtube.com/favicon.ico',
};

export const CRAWL_CONTENT_LIMITED_COUNT = 7000;

import { ReactNode } from 'react';

export interface Plugin {
  name: string;
  match: (input: string) => boolean;
  execute: (input: string) => Promise<any> | any;
  render: (data: any) => ReactNode;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  type: 'text' | 'plugin';
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
}
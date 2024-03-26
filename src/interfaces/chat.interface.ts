export interface Sender {
  id: number;
  nickname: string;
  avatar?: string;
}

export interface Content {
  message: string;
  extra?: any;
}

export interface Message {
  id: number;
  sender: Sender;
  content: Content;
  createdAt: Date;
}

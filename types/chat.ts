export interface Message {
  speaker: string;
  message: string;
}

export interface ChatData {
  messages: Message[];
  mainSpeaker: string;
  messageCount: number;
  uploadedAt: string;
}

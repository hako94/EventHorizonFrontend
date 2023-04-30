export interface ChatAnswerModel {
  sender: string;
  message: string;
  username: string;
  timestamp: string | undefined;
  priority: boolean;
}

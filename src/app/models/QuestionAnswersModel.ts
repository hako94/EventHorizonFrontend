import {AnswerCountModel} from "./AnswerCountModel";

export interface QuestionAnswersModel {
  questionNumber: number;
  questionText: string;
  answer: AnswerCountModel[]
}

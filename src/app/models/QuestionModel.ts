import {AnswerModel} from "./AnswerModel";

export interface QuestionModel {

  questionNumber : number;
  questionText : string;
  type : string;
  answerOptions : AnswerModel[];

}

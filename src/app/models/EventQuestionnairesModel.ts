import {QuestionModel} from "./QuestionModel";

export interface EventQuestionnairesModel {
  title : string;
  description : string;
  questions : QuestionModel[];
  eventId : string;
}

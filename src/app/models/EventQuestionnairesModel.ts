import {QuestionModel} from "./QuestionModel";

export interface EventQuestionnairesModel {
  id : string | undefined;
  title : string;
  description : string;
  questions : QuestionModel[];
  eventId : string;
}

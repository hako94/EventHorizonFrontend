import {QuestionModel} from "./QuestionModel";
import {QuestionnaireStatusModel} from "./QuestionnaireStatusModel";


export interface QuestionnairePostModel {
  title : string;
  description : string;
  questions : QuestionModel[]
  eventId : string;
  status : QuestionnaireStatusModel;
}

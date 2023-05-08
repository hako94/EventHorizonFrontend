import {QuestionnaireStatusModel} from "./QuestionnaireStatusModel";
import {QuestionModel} from "./QuestionModel";

export interface QuestionnaireModel {
  id : string;
  title : string;
  description : string;
  questions : QuestionModel[];
  status : QuestionnaireStatusModel;
}

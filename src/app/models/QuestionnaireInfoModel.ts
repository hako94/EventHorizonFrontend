import {QuestionnaireStatusModel} from "./QuestionnaireStatusModel";

export interface QuestionnaireInfoModel {
  id : string,
  title : string,
  status : QuestionnaireStatusModel
}

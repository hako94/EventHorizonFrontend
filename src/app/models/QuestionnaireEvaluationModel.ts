import {QuestionAnswersModel} from "./QuestionAnswersModel";


export interface QuestionnaireEvaluationModel {
    title: string;
    description: string;
    countOfAnswers: number;
    questionAnswers: QuestionAnswersModel[]
}

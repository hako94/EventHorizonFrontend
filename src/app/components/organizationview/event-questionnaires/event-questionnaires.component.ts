import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {DataService} from "../../../services/DataService";
import {EventQuestionnairesModel} from "../../../models/EventQuestionnairesModel";
import {QuestionModel} from "../../../models/QuestionModel";

//TODO wtf typscript
export interface FormIn {
  titeln : string,
  descriptionn : string;
}

interface SwitchView {
  value: number;
  viewValue: string;
}



//TODO: split container i 2 seperate Components
@Component({
  selector: 'app-event-questionnaires',
  templateUrl: './event-questionnaires.component.html',
  styleUrls: ['./event-questionnaires.component.scss']
})
export class EventQuestionnairesComponent implements OnInit{

  availableQuestionnaires : EventQuestionnairesModel[] = [];
  switchView: SwitchView[] = [];

  questionsView : QuestionModel[] = [];

  currentVire : number = 0;

  ngOnInit(): void {

  }


  orgId : string = '';
  eventId : string = '';

  formIn : FormIn = {
    titeln : '',
    descriptionn : ''
  }

  questions : Array<QuestionModel> = [];


  removeValueFromCustomFields(index : number) : void {
    delete this.questions[index]
    this.questions = this.questions.filter(el => {return el != null});
  }


  addCustomField(name : string) : void {
    this.questions.push({
      answerOptions: [],
      questionNumber: 0,
      questionText: name,
      type: "MULTIPLE_CHOICE",
    })
    console.log(this.questions)
  }

  writeIndices(model : EventQuestionnairesModel) : EventQuestionnairesModel {

    let questionCounter = 0;

    model.questions.forEach(question => {

      question.questionNumber = questionCounter;
      questionCounter++;

      let answerCounter = 0;

      question.answerOptions.forEach(answer => {

        answer.answerNumber = answerCounter;
        answerCounter++;

      })
    })

    return model;
  }

  addAnswerOption(value: string, i : number) {

    if (this.questions.at(i)) {
      this.questions.at(i)?.answerOptions.push(
        {
          answerNumber: 0,
          answerText : value
        }
      )
    }
  }

  //TODO wtf typscript
  removeAnswerOption(questionIndex: number, answerIndex : number) {
    if (this.questions.at(questionIndex)) {
      // @ts-ignore
      if (this.questions.at(questionIndex).answerOptions) {
        // @ts-ignore
        delete this.questions.at(questionIndex).answerOptions[answerIndex];
        // @ts-ignore
        this.questions.at(questionIndex).answerOptions = this.questions.at(questionIndex).answerOptions.filter(el => {return el != null});
      }
    }
  }

  submitBogen() {

    let eventQuestionnairesModel : EventQuestionnairesModel =
      {
        id: undefined,
        description: this.formIn.descriptionn,
        title: this.formIn.titeln,
        eventId : this.eventId,
        questions : this.questions
      };

    eventQuestionnairesModel = this.writeIndices(eventQuestionnairesModel);

    this.dataServie.createEventQuestionnaires(this.orgId,this.eventId, eventQuestionnairesModel).subscribe()
  }

  constructor(private location : Location, private dataServie : DataService) {

    const regex = /\/organizations\/(\w+)\/event\/(\w+)\//;
    const matches = regex.exec(location.path());
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[1];
      this.eventId = nums[2];
    }

    this.dataServie.loadAvailableEventQuestionnaires(this.orgId, this.eventId).subscribe(sucess => {
      this.availableQuestionnaires = sucess

      let index = 0;

      sucess.forEach(elem => {
        console.log("load Questionna" + elem.id)
        this.switchView.push({value: index, viewValue: elem.title})
        index++;
      })

    })
  }

  goBack() {
    this.location.back()
  }

  getQuestions() : QuestionModel[] {
    if (this.availableQuestionnaires.at(this.currentVire)) {
      return this.availableQuestionnaires[this.currentVire].questions
    }
    return []
  }
}

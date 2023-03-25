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

@Component({
  selector: 'app-event-questionnaires',
  templateUrl: './event-questionnaires.component.html',
  styleUrls: ['./event-questionnaires.component.scss']
})
export class EventQuestionnairesComponent implements OnInit{

  availableQuestionnaires : EventQuestionnairesModel[] = [];

  ngOnInit(): void {
    this.dataServie.loadAvailableEventQuestionnaires(this.orgId, this.eventId).subscribe(sucess => {
      this.availableQuestionnaires = sucess
    })

    console.log(this.availableQuestionnaires)
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
        description: this.formIn.descriptionn,
        title: this.formIn.titeln,
        eventId : this.eventId,
        questions : this.questions
      };

    eventQuestionnairesModel = this.writeIndices(eventQuestionnairesModel);

    this.dataServie.createEventQuestionnaires(this.orgId,this.eventId, eventQuestionnairesModel).subscribe()
  }

  constructor(private location : Location, private dataServie : DataService) {

    const regex = /\/\d+\//g;
    const matches = this.location.path().match(regex);
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[0];
      this.eventId = nums[1];
    }
  }

  goBack() {
    this.location.back()
  }
}

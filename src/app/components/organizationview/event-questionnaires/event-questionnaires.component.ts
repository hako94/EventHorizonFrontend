import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {DataService} from "../../../services/DataService";
import {EventQuestionnairesModel} from "../../../models/EventQuestionnairesModel";
import {AddEventCustomField} from "../../../dataobjects/AddEventCustomField";
import {QuestionModel} from "../../../models/QuestionModel";
import {AnswerModel} from "../../../models/AnswerModel";

export interface FormIn {
  titeln : string,
  descriptionn : string;
}

@Component({
  selector: 'app-event-questionnaires',
  templateUrl: './event-questionnaires.component.html',
  styleUrls: ['./event-questionnaires.component.scss']
})
export class EventQuestionnairesComponent {

  formIn : FormIn = {
    titeln : '',
    descriptionn : ''
  }

  questions : Array<QuestionModel> = [];


  removeValueFromCustomFields(index : number) : void {


  }

  counter : number = -1;
  answerCounter : Array<number> = [];


  addCustomField(name : string) : void {
    this.counter ++;
    this.questions.push({
      answerOptions: [],
      questionNumber: this.counter,
      questionText: name,
      type: "MULTIPLE_CHOICE",
    })
    console.log(this.questions)
  }


  addAnswerOption(value: string, i : number) {

    this.answerCounter[i] = this.answerCounter[i] + 1;

    if (this.questions.at(i)) {
      this.questions.at(i)?.answerOptions.push(
        {
          answerNumber: i,
          answerText : value
        }
      )
    }
  }

  submitBogen() {

    const eventQuestionnairesModel : EventQuestionnairesModel =
      {
        description: this.formIn.descriptionn,
        title: this.formIn.titeln,
        eventId : "641ecf2bc2dc12102b2794bb",
        questions : this.questions
      };

    this.dataServie.createEventQuestionnaires("641ecf2ac2dc12102b2794b6","641ecf2bc2dc12102b2794bb", eventQuestionnairesModel).subscribe()
  }

  /*eventQuestionnairesModel : EventQuestionnairesModel =
    {
      title: "sdad",
      description: "sadasd",
      eventId : "641ecf2bc2dc12102b2794bb",
      questions : [
        {
          questionNumber: 1,
          questionText: "sadasd",
          type : "MULTIPLE_CHOICE",
          answerOptions : [
            {
              answerNumber: 1,
              answerText: "saddaad"
            }
          ]
        }
      ]
    }*/

  constructor(private location : Location, private dataServie : DataService) {
  }

  goBack() {
    this.location.back()
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {EventQuestionnairesModel} from "../../../../models/EventQuestionnairesModel";
import {QuestionModel} from "../../../../models/QuestionModel";
import {Location} from "@angular/common";
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {ActivatedRoute, Params, Router} from "@angular/router";
// @ts-ignore
import {QuestionnairePostModel} from "../../../../models/QuestionnairePostModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuestionnaireInfoModel} from "../../../../models/QuestionnaireInfoModel";

export interface FormIn {
  titeln : string,
  descriptionn : string;
}

interface SwitchView {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-event-survey',
  templateUrl: './event-survey.component.html',
  styleUrls: ['./event-survey.component.scss']
})
export class EventSurveyComponent implements OnInit{

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

  currentParam? : Params;

  availableQuestionnaires : QuestionnaireInfoModel[] = [];
  switchView: SwitchView[] = [];

  questionsView : QuestionModel[] = [];

  currentSurvey? : SwitchView;

  orgId : string = '';
  eventId : string = '';

  currentView: string = 'answer';

  formIn : FormIn = {
    titeln : '',
    descriptionn : ''
  }

  addQuestionName : string = '';
  addQuestionType : string = 'multi';

  questions : Array<QuestionModel> = [];

  constructor(private location : Location,
              private dataService : DataService,
              private storageService : StorageService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
              private snackBar : MatSnackBar) {

    const regex = /\/organizations\/(\w+)\/event\/(\w+)\//;
    const matches = regex.exec(location.path());
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[1];
      this.eventId = nums[2];
    }
  }

  updateURLWithParam(param : Params) : void {

    this.currentParam = param;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.currentParam,
        queryParamsHandling: 'merge',
      });
  }

  hasRole(roleId: number) : boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  ngOnInit(): void {
    if (!this.hasRole(2) && !this.hasRole(1)) {
      this.currentView == 'answer'
    }

    this.dataService.loadAvailableEventQuestionnaires(this.orgId, this.eventId).subscribe(success => {
      this.availableQuestionnaires = success

      let index = 0;

      success.forEach(elem => {
        console.log("load Questionna" + elem.id)
        this.switchView.push({value: index, viewValue: elem.title})
        index++;
      })

    })
  }

  removeValueFromCustomFields(index : number) : void {
    delete this.questions[index]
    this.questions = this.questions.filter(el => {return el != null});
  }

  addCustomField(name : string, selected : string) : void {
    if (this.addQuestionName == '') {
      this.snackBar.open('Bitte geben Sie eine Frage ein', 'OK', {duration: 3000})
      return;
    }
    this.questions.push({
      answerOptions: [],
      questionNumber: 0,
      questionText: this.addQuestionName,
      type: this.addQuestionType == "single" ?  "SINGLE_CHOICE" : "MULTIPLE_CHOICE",
    })
    console.log(this.questions)
    this.addQuestionName = '';
  }

  //Methode ins Backend verschoben und kann entfernt werden
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


  addAnswerOption(inputForm: HTMLInputElement, answerIndex : number) {
    if (inputForm.value == '') {
      this.snackBar.open('Bitte geben Sie eine mögliche Antwort an', 'OK', {duration: 3000})
      return;
    }
    if (this.questions.at(answerIndex)) {
      this.questions.at(answerIndex)?.answerOptions.push(
        {
          answerNumber: 0,
          answerText : inputForm.value
        }
      )
    }
    inputForm.value = '';
  }


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

  submitQuestionnaire() {

    let eventQuestionnairesModel : QuestionnairePostModel =
      {
        title: this.formIn.titeln,
        description: this.formIn.descriptionn,
        questions: this.questions,
        eventId: this.eventId,
        status: {id: 1, status: 'erstellt'}
      };

    this.dataService.createEventQuestionnaires(this.orgId,this.eventId, eventQuestionnairesModel).subscribe(success => {
      this.snackBar.open('Umfragebogen erfolgreich erstellt', 'OK', {duration: 3000})
      this.ngOnInit();
      this.currentView = 'view';
    })
  }

  goBack() {
    this.location.back()
  }

  /*
  getQuestions() : QuestionModel[] {
    if (this.availableQuestionnaires.at(this.currentSurvey?.value || 0)) {
      return this.availableQuestionnaires[this.currentSurvey?.value || 0].questions
    }
    return []
  } */

  valideDateQuestions() : boolean {
    let mistake = false;

    if (this.questions.length < 1) {
      mistake = true;
    }
    this.questions.forEach(question => {
      if (question.answerOptions.length < 1) {
        mistake = true;
      }
    })
    return mistake;
  }

  protected readonly isSecureContext = isSecureContext;

  /**
   * Checks if the question numer i is a single-choice question with already one assigned answer
   * @param i
   */
  isSingleChoiceComplete(i: number): boolean {
    let disable : boolean = false
    // @ts-ignore
    if (this.questions.at(i).type == 'SINGLE_CHOICE') {
      // @ts-ignore
      if (this.questions.at(i).answerOptions.length >= 1) {
        disable = true;
      }
    }
    return disable;
  }

  /**
   * Calls the DataService to delete the survey with the given id
   * @param id
   */
  deleteSurvey(id: string) {
    this.dataService.deleteEventQuestionnaire(this.orgId, this.eventId, id).subscribe(() => {
      this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
      this.ngOnInit();
    })
  }
}

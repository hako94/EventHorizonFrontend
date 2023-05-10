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
import {QuestionnaireModel} from "../../../../models/QuestionnaireModel";
import {QuestionAnswerModel} from "../../../../models/QuestionAnswerModel";
import {QuestionnaireEvaluationModel} from "../../../../models/QuestionnaireEvaluationModel";
import {Chart, registerables} from "chart.js";
import {delay, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";

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
export class EventSurveyComponent implements OnInit {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

  editMode: boolean = false;
  editedSurvey: string = '';

  currentParam?: Params;

  availableQuestionnaires: QuestionnaireInfoModel[] = [];
  switchView: SwitchView[] = [];

  questionsView: QuestionModel[] = [];

  currentSurvey?: SwitchView;

  toAnswerSurveyId: string = '';
  toAnswerSurvey: QuestionnaireModel | undefined;

  toEvaluateSurveyId: string = '';
  toEvaluateSurvey: QuestionnaireEvaluationModel | undefined;

  loadingEvaluation: boolean = false;

  chartTypes: string[] = ['bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar'];

  chartType: string = 'bar';

  model1: string = 'bar';
  model2: string = 'bar';
  model3: string = 'bar';
  model4: string = 'bar';
  model5: string = 'bar';
  model6: string = 'bar';
  model7: string = 'bar';
  model8: string = 'bar';
  model9: string = 'bar';
  model10: string = 'bar';

  orgId: string = '';
  eventId: string = '';

  currentView: string = 'answer';

  formIn: FormIn = {
    titeln: '',
    descriptionn: ''
  }

  surveyStatus: number = 1;

  addQuestionName: string = '';
  addQuestionType: string = 'multi';

  questions: Array<QuestionModel> = [];

  questionAnswers: QuestionAnswerModel[] = [];

  constructor(private location: Location,
              private dataService: DataService,
              private storageService: StorageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {

    const regex = /\/organizations\/(\w+)\/event\/(\w+)\//;
    const matches = regex.exec(location.path());
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[1];
      this.eventId = nums[2];
    }
    Chart.register(...registerables);
  }

  updateURLWithParam(param: Params): void {

    this.currentParam = param;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.currentParam,
        queryParamsHandling: 'merge',
      });
  }

  hasRole(roleId: number): boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  ngOnInit(): void {
    if (this.roleIdInEvent == 12) {
      this.currentView = 'answer';
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

  removeValueFromCustomFields(index: number): void {
    delete this.questions[index]
    this.questions = this.questions.filter(el => {
      return el != null
    });
  }

  addCustomField(name: string, selected: string): void {
    if (this.addQuestionName == '') {
      this.snackBar.open('Bitte geben Sie eine Frage ein', 'OK', {duration: 3000})
      return;
    }
    this.questions.push({
      answerOptions: [],
      questionNumber: 0,
      questionText: this.addQuestionName,
      type: this.addQuestionType == "single" ? "SINGLE_CHOICE" : "MULTIPLE_CHOICE",
    })
    console.log(this.questions)
    this.addQuestionName = '';
  }

  //Methode ins Backend verschoben und kann entfernt werden
  writeIndices(model: EventQuestionnairesModel): EventQuestionnairesModel {

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


  addAnswerOption(inputForm: HTMLInputElement, answerIndex: number) {
    if (inputForm.value == '') {
      this.snackBar.open('Bitte geben Sie eine mögliche Antwort an', 'OK', {duration: 3000})
      return;
    }
    if (this.questions.at(answerIndex)) {
      this.questions.at(answerIndex)?.answerOptions.push(
        {
          answerNumber: 0,
          answerText: inputForm.value
        }
      )
    }
    inputForm.value = '';
  }


  removeAnswerOption(questionIndex: number, answerIndex: number) {
    if (this.questions.at(questionIndex)) {
      // @ts-ignore
      if (this.questions.at(questionIndex).answerOptions) {
        // @ts-ignore
        delete this.questions.at(questionIndex).answerOptions[answerIndex];
        // @ts-ignore
        this.questions.at(questionIndex).answerOptions = this.questions.at(questionIndex).answerOptions.filter(el => {
          return el != null
        });
      }
    }
  }

  submitQuestionnaire() {

    let eventQuestionnairesModel: QuestionnairePostModel =
      {
        title: this.formIn.titeln,
        description: this.formIn.descriptionn,
        questions: this.questions,
        eventId: this.eventId,
        status: {id: 1, status: 'erstellt'}
      };

    this.dataService.createEventQuestionnaires(this.orgId, this.eventId, eventQuestionnairesModel).subscribe(success => {
      this.snackBar.open('Umfragebogen erfolgreich erstellt', 'OK', {duration: 3000})
      this.ngOnInit();
      this.currentView = 'view';
      this.questions = [];
      this.formIn = {titeln: '', descriptionn: ''};
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

  valideDateQuestions(): boolean {
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
    let disable: boolean = false
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
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteEventQuestionnaire(this.orgId, this.eventId, id).subscribe(() => {
          this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
          this.ngOnInit();
        })
      }
    })
  }



  /**
   * enters edit mode to change status of survey
   * @param id
   */
  editSurveyStatus(id: string) {
    this.editMode = true;
    this.editedSurvey = id;
  }

  /**
   * leaves editMode and saves new status of survey
   * @param id
   */
  saveSurveyStatus(id: string) {
    let statusId: number = this.surveyStatus;
    let statusText = '';

    if (statusId == 1) {
      statusText = 'erstellt';
    } else if (statusId == 2) {
      statusText = 'freigegeben';
    } else if (statusId == 3) {
      statusText = 'geschlossen';
    }

    this.dataService.changeQuestionnaireStatus(this.orgId, this.eventId, id, statusId, statusText).subscribe(() => {
      this.snackBar.open('Status geändert', 'OK', {duration: 3000})
      this.ngOnInit();
    })
    this.editMode = false;
    this.editedSurvey = '';
  }

  /**
   * Selects a survey that will be answered, retrieves information about the survey from dataservice
   */
  selectToAnswerSurvey() {
    if (this.toAnswerSurveyId == '') {
      this.snackBar.open('Bitte einen Fragebogen auswählen', 'OK', {duration: 3000})
      return;
    }
    this.dataService.getQuestionnaire(this.orgId, this.eventId, this.toAnswerSurveyId).subscribe(success => {
      this.toAnswerSurvey = success;
    })


    this.toAnswerSurveyId = '';
  }

  /**
   * retrieves the selected answer of a single choice question that is currently answered
   * @param questionNumber
   * @param answerNumber
   */
  updateSingleChoiceAnswer(questionNumber: number, answerNumber: number) {
    console.log('Frage ' + questionNumber + ', Antwort ' + answerNumber);
    let exists: boolean = false;
    this.questionAnswers.forEach(question => {
      if (question.questionNumber == questionNumber) {
        exists = true;
        question.answerNumber = [answerNumber];
      }
    })
    if (!exists) {
      this.questionAnswers.push(new class implements QuestionAnswerModel {
        answerNumber: number[] = [answerNumber];
        questionNumber: number = questionNumber;
      })
    }
    console.log(this.questionAnswers)
  }

  /**
   * retrieves the selected answer of a multiple choice question that is currently answered
   * @param questionNumber
   * @param answerNumber
   */
  updateMultipleChoiceAnswer(questionNumber: number, answerNumber: number) {
    console.log('Frage ' + questionNumber + ', Antwort ' + answerNumber + ' MC');
    let existsQuestion: boolean = false;
    this.questionAnswers.forEach(question => {
      if (question.questionNumber == questionNumber) {
        existsQuestion = true;
        let existsAnswer: boolean = false;
        question.answerNumber.forEach(answer => {
          if (answer == answerNumber) {
            existsAnswer = true;
          }
        })
        if (existsAnswer) {
          let updatedAnswerNumbers: number[] = [];
          question.answerNumber.forEach(answer => {
            if (answer != answerNumber) {
              updatedAnswerNumbers.push(answer);
            }
          })
          question.answerNumber = updatedAnswerNumbers;
        } else {
          question.answerNumber.push(answerNumber);
        }
      }
    })

    if (!existsQuestion) {
      this.questionAnswers.push(new class implements QuestionAnswerModel {
        answerNumber: number[] = [answerNumber];
        questionNumber: number = questionNumber;
      })
    }

    console.log(this.questionAnswers);
  }

  /**
   * Calls dataservice to send the answered survey
   */
  sendAnsweredSurvey() {
    if (this.toAnswerSurvey == undefined || this.storageService.getUser() == null) {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
      return;
    }
    let userId: string | undefined = this.storageService.getUserId()?.toString();
    this.dataService.postQuestionnaireAnswer(this.orgId, this.eventId, this.toAnswerSurvey?.id, userId || '', this.questionAnswers).subscribe(() => {
      this.snackBar.open('Umfrage-Antworten erfolgreich abgesendet', 'OK', {duration: 3000});
      this.questionAnswers = [];
      this.toAnswerSurvey = undefined;
    })
  }

  /**
   * Checks if Answers are missing
   */
  missingAnswers(): boolean {
    let answersMissing = false;
    if (this.toAnswerSurvey?.questions.length != this.questionAnswers.length) {
      answersMissing = true;
    } else {
      this.questionAnswers.forEach(question => {
        if (question.answerNumber.length < 1) {
          answersMissing = true;
        }
      })
    }

    return answersMissing;
  }

  /**
   * Selects a survey that will be evaluated, retrieves information about the survey from dataservice
   */
  selectToEvaluateSurvey() {
    if (this.toEvaluateSurveyId == '') {
      this.snackBar.open('Bitte einen Fragebogen auswählen', 'OK', {duration: 3000})
      return;
    }
    this.loadingEvaluation = true;
    this.dataService.getQuestionnaireEvaluation(this.orgId, this.eventId, this.toEvaluateSurveyId).pipe(
      tap(data => this.toEvaluateSurvey = data),
      delay(500)
    ).subscribe(success => {

      this.createChart()

    }, error => console.log, () => {
      this.loadingEvaluation = false;
    })
    this.loadingEvaluation = false;
  }

  /**
   * Binds data to the chart canvas
   */
  createChart(): void {
    this.toEvaluateSurvey?.questionAnswers.forEach(question => {
      let labelArray : string[] = [];
      let dataArray : number[] = [];
      question.answer.forEach(answer => {
        labelArray.push(answer.answerText);
        dataArray.push(answer.count);
      })
      let myChart = new Chart(question.questionNumber.toString(), {
        //@ts-ignore
        type: this.chartTypes.at((question.questionNumber) - 1),
        data: {
          labels: labelArray,
          datasets: [{
            label: 'Anzahl der Abstimmungen',
            data: dataArray,
          }]
        }
      })
    })
    this.loadingEvaluation = false;

  }

  /**
   * Checks if the question with index i has already 5 answers
   * @param i
   */
  hasTooManyAnswers(i: number): boolean {
    // @ts-ignore
    return this.questions.at(i).answerOptions.length >= 5;
  }

  /**
   * clears all data regarding the evaluation of a survey when the tab is closed
   */
  clearEvaluationSession() {
    this.toEvaluateSurvey = undefined;
    this.toEvaluateSurveyId = '';
    this.chartTypes = ['bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar', 'bar'];
  }
}

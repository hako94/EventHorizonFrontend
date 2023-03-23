import {VariableTemplate} from "./VariableTemplate";

export interface EventTemplateModel {

  name : string;

  variables : VariableTemplate[];

  organizationId: string;
}

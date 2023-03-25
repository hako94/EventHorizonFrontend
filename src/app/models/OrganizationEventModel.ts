export interface OrganizationEventModel {

  id : string;
  name : string;
  description : string;
  eventStart : string;
  eventEnd : string;
  location: string;
  organizationId : string;
  organisator : boolean;
  tutor : boolean;
  attender : boolean
}

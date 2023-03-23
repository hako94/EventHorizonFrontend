export interface OrganizationEventModel {

  id : string;
  name : string;
  description : string;
  eventStart : string;
  eventEnd : string;
  created : string;
  lastModified : string;

  location: string;
  selectedTemplateId : string;
  organizationId : string;

}

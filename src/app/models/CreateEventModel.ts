export interface CreateEventModel {
  name: string,
  description: string,
  eventStart: string,
  eventEnd: string,
  location: string,
  organisatorId: string[]
}

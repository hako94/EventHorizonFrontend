import {UserRoleModel} from "./UserRoleModel";
import {EventStatusModel} from "./EventStatusModel";

export interface EventRoleStatusModel{
  role: UserRoleModel,
  status: EventStatusModel
}

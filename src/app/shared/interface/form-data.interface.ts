import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

export interface FormItemData {
  country: string;
  username: string;
  birthday: NgbDateStruct;
}

export interface FormData {
  [key: number]: FormItemData;
}

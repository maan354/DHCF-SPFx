import { IUserItem } from "./IUserItem";

export interface IEmployeeDirectoryState {
  users: IUserItem[];
  search: string;
  loading: boolean;
  _columns: number;
  filterOptions: any;
  titleOptions: any;
  filters: any[];
}
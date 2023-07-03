import {Pagination, Sort} from './base';

export interface GetUserRequest extends GetUserFilter {
  pagination?: Pagination;
  sort?: Sort;
}

export interface GetUserFilter {
  id?: string;
  name?: string;
  email?: string;
}

export interface SaveUserRequest {
  id?: number;
  name: string;
  email: string;
}

import { Pagination, Sort } from './base';

export interface GetUserRequest extends GetUserFilter {
  pagination?: Pagination;
  sort?: Sort;
}

export interface GetUserFilter {
  id?: number;
  name?: string;
  email?: string;
}

export interface SaveUserRequest {
  id?: number;
  name: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  apikey: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export enum RoleId {
  RoleAdmin = 1,
  RoleClient,
  roleLimit,
}

export interface PutApiKeyRequest {
  userId: number;
}
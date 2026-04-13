import { SourceDetails } from 'newsware'
import { Pagination, Sort } from './base'

export interface GetUserRequest extends GetUserFilter {
  pagination?: Pagination
  sort?: Sort
}

export interface GetUserFilter {
  id?: number
  name?: string
  email?: string
}

export interface Plan {
  id: number
  name: string
  historyMonths: number
}

export interface SaveUserRequest {
  id?: number
  name: string
  email: string
  sources: string[]
  apiKey: string
  roles: string[]
  active: boolean
  planId?: number
}

export interface User {
  id: number
  name: string
  email: string
  apiKey: string
  roles?: Role[]
  sources: SourceDetails[]
  active: boolean
  plan?: Plan
  planId?: number
}

export interface Role {
  id: string
}

export enum RoleId {
  RoleAdmin = "admin",
  RoleClient = "client",
}

export interface PutApiKeyRequest {
  userId: number
}
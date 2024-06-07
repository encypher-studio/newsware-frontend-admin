import { Api, RestResponse, SourceDetails } from "newsware";
import { Environment } from '../environment/environment';
import { CategoryCode, PostCategoryCodeGroupAdd, PostCategoryCodeGroupDelete, PostCategoryCodegroupRequest as PostCategoryCodeGroupRequest, PutCategoryCodeRequest } from "../models/category-code";
import { GetUserRequest, PutApiKeyRequest, SaveUserRequest, User } from '../models/user';


export class ApiService {
  api: Api

  constructor(apikey: string) {
    this.api = new Api(apikey, Environment.apiEndpointDescription)
  }

  async getCategoryCodes(source: string): Promise<RestResponse<CategoryCode[]>> {
    return await this.api.get<CategoryCode[]>('/category-codes', {
      source
    });
  }

  async putCategoryCode(req: PutCategoryCodeRequest) {
    await this.api.put('/admin/category-codes', req);
  }

  async getUsers(req: GetUserRequest): Promise<RestResponse<User[]>> {
    return await this.api.get<User[]>('/admin/users', {
      filter: req,
    });
  }

  async saveUser(req: SaveUserRequest): Promise<User> {
    return (await this.api.put<SaveUserRequest, User>('/admin/user', req)).data;
  }

  async createCategoryGroup(req: PostCategoryCodeGroupRequest) {
    await this.api.post('/admin/category-codes/group', req);
  }

  async addCodeToCategoryGroup(req: PostCategoryCodeGroupAdd) {
    await this.api.post('/admin/category-codes/group/add', req);
  }

  async deleteCodeFromCategoryGroup(req: PostCategoryCodeGroupDelete) {
    await this.api.post('/admin/category-codes/group/delete', req);
  }

  async deleteUser(userId: number) {
    await this.api.delete('/admin/user', {
      userId,
    });
  }

  async deleteApikey(userId: number) {
    await this.api.delete('/admin/apikey', {
      userId,
    });
  }

  async putApikey(userId: number): Promise<string> {
    return (await this.api.put<PutApiKeyRequest, string>('/admin/apikey', { userId })).data
  }

  async getUserByApiKey(apikey: string): Promise<User> {
    return (await this.api.get<User>('/user/apikey', { apikey })).data;
  }

  async putSource(req: SourceDetails) {
    return await this.api.put('/admin/sources', req);
  }
}
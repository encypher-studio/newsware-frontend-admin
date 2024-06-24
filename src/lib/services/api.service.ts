import { CategoryCode, RestHelper, RestResponse, SourceDetails } from "newsware";
import { Environment } from '../environment/environment';
import { PostCategoryCodeGroupAdd, PostCategoryCodeGroupDelete, PutCategoryCodeRequest } from "../models/category-code";
import { GetUserRequest, PutApiKeyRequest, Role, SaveUserRequest, User } from "../models/user";


export class ApiService {
  restHelper: RestHelper

  constructor(private firebaseToken: string) {
    this.restHelper = new RestHelper(Environment.apiEndpointDescription, {
      "Authorization": `Bearer ${this.firebaseToken}`
    });
  }

  async getCategoryCodes(source: string): Promise<RestResponse<CategoryCode[]>> {
    return await this.restHelper.get<CategoryCode[]>('/category-codes', {
      source
    });
  }

  async putCategoryCode(req: PutCategoryCodeRequest) {
    await this.restHelper.put('/admin/category-codes', req);
  }

  async getUsers(req: GetUserRequest): Promise<RestResponse<User[]>> {
    return await this.restHelper.get<User[]>('/admin/users', {
      filter: req,
    });
  }

  async saveUser(req: SaveUserRequest): Promise<User> {
    return (await this.restHelper.put<SaveUserRequest, User>('/admin/user', req)).data;
  }

  async createCategoryGroup(req: PutCategoryCodeRequest) {
    await this.restHelper.post('/admin/category-codes/group', req);
  }

  async addCodeToCategoryGroup(req: PostCategoryCodeGroupAdd) {
    await this.restHelper.post('/admin/category-codes/group/add', req);
  }

  async deleteCodeFromCategoryGroup(req: PostCategoryCodeGroupDelete) {
    await this.restHelper.post('/admin/category-codes/group/delete', req);
  }

  async deleteUser(userId: number) {
    await this.restHelper.delete('/admin/user', {
      userId,
    });
  }

  async deleteApikey(userId: number) {
    await this.restHelper.delete('/admin/apikey', {
      userId,
    });
  }

  async putApikey(userId: number): Promise<string> {
    return (await this.restHelper.put<PutApiKeyRequest, string>('/admin/api-key', { userId })).data
  }

  async getUserByApiKey(apikey: string): Promise<User> {
    return (await this.restHelper.get<User>('/user/apikey', { apikey })).data;
  }

  async putSource(req: SourceDetails) {
    return await this.restHelper.put('/admin/sources', req);
  }

  async getRoles(): Promise<Role[]> {
    return (await this.restHelper.get<Role[]>('/admin/roles')).data;
  }
}
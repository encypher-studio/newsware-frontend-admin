export interface CategoryCode {
  code: string
  source: string
  description: string
}

export interface PutCategoryCodeRequest {
  code: string
  description: string
}


export interface PostCategoryCodegroupRequest {
  code: string
  description: string
}

export interface PostCategoryCodeGroupAdd {
  parentCode: string
  child: {
    code: string
    source: string
  }
}
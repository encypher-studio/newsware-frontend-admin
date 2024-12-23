export interface CategoryCode {
  code: string
  source: string
  description: string
  children: ChildrenCategoryCode[]
}

export interface ChildrenCategoryCode {
  code: string
  source: string
  description: string
}

export interface PutCategoryCodeRequest {
  code: string
  type: string
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

export interface PostCategoryCodeGroupDelete {
  parentCode: string
  child: {
    code: string
    source: string
  }
}
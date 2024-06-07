export interface Pagination {
  page: number;
  limit: number;
}

export interface Sort {
  field: string;
  direction: SorDirection;
}

export enum SorDirection {
  ASC = 'asc',
  DESC = 'desc',
}

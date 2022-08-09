export interface UserQueryInterface {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortKey: string;
  sortDirection: string;
}

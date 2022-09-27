export default class PaginationResult {
  rows: any[] = [];
  numberOfPages: number = 0;
  numberOfRows: number = 0;
  limit: number = 0;
  paginationRequired: number = 0;
  noRecordFound: boolean = false;
}

interface IPaginationCustomResult {
  pageNumbers: number;
  resultPerPage: number;
  result: any;
}

export const paginationCustomResult = (data: IPaginationCustomResult) => {
  const { pageNumbers, resultPerPage, result } = data;
  const count = result?.length || 0;
  return {
    count,
    next: count < resultPerPage ? null : pageNumbers + 1,
    previous: pageNumbers - 1,
    results: result,
  };
};

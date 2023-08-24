interface IPaginationCustomResult {
  pageNumbers: number;
  resultPerPage: number;
  result: any;
  totalResultCount: number;
}

export const paginationCustomResult = (data: IPaginationCustomResult) => {
  const { pageNumbers, resultPerPage, result, totalResultCount } = data;
  return {
    count: totalResultCount,
    currentPage: pageNumbers,
    previous: pageNumbers > 1 ? pageNumbers - 1 : null,
    next:
      resultPerPage * pageNumbers < totalResultCount ? pageNumbers + 1 : null,
    totalPages: Math.ceil(totalResultCount / resultPerPage),
    results: result,
  };
};

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
    totalPages: Math.ceil(totalResultCount / resultPerPage),
    currentPage: pageNumbers,
    previous: pageNumbers > 1 ? pageNumbers - 1 : null,
    next:
      resultPerPage * pageNumbers < totalResultCount ? pageNumbers + 1 : null,
    results: result,
  };
};

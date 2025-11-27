import React, { useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import bidService from '../../service/bid.service'
// import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table'
import { EyeIcon } from '../../icons'
import { useNavigate } from 'react-router'
import { currenySymbol } from '../../helper/currencySymbol'

const BidListing = () => {
  const { fn, data } = useFetch(bidService.getBids)
  const [text, setText] = React.useState('')
  const [limit, _] = React.useState(10);
  const [page, setPage] = React.useState(1)
  const totalBids = data?.totalBids || 0;
  const totalPages = Math.ceil(totalBids / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalBids);
  const navigate = useNavigate()
  function handlePrev(){
    if(page > 1){
      setPage(page - 1)
    }
  }
    const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

    const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      // If few pages, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first and last page
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  useEffect(() => {
    fn(limit, page, text)
  }, [text, limit, page])

    function handleTextSearch(e: any) {
    e.preventDefault();
    const searchTerm = e.target[0].value;
    setText(searchTerm);
  }

  function showProductBids(productObj:any){
    navigate('/bid-listing-by-product/'+productObj._id)

  }
  return (
    <>
      <form
        onSubmit={handleTextSearch}
        className="flex items-center justify-end ml-auto max-w-xs mb-3 ">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <button
          type="submit"
          className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto sm:h-[calc(100vh-250px)]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Product Name
                </TableCell>
                 <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Brand
                </TableCell>
                 <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Product Budget
                </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Total Bid
                </TableCell>
                   {/* <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Budget Quation
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Buyer
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Seller
                </TableCell> */}

                {/* <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell> */}
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Preview Bid
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data && data?.bids.map((entry: any) => (
                <TableRow key={entry._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
                        <img
                            className='w-full h-full object-contain'
                          src={entry.productDetails.image || "/no-image.webp"}
                          alt={`${entry.productDetails.title} `}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {entry.productDetails.title}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry.productDetails?.brand }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {currenySymbol(entry.productDetails?.minimumBudget) || 0}
                  </TableCell>
                  
                         <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry?.totalBidsPerProduct || 0}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry?.budgetQuation || "N/A"}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry.buyerId.firstName} {entry.buyerId.lastName}
                  </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry.sellerId.firstName} {entry.sellerId.lastName}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="md"
                      color={entry?.status?.toLowerCase() === "active" ? "success" : "error"}
                    >
                      <span className="capitalize">{entry.status}</span>
                    </Badge>
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex items-center gap-2">
                  
                    <div
                      onClick={() => { showProductBids(entry) }}
                      className="bg-green-200 inline-flex justify-center items-center p-1 text-green-600 rounded-lg cursor-pointer">
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-800 dark:text-white">
              Showing
              <span className="font-medium px-1">{start}</span>
              to
              <span className="font-medium px-1">{end}</span>
              of
              <span className="font-medium px-1">{totalBids}</span>
              results
            </p>

            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              {/* Previous */}
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`relative inline-flex items-center dark:text-white rounded-l-md px-2 py-2 text-sm font-medium ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="sr-only">Previous</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dynamic Page Numbers */}
              {pageNumbers.map((num, index) =>
                num === "..." ? (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 dark:text-white"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setPage(num as number)}
                    className={`relative inline-flex items-center dark:text-white px-4 py-2 text-sm font-semibold ${page === num
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {num}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`relative inline-flex items-center dark:text-white rounded-r-md px-2 py-2 text-sm font-medium ${page === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="sr-only">Next</span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

    </>
  )
}

export default BidListing
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import { PencilIcon } from '../../icons';
import { useFetch } from '../../hooks/useFetch';
import { AnalyticsInstance } from '../../service/analytics.service';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Label from '../../components/form/Label';
import FileInput from '../../components/form/input/FileInput';
import Input from '../../components/form/input/InputField';
import TextArea from '../../components/form/input/TextArea';
import { toast } from 'sonner';

const AllProducts = () => {
  const {fn:getAllProductsFn,data:getAllProductsRes}= useFetch(AnalyticsInstance.getAllProducts)
  const {fn:getProductByIdFn,data:getProductByIdRes}= useFetch(AnalyticsInstance.getProductById)
  const {fn:updateProductFn,data:updateProductRes,loading}= useFetch(AnalyticsInstance.updateProduct)
  const[file,setFile]= useState<null|File>(null)
  const [limit,_]= useState(10);
  const [page,setPage]= useState(1);
  const [text,setText]= useState("");
  const [updateForm,setUpdateForm]=useState({
    image:null,
    title:"",
    budget:"",
    description:"",
  })
  useEffect(()=>{
    getAllProductsFn(limit,page,text)
  },[limit,page,text])
  const totalproducts = getAllProductsRes?.totalProducts || 0;
  const totalPages = Math.ceil(totalproducts / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalproducts);
  const[currentProductId,setCurrentProductId]=useState(null)
  const [open,setOpen] = useState(false)

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
  function handleTextSearch(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    console.log()
    setText(e.currentTarget.text.value)
    
  }

   const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  async function handleProductUpdate(entry:any){
    setOpen(true);
    setCurrentProductId(entry._id)
   await getProductByIdFn(entry._id)
  }

  useEffect(()=>{
   if(getProductByIdRes){
      setUpdateForm({
        title:getProductByIdRes.title,
        description:getProductByIdRes.description,
        budget:getProductByIdRes.minimumBudget,
        image:getProductByIdRes.image
      })
   } 
  },[getProductByIdRes])

  function handleFileChange(e:any){
    const file = e.target.files[0];
    if(file){
      setFile(file)
    }
  }

  async function handleUpdateProductForm(e:React.FormEvent<HTMLFormElement>){
       e.preventDefault();
    if(updateForm.budget <= eval('0')){
      toast.error('Budget must be greater than 0')
      return;
    }
 
    const formData = new FormData();
    formData.append("title",updateForm.title)
    formData.append("description",updateForm.description)
    formData.append("minimumBudget",updateForm.budget)
    if(file) formData.append("image",file)
    await updateProductFn(formData,currentProductId)
  }

  useEffect(()=>{
    if(updateProductRes){
      setOpen(false)
      setUpdateForm({
        title:'',
        description:'',
        budget:'',
        image:null
      })
      setFile(null)
      getAllProductsRes.products =getAllProductsRes?.products.map((prt:any)=>{
        if(prt._id.toString() === currentProductId){
          return updateProductRes
        }
        return prt
      })
      setCurrentProductId(null)
    }
  },[updateProductRes])
  return (
    <>
  {/* Modal */}
  <Dialog open={open} onClose={setOpen} className="relative z-99">
        <DialogBackdrop
          transition
          className="fixed inset-0   transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                 <div className='flex items-center gap-3'> 
                   <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 sm:mx-0 sm:size-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>

                  </div>
                   <DialogTitle as="h3" className="text-base font-semibold text-white">
                      Update Product
                    </DialogTitle>
                 </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                   
                    <div className="mt-2 Toggle switch input text-white">
                         <form
  className="mt-5 text-white grid space-y-3 w-full"
  onSubmit={handleUpdateProductForm}
>
  <div className="w-full">
    <Label className="text-white">Product Image</Label>
    <div className="grid grid-cols-12 gap-3">
      <FileInput
        onChange={handleFileChange}
        className="custom-class text-white col-span-8"
        props={{accept:"image/png, image/jpeg, image/jpg"}}
      />
      {file ? 
      <div className="col-span-4 flex justify-end items-center">
          <div className="w-20 h-full">
            <img
            src={URL.createObjectURL(file)}
            alt="Selected Preview"
            className="w-full h-full object-contain rounded-md border border-gray-600"
          />
          </div>
        </div> : updateForm.image && (
        <div className="col-span-4 flex justify-end items-center">
          <div className="w-20 h-full">
            <img
              src={getProductByIdRes?.image}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )
      }
    </div>
    {file ? 
    <Label className="text-sm text-gray-400 mt-2">
        Current file: {file.name}
      </Label>
     : updateForm.image && (
      <Label className="text-sm text-gray-400 mt-2">
        Current file: {(updateForm.image as any).toString().split("/").pop()}
      </Label>
    )
    }
  </div>

  <div>
    <Label htmlFor="inputTwo" className="text-white">
      Title
    </Label>
    <Input
      type="text"
      id="inputTwo"
      placeholder="Title..."
      value={updateForm.title}
      className="text-white"
      onChange={(e) =>
        setUpdateForm({ ...updateForm, title: e.target.value })
      }
    />
  </div>

  <div>
    <Label htmlFor="inputTwo2" className="text-white">
      Budget
    </Label>
    <Input
      type="number"
      id="inputTwo2"
      placeholder="Enter the Budget..."
      value={updateForm.budget}
      className="text-white"
      onChange={(e) =>
        setUpdateForm({ ...updateForm, budget: e.target.value })
      }
    />
  </div>

 <div>
    <Label htmlFor="inputTwo3" className="text-white">
      Description
    </Label>
    <TextArea
      placeholder="Enter the Budget..."
      value={updateForm.description}
      className="text-white"
      onChange={(value) =>setUpdateForm({ ...updateForm, description:value })}
    />
  </div>

   <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                disabled={loading}
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                  {
                    loading ? 'Updating...': 'Update'
                  }
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
</form>

                    </div>
                  </div>
                </div>
              </div>
          
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    <form
    onSubmit={handleTextSearch}
    className="flex items-center justify-end ml-auto max-w-xs mb-3 ">
  <label htmlFor="simple-search" className="sr-only">
    Search
  </label>
  <div className="relative w-full">
    <input
      type="text"
      name='text'
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
                Title
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Brand
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Category
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Budget
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Description
              </TableCell>

              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
       
            {getAllProductsRes?.products.length !== 0  && getAllProductsRes?.products.map((entry: any) => (
              <TableRow key={entry._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={entry.image || "/no-image.webp"}
                        alt={`${entry?.title}`}
                      />
                    </div>
                    <div>
                      <span className="block capitalize font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {entry?.title}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 capitalize text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {entry.brand || 'N/A'}
                </TableCell>
                  <TableCell className="px-4 py-3 capitalize text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {entry?.categoryId?.categoryName || 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {entry?.minimumBudget || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {entry.description ||  'N/A'}
                </TableCell>
    
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="bg-red-200 inline-flex justify-center items-center p-1 text-red-600 rounded-lg cursor-pointer">
                    <PencilIcon className="text-lg" 
                    onClick={()=>{
                      handleProductUpdate(entry)   
                    }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <></>
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
            <span className="font-medium px-1">{totalproducts}</span>
            results
          </p>

          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            {/* Previous */}
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`relative inline-flex items-center dark:text-white rounded-l-md px-2 py-2 text-sm font-medium ${
                page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
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
                  className={`relative inline-flex items-center dark:text-white px-4 py-2 text-sm font-semibold ${
                    page === num
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
              className={`relative inline-flex items-center dark:text-white rounded-r-md px-2 py-2 text-sm font-medium ${
                page === totalPages
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

export default AllProducts
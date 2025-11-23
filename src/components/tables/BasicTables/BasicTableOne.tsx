import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Switch from "../../form/switch/Switch";
import Badge from "../../ui/badge/Badge";
import { EyeIcon, PencilIcon } from "../../../icons";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useState } from "react";
import { UserServiceInstance } from "../../../service/user.service";
import { useFetch } from "../../../hooks/useFetch";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { toast } from "sonner";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Button from "../../ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { useForm, Controller } from "react-hook-form"
export default function BasicTableOne({ data, limit, page, setPage, setText }: any) {
  const { fn: geteUserFn, data: getUserData } = useFetch(UserServiceInstance.getUserById)
  const { fn: updateUserFn, data: updateUserData,loading:userUpdateLoading } = useFetch(UserServiceInstance.updateUser)
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
      createdAt: "",
      lastLogin: "",
    }
  })
  const totalUsers = data?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / limit);
  const { isOpen, openModal, closeModal } = useModal();
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalUsers);
  const [open, setOpen] = useState(false)
  const [userStatus, setUserStatus] = useState("")
  const [isChecked, setIsChecked] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // --- Generate visible page numbers (with dots)
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

  async function handleUserPermission(entry: any) {
    setOpen(true);
    setIsChecked(entry?.status === "inactive" ? true : false);
    setUserStatus(entry?.status || "active");
    await geteUserFn(entry._id);
  }


  function handleTextSearch(e: any) {
    e.preventDefault();
    const searchTerm = e.target[0].value;
    setText(searchTerm);
  }

  useEffect(() => {
    if (updateUserData && !isOpen) {
      toast.success("User status updated successfully");
      data?.users.forEach((user: any) => {
        if (user._id === updateUserData._id) {
          user.status = updateUserData.status;
        }
      })
      setOpen(false);
      setIsTouched(false)
    }
  }, [updateUserData])

  useEffect(() => {
    if (data?.users && getUserData) {
      setText(null)
    }
  }, [data?.users])



  async function fetchUserDetails(entry: any) {
    openModal();
    await geteUserFn(entry._id);
  }

  // only use preview data when modal is open
  useEffect(() => {
    if (getUserData) {
      console.log(getUserData)
      Object.keys(getValues()).forEach((key) => {
        if (key === 'phone') {
          const phoneValue = getUserData[key].split('+91')[1] || '';
          setValue(key as any, phoneValue);
          return;
        }
        console.log(key)
        if ((key === 'createdAt' || key === 'lastLogin') && getUserData[key]) {
          const date = new Date(getUserData[key]);
          const formattedDate = date.toISOString().split('T')[0];
          setValue(key as any, formattedDate);
          return;
        }
        setValue(key as any, getUserData[key]);
      });
    }
  }, [getUserData]);

  console.log(getValues())



  async function onSubmit(data: any) {
    data.phone = '+91' + data.phone;
    await updateUserFn(getUserData._id, data);
  }

  useEffect(()=>{
    if(updateUserData && isOpen){
      toast.success("User details updated successfully")
      closeModal();
      
    }
  },[updateUserData])
  return (
    <>
      {/* User Details */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit, (errors) => {
            const errorKeys = Object.keys(errors);
            console.log(errorKeys)
            if (errorKeys.length > 0) {
              errorKeys.forEach((key) => {
                const error = errors[key as keyof typeof errors];
                if (error?.message) {
                  toast.error(error.message as string);
                }
              });
            }
          })}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* <div>
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Social Links
                  </h5>
  
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        type="text"
                        value="https://www.facebook.com/PimjoHQ"
                      />
                    </div>
  
                    <div>
                      <Label>X.com</Label>
                      <Input type="text" value="https://x.com/PimjoHQ" />
                    </div>
  
                    <div>
                      <Label>Linkedin</Label>
                      <Input
                        type="text"
                        value="https://www.linkedin.com/company/pimjo"
                      />
                    </div>
  
                    <div>
                      <Label>Instagram</Label>
                      <Input type="text" value="https://instagram.com/PimjoHQ" />
                    </div>
                  </div>
                </div> */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text"
                      onChange={(e: any) => setValue("firstName", e.target.value)}
                      props={{ ...register("firstName", { required: "Invalid firstname", minLength: 2 }) }}
                      placeholder="Enter your firstname..."
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text"
                      onChange={(e: any) => setValue("lastName", e.target.value)}
                      props={{ ...register("lastName", { required: 'Invalid lastname', minLength: 2 }) }}
                      placeholder="Enter your lastname..." />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="email"
                      onChange={(e: any) => setValue("email", e.target.value)}
                      props={{ ...register("email", { required: "Invalid email", minLength: 5, pattern:{
                        value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message:"Invalid email address"
                      }}) }}
                      placeholder="xyz@masterunion.com" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="tel"
                     maxLength={10}
                      onChange={(e: any) => setValue("phone", e.target.value)}
                      props={{ ...register("phone", { required: "Invalid phone number",pattern:{
                        value:/^[0-9]{10}$/,
                        message:"Phone number must be 10 digits"
                      } }) }}
                      placeholder="Enter your phone number..." />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>User Created Date</Label>
                    <Input type="date"
                      disabled={true}

                      props={{ ...register("createdAt") }}
                      placeholder="Enter your phone number..." />
                  </div>
                  {
                    getValues('lastLogin') && <div className="col-span-2 lg:col-span-1">
                    <Label>Last Login</Label>
                    <Input type="date"
                      disabled={true}
                      props={{ ...register("lastLogin") }}
                    />
                  </div>
                  }
                  <div className="col-span-2">
                    <Label>Address</Label>
                    {/* */}
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Address is required" }} // Add validation if needed
                      render={({ field }) => (
                        <TextArea

                          placeholder="Address..."
                          value={field.value}
                          onChange={(text: string) => field.onChange(text)}
                          props={{
                            name: field.name,
                            onBlur: field.onBlur,
                            ref: field.ref
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" >
                {
                  userUpdateLoading ? 'Save Changes...' : 'Save Changes'
                }
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-white">
                      Deactivate account
                    </DialogTitle>
                    <div className="mt-2 Toggle switch input text-white">
                      <Switch
                        defaultChecked={userStatus === "inactive" ? true : false}
                        onChange={() => {
                          setIsTouched(true);
                          setIsChecked(!isChecked)
                        }}
                        label="Do you want to Disable this User ?" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={
                    () => {
                      if (!isTouched) return;
                      updateUserFn(getUserData._id, { status: isChecked ? "inactive" : "active" });
                    }}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                  Update
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
                  User
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Address
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Number
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data?.users.map((entry: any) => (
                <TableRow key={entry._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={entry.profileImage || "/avatar.jpg"}
                          alt={`${entry.firstName} ${entry.lastName}`}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {entry.firstName} {entry.lastName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry?.address || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {entry.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="md"
                      color={entry?.status?.toLowerCase() === "active" ? "success" : "error"}
                    >
                      <span className="capitalize">{entry.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex items-center gap-2">
                    <div className="bg-red-200 inline-flex justify-center items-center p-1 text-red-600 rounded-lg cursor-pointer">
                      <PencilIcon className="text-lg"
                        onClick={() => {
                          handleUserPermission(entry)
                        }}
                      />
                    </div>
                    <div
                      onClick={() => { fetchUserDetails(entry) }}
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
              <span className="font-medium px-1">{totalUsers}</span>
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
  );
}

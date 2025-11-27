import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router";

// Define the TypeScript interface for the table rows
// interface Product {
//   id: number; // Unique identifier for each product
//   name: string; // Product name
//   variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
//   category: string; // Category of the product
//   price: string; // Price of the product (as a string with currency symbol)
//   // status: string; // Status of the product
//   image: string; // URL or path to the product image
//   status: "Delivered" | "Pending" | "Canceled"; // Status of the product
// }

// Define the table data using the interface
// const tableData: Product[] = [
//   {
//     id: 1,
//     name: "MacBook Pro 13”",
//     variants: "2 Variants",
//     category: "Laptop",
//     price: "$2399.00",
//     status: "Delivered",
//     image: "/images/product/product-01.jpg", // Replace with actual image URL
//   },
//   {
//     id: 2,
//     name: "Apple Watch Ultra",
//     variants: "1 Variant",
//     category: "Watch",
//     price: "$879.00",
//     status: "Pending",
//     image: "/images/product/product-02.jpg", // Replace with actual image URL
//   },
//   {
//     id: 3,
//     name: "iPhone 15 Pro Max",
//     variants: "2 Variants",
//     category: "SmartPhone",
//     price: "$1869.00",
//     status: "Delivered",
//     image: "/images/product/product-03.jpg", // Replace with actual image URL
//   },
//   {
//     id: 4,
//     name: "iPad Pro 3rd Gen",
//     variants: "2 Variants",
//     category: "Electronics",
//     price: "$1699.00",
//     status: "Canceled",
//     image: "/images/product/product-04.jpg", // Replace with actual image URL
//   },
//   {
//     id: 5,
//     name: "AirPods Pro 2nd Gen",
//     variants: "1 Variant",
//     category: "Accessories",
//     price: "$240.00",
//     status: "Delivered",
//     image: "/images/product/product-05.jpg", // Replace with actual image URL
//   },
// ];

type Props={
  raws:any
}

export default function RecentOrders({raws}:Props) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Products
          </h3>
        </div>

        <div className="flex items-center gap-3">
        
          <button
          onClick={()=>navigate('/all-products')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
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
                    </TableRow>
                  </TableHeader>
          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {raws?.map((product:any) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md ">
                      <img
                        src={product.image || '/no-image.webp'}
                        className="object-contain h-full w-full"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.title}
                      </p>
                      {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.variants}
                      </span> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 ">
                  {product?.brand}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product?.categoryId?.categoryName}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product?.minimumBudget || 0}
                </TableCell>
                 <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product?.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

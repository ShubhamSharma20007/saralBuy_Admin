import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useFetch } from "../../hooks/useFetch";
import { AnalyticsInstance } from "../../service/analytics.service";
import { useEffect } from "react";

export default function Home() {
  const {fn,data} = useFetch(AnalyticsInstance.dashboardAnalytcs);
  const {fn:productAnalyticsFn,data:productAnalytics} = useFetch(AnalyticsInstance.getProductAnalytcs);
  const {fn:subcatgoryProductsFn,data:subcatgoryProductsRes} = useFetch(AnalyticsInstance.subCategoryProducts);


  useEffect(()=>{
   fn();
   productAnalyticsFn();
  },[])

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics data={data}/>

          <MonthlySalesChart  data={productAnalytics} />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12">
          <StatisticsChart fn={subcatgoryProductsFn} data={subcatgoryProductsRes} />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 xl:col-span-12">
          <RecentOrders raws={data?.recentProductCreated} />
        </div>
      </div>
    </>
  );
}

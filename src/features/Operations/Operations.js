import React, { useEffect, useState } from "react";

import { useSales } from "../../context/SalesProvider";
import { useGrossProfits } from "../../context/GrossProfitsProvider";
import { useJobs } from "../../context/JobsProvider";
import { useTimeSheet } from "../../context/TimeSheetProvider";
import {
  calculateGrossProfitLast12Months,
  calculateSalesLast12Months,
  calculateTotalHours,
  calculateTotalHoursLast12Months,
  calculateTotalJobs,
  monthNamesMap,
} from "../../helper/utility";
import { MyCard } from "../../components/MyCard";

export const Operations = () => {
  const [items, setItems] = useState({});
  const {
    sales,
    isLoading: isSalesLoading,
    error: salesError,
  } = useSales();

  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    error: grossProfitsError,
  } = useGrossProfits();

  const {
    jobs,
    isLoading: isJobsLoading,
    error: jobsError,
  } = useJobs();

  const {
    timeSheetEntries,
    isLoading: isTimeSheetLoading,
    error: timeSheetError,
  } = useTimeSheet();

  
  // Data Processing
  // Gross Profit Margin
  useEffect(() => {
    if (sales && grossProfits) {
      const saleThisMonth = parseFloat(sales.data[sales.data.length - 1]);
      const profitThisMonth = parseFloat(
        grossProfits.data[grossProfits.data.length - 1]
      );
      const salesLast12Months = calculateSalesLast12Months(sales.data);
      const profitLast12Months = calculateGrossProfitLast12Months(
        grossProfits.data
      );

      const GPMLast12Months =
        salesLast12Months === 0
          ? 0
          : (profitLast12Months / salesLast12Months) * 100;
      const GPMThisMonth =
        saleThisMonth === 0 ? 0 : (profitThisMonth / saleThisMonth) * 100;

      const subscripts = [
        "Gross Profit Margin Last 12 Months: " +
          GPMLast12Months.toFixed(2).toString(),
        "Gross Profit This Month: " + GPMThisMonth.toFixed(2).toString(),
      ];
      setItems((items) => {
        return {
          ...items,
          GPM: {
            name: "Gross Profit Margin",
            subscripts: subscripts,
            navigateTo: "/Operations/GrossProfitMargin",
          },
        };
      });
    }
  }, [sales, grossProfits]);

  // Revenue Per Labour Hour
  useEffect(() => {
    if (sales && timeSheetEntries) {
      const salesLast12Months = calculateSalesLast12Months(sales.data);
      const saleThisMonth = parseFloat(sales.data[sales.data.length - 1]);
      const hoursLast12Months = calculateTotalHours(timeSheetEntries);
      const date = new Date();
      const hoursThisMonth =
        calculateTotalHoursLast12Months(timeSheetEntries)[
          monthNamesMap[date.getMonth()] + " " + date.getFullYear().toString()
        ];
      const rlhThisMonth =
        hoursThisMonth === 0 ? 0 : saleThisMonth / hoursThisMonth;
      const rlhLast12Months =
        hoursLast12Months === 0 ? 0 : salesLast12Months / hoursLast12Months;
      const subscripts = [
        "Revenue Per Labour Hour this month: " +
          rlhThisMonth.toFixed(2).toString(),
        "Revenue Per Labour Hour last 12 months: " +
          rlhLast12Months.toFixed(2).toString(),
        "Total Hours Last 12 months: " +
          hoursLast12Months.toFixed(2).toString(),
      ];
      setItems((items) => {
        return {
          ...items,
          RLH: {
            name: "Revenue Per Labour Hour",
            subscripts: subscripts,
            navigateTo: "/Operations/RevenuePerLabourHour",
          },
        };
      });
    }
  }, [sales, timeSheetEntries]);

  // Jobs Data Processing

  useEffect(() => {
    if (sales && jobs && grossProfits) {
      // const date=new Date();
      // const saleThisMonth = parseFloat(sales.data[sales.data.length - 1]);
      // const jobsThisMonth=calculateTotalJobsLast12Months(jobs)[
      //   monthNamesMap[date.getMonth()] + " " + date.getFullYear().toString()
      // ];

      // const profitThisMonth = parseFloat(
      //   grossProfits.data[grossProfits.data.length - 1]
      // );
      const salesLast12Months = calculateSalesLast12Months(sales.data);
      const jobsLast12Months = calculateTotalJobs(jobs);
      const profitLast12Months = calculateGrossProfitLast12Months(
        grossProfits.data
      );

      const avgJobSizeLast12Months =
        jobsLast12Months === 0 ? 0 : salesLast12Months / jobsLast12Months;
      const avgProfitPerJobLast12Months =
        jobsLast12Months === 0 ? 0 : profitLast12Months / jobsLast12Months;

      const subscripts = [
        "Average Job Size Last 12 months: " +
          avgJobSizeLast12Months.toFixed(2).toString(),
        "Average Profit Per Job for Last 12 months: " +
          avgProfitPerJobLast12Months.toFixed(2).toString(),
        "Total Jobs Last 12 months: " + jobsLast12Months.toString(),
      ];
      setItems((items) => {
        return {
          ...items,
          jobs: {
            name: "Jobs",
            subscripts: subscripts,
            navigateTo: "/Operations/JobsDetails",
          },
        };
      });
    }
  }, [sales, jobs, grossProfits]);

  // Errors
  if (timeSheetError) return <p>{JSON.stringify(timeSheetError)}</p>;
  if (grossProfitsError) return <p>{JSON.stringify(grossProfitsError)}</p>;
  if (salesError) return <p>{JSON.stringify(salesError)}</p>;
  if (jobsError) return <p>{JSON.stringify(timeSheetError)}</p>;

  return (
    <div>
      {isGrossProfitLoading ||
      isJobsLoading ||
      isSalesLoading ||
      isTimeSheetLoading ? (
        <div> Loading..</div>
      ) : (
        <div>
          <ol>
            {Object.keys(items).map((item, index) => (
              <MyCard
                key={index}
                title={items[item].name}
                subscripts={items[item].subscripts}
                navigateTo={items[item].navigateTo}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

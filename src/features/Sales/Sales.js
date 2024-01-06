import React, { useEffect, useState } from "react";
import { MyCard } from "../../components/MyCard";
import { useSales } from "../../context/SalesProvider";
import { useJobs } from "../../context/JobsProvider";
import {
  getMonthAndYear,
  monthNamesMap,
  CalculateCustomers,
} from "../../helper/utility";
import Loading from "../../reusable/loading";
import Greeting from "../../reusable/goodgood";

export const Sales = () => {
  const [isLoadingQBData, setIsLoadingQBData] = useState(true);
  const [items, setItems] = useState({});
  const { sales, isLoading: isSalesLoading, error: salesError } = useSales();
  const { jobs, isLoading: isJobsLoading, error: jobsError } = useJobs();

  useEffect(() => {
    if (jobs) {
      let data = [];

      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        data.push({
          month:
            monthNamesMap[new Date(year, month).getMonth()] +
            " " +
            year.toString(),
          ...CalculateCustomers(month, year, jobs),
        });
      }
      const customerSubscripts = [
        "New Customers This Month: " + data[11].new.toString(),
        "Recurring Customers This Month: " + data[11].recurring.toString(),
        "No of Customers for Last 12 Months: " +
          data
            .reduce((total, month) => {
              return month.new + total + month.recurring;
            }, 0)
            .toString(),
      ];

      const Leads = [
        "Leads This Month: " + data[11].leads.toString(),
        "No of Leads for Last 12 Months: " +
          data
            .reduce((total, month) => {
              return month.leads + total;
            }, 0)
            .toString(),
      ];
      setItems((items) => {
        return {
          ...items,
          Customers: {
            name: "Customers",
            subscripts: customerSubscripts,
            navigateTo: "/Sales/Customers",
          },
        };
      });
      setItems((items) => {
        return {
          ...items,
          Leads: {
            name: "No of Leads",
            subscripts: Leads,
            navigateTo: "/Sales/Leads",
          },
        };
      });
    }
  }, [jobs]);

  useEffect(() => {
    const init = async () => {
      const { data: salesLast12Months } = sales;
      let Sales = [
        "Sales This Month: " +
          (isNaN(parseFloat(salesLast12Months[salesLast12Months.length - 1]))
            ? 0
            : parseFloat(salesLast12Months[salesLast12Months.length - 1])
          ).toString(),
        "Sales for the Last 12 Months: " +
          salesLast12Months
            .reduce((Totalsales, sale) => {
              const saleInFloat = parseFloat(sale);
              if (isNaN(saleInFloat)) return Totalsales;
              return Totalsales + parseFloat(sale);
            }, 0)
            .toString(),
      ];
      setItems((items) => {
        return {
          ...items,
          Sales: {
            name: "Sales",
            subscripts: Sales,
            navigateTo: "/Sales/SalesDetails",
          },
        };
      });
      setIsLoadingQBData(false);
    };

    if (isLoadingQBData && sales) init();
  }, [isLoadingQBData, setIsLoadingQBData, sales]);

  if (salesError) return <p>{JSON.stringify(salesError)}</p>;

  if (jobsError) return <p>{JSON.stringify(jobsError)}</p>;
  return (
    <div>
      {isLoadingQBData || isJobsLoading || isSalesLoading ? (
        <Loading />
      ) : (
        <div>
          <Greeting />
          <ol>
            {Object.keys(items).map((item, index) => (
              <div>
                <MyCard
                  key={index}
                  title={items[item].name}
                  subscripts={items[item].subscripts}
                  navigateTo={items[item].navigateTo}
                />
              </div>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";

import {
  calculateTotalHoursLast12Months,
  getMonthAndYear,
  monthNamesMap,
} from "../../helper/utility";
import { DetailsPage } from "../../components/DetailsPage";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSales } from "../../context/SalesProvider";
import { useTimeSheet } from "../../context/TimeSheetProvider";
import Loading from "../../reusable/loading";

export const RevenuePerHour = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "Revenue Per Labour Hour", dataIndex: "rlhDisplay", key: "rlh" },
    { title: "Hours", dataIndex: "hours", key: "hours" },
  ];
  const { sales, isLoading: isSalesLoading, error: salesError } = useSales();
  const {
    timeSheetEntries,
    isLoading: isTimeSheetLoading,
    error: timeSheetError,
  } = useTimeSheet();

  const MyChart = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend
            content={(props) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {props.payload.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "20px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: entry.color,
                          width: "10px",
                          height: "10px",
                          marginRight: "5px",
                        }}
                      ></div>
                      <div style={{ lineHeight: "20px" }}>
                        {entry.value === "rlh" ? "Rev/Hr" : entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Bar dataKey="rlh" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Revenue Per Labour Hour
  useEffect(() => {
    if (sales && timeSheetEntries) {
      const data = [];
      const timesheetMap = calculateTotalHoursLast12Months(timeSheetEntries);
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        const sale = parseFloat(sales.data[i]);
        const monthKey =
          monthNamesMap[new Date(year, month).getMonth()] +
          " " +
          year.toString();
        const hours = timesheetMap[monthKey];
        const rlh = hours === 0 ? 0 : sale / hours;
        data.push({
          month: monthKey,
          rlh: rlh.toFixed(2),
          rlhDisplay: rlh.toFixed(2).toString(),
          hours: hours.toFixed(2),
        });
      }

      setData([...data]);
    }
  }, [sales, timeSheetEntries]);
  if (timeSheetError) return <p>{JSON.stringify(timeSheetError)}</p>;
  if (salesError) return <p>{JSON.stringify(salesError)}</p>;
  return (
    <div>
      {isSalesLoading || isTimeSheetLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Revenue Per Labor"}
          Description={
            "Total Revenue / Sum of All Recorded Labor Hours (Does not include flat pay work)"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

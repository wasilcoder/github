import { useEffect, useState } from "react";
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
import { getMonthAndYear, monthNamesMap } from "../../helper/utility";
import Loading from "../../reusable/loading";

export const SalesDetails = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "Total Sales", dataIndex: "totalSales", key: "totalSales" },
  ];
  const { sales, isLoading: isSalesLoading, error: salesError } = useSales();

  useEffect(() => {
    if (sales) {
      const temp = [];
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        temp.push({
          month:
            monthNamesMap[new Date(year, month).getMonth()] +
            " " +
            year.toString(),
          totalSales: sales.data[11 - i],
        });
      }

      setData([...temp]);
    }
  }, [sales]);

  const MyChart = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (salesError) return <p>{JSON.stringify(salesError)}</p>;

  return (
    <div>
      {isSalesLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Sales History"}
          Description={"Sales Completed and Paid for the last 12 Months"}
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

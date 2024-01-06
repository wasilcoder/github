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
import { getMonthAndYear, monthNamesMap } from "../../helper/utility";
import { useGrossProfits } from "../../context/GrossProfitsProvider";
import Loading from "../../reusable/loading";

export const GrossProfitDetails = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Gross Profit", dataIndex: "grossProfit", key: "grossProfit" },
  ];
  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    error: grossProfitError,
  } = useGrossProfits();

  useEffect(() => {
    if (grossProfits) {
      const temp = [];
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        temp.push({
          month:
            monthNamesMap[new Date(year, month).getMonth()] +
            " " +
            year.toString(),
          grossProfit: grossProfits.data[11 - i],
        });
      }

      setData([...temp]);
    }
  }, [grossProfits]);
  const MyChart = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="grossProfit" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (grossProfitError) return <p>{JSON.stringify(grossProfitError)}</p>;

  return (
    <div>
      {isGrossProfitLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Gross Profit"}
          Description={
            "Profit Created From Operations The Last 12 Months. Total Income - COGS for the Last 12 Months"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

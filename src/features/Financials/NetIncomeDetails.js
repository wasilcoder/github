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
import { useNetIncomes } from "../../context/NetIncomesProvider";
import Loading from "../../reusable/loading";

export const NetIncomeDetails = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "Net Income", dataIndex: "netIncome", key: "netIncome" },
  ];
  const {
    netIncomes,
    isLoading: isNetIncomeLoading,
    error: netIncomeError,
  } = useNetIncomes();

  useEffect(() => {
    if (netIncomes) {
      const temp = [];
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        temp.push({
          month:
            monthNamesMap[new Date(year, month).getMonth()] +
            " " +
            year.toString(),
          netIncome: netIncomes.data[11 - i],
        });
      }

      setData([...temp]);
    }
  }, [netIncomes]);

  const MyChart = ({ data }) => {
    // Calculate the range of values in the data
    const minValue = Math.min(...data.map((item) => item.netIncome));
    const maxValue = Math.max(...data.map((item) => item.netIncome));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[minValue, maxValue]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="netIncome" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (netIncomeError) return <p>{JSON.stringify(netIncomeError)}</p>;

  return (
    <div>
      {isNetIncomeLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Net Income"}
          Description={
            "Total Profit from All Business Activities. Total Income - COGS - Expenses"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

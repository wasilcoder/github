import { useEffect, useState } from "react";
import { useGrossProfits } from "../../context/GrossProfitsProvider";
import { useSales } from "../../context/SalesProvider";
import { getMonthAndYear, monthNamesMap } from "../../helper/utility";
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
import Loading from "../../reusable/loading";

export const GrossProfitMargin = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "Gross Profit Margin", dataIndex: "gpmDisplay", key: "gpm" },
  ];
  const { sales, isLoading: isSalesLoading, error: salesError } = useSales();

  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    error: grossProfitsError,
  } = useGrossProfits();

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
                        {entry.value === "gpm"
                          ? "Gross Profit Margin"
                          : entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Bar dataKey="gpm" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Gross Profit Margin
  useEffect(() => {
    if (sales && grossProfits) {
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        const sale = parseFloat(sales.data[i]);
        const profit = parseFloat(grossProfits.data[i]);
        const gpm = sale === 0 || isNaN(sale) ? 0 : (profit / sale) * 100;
        data.push({
          month:
            monthNamesMap[new Date(year, month).getMonth()] +
            " " +
            year.toString(),
          gpm: gpm.toFixed(2),
          gpmDisplay: gpm.toFixed(2).toString() + "%",
        });
      }
      setData([...data]);
    }
  }, [sales, grossProfits]);

  if (grossProfitsError) return <p>{JSON.stringify(grossProfitsError)}</p>;
  if (salesError) return <p>{JSON.stringify(salesError)}</p>;
  return (
    <div>
      {isSalesLoading || isGrossProfitLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Gross Profit Margin"}
          Description={
            "% of Each Job That Is Free Cash To Use. Defined as (Total Income - COGS) / Total Income"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

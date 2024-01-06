import { useEffect, useState } from "react";
import { DetailsPage } from "../../components/DetailsPage";
import { useJobs } from "../../context/JobsProvider";
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
import {
  getMonthAndYear,
  monthNamesMap,
  CalculateCustomers,
} from "../../helper/utility";
import Loading from "../../reusable/loading";

export const CustomerDetails = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "new", dataIndex: "new", key: "new" },
    { title: "recurring", dataIndex: "recurring", key: "recurring" },
  ];
  const { jobs, isLoading: isJobsLoading, error: jobError } = useJobs();

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
      setData([...data]);
    }
  }, [jobs]);

  const MyChart = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={1100} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="new" fill="#8884d8" />
          <Bar dataKey="recurring" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (jobError) return <p>{JSON.stringify(jobError)}</p>;

  return (
    <div>
      {isJobsLoading ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"New vs Recurring Jobs"}
          Description={
            "The Number of Client Who have Booked for the First Time This Month"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

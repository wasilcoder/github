import { useEffect, useState } from "react";
import { useGrossProfits } from "../../context/GrossProfitsProvider";
import { useSales } from "../../context/SalesProvider";
import {
  calculateTotalJobsLast12Months,
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
import { useJobs } from "../../context/JobsProvider";
import { Checkbox } from "antd";
import Loading from "../../reusable/loading";

export const JobsDetails = () => {
  const [data, setData] = useState();
  const columns = [
    { title: "month", dataIndex: "month", key: "month" },
    { title: "Avg Job Size", dataIndex: "avgJobSize", key: "avgJobSize" },
    {
      title: "Avg profit per job",
      dataIndex: "avgProfitPerJob",
      key: "avgProfitPerJob",
    },
    { title: "No. of Jobs", dataIndex: "noOfJobs", key: "noOfJobs" },
  ];
  const { sales, isLoading: isSalesLoading, error: salesError } = useSales();

  const {
    grossProfits,
    isLoading: isGrossProfitLoading,
    error: grossProfitsError,
  } = useGrossProfits();

  const { jobs, isLoading: isJobsLoading, error: jobsError } = useJobs();

  const MyChart = ({ data }) => {
    const [showAvgJobSize, setShowAvgJobSize] = useState(true);
    const [showAvgProfitPerJob, setShowAvgProfitPerJob] = useState(true);
    const [showNoOfJobs, setShowNoOfJobs] = useState(true);

    const handleAvgJobSizeToggle = () => {
      setShowAvgJobSize(!showAvgJobSize);
    };

    const handleAvgProfitPerJobToggle = () => {
      setShowAvgProfitPerJob(!showAvgProfitPerJob);
    };

    const handleNoOfJobsToggle = () => {
      setShowNoOfJobs(!showNoOfJobs);
    };
    return (
      <div>
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
                      gap: "30px",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <Checkbox
                        checked={showAvgJobSize}
                        onChange={handleAvgJobSizeToggle}
                        style={{
                          backgroundColor: "#8884d8", // Change to your desired colors
                        }}
                      >
                        Show Avg Job Size
                      </Checkbox>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Checkbox
                        checked={showAvgProfitPerJob}
                        onChange={handleAvgProfitPerJobToggle}
                        style={{
                          backgroundColor: "#FF6B6B", // Change to your desired colors
                        }}
                      >
                        Show Avg Profit Per Job
                      </Checkbox>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <Checkbox
                        checked={showNoOfJobs}
                        onChange={handleNoOfJobsToggle}
                        style={{
                          backgroundColor: "#00796B", // Change to your desired colors
                        }}
                      >
                        Show No of Jobs
                      </Checkbox>
                    </div>
                  </div>
                );
              }}
            />
            {showAvgJobSize && <Bar dataKey="avgJobSize" fill="#8884d8" />}
            {showAvgProfitPerJob && (
              <Bar dataKey="avgProfitPerJob" fill="#FF6B6B" />
            )}
            {showNoOfJobs && <Bar dataKey="noOfJobs" fill="#00796B" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // jobs
  useEffect(() => {
    if (sales && grossProfits && jobs) {
      const data = [];
      const jobsMap = calculateTotalJobsLast12Months(jobs);
      for (let i = 11; i >= 0; i--) {
        const { month, year } = getMonthAndYear(i);
        const monthKey =
          monthNamesMap[new Date(year, month).getMonth()] +
          " " +
          year.toString();
        const sale = parseFloat(sales.data[i]);
        const profit = parseFloat(grossProfits.data[i]);
        const jobsCount = jobsMap[monthKey];
        const avgJobSize = jobsCount === 0 ? 0 : sale / jobsCount;
        const avgProfitPerJob = jobsCount === 0 ? 0 : profit / jobsCount;
        data.push({
          month: monthKey,
          avgJobSize: avgJobSize.toFixed(2),
          avgProfitPerJob: avgProfitPerJob.toFixed(2),
          noOfJobs: jobsCount,
        });
      }
      setData([...data]);
    }
  }, [sales, grossProfits, jobs]);

  if (grossProfitsError) return <p>{JSON.stringify(grossProfitsError)}</p>;
  if (salesError) return <p>{JSON.stringify(salesError)}</p>;
  if (jobsError) return <p>{JSON.stringify(jobsError)}</p>;
  return (
    <div>
      {isSalesLoading || isGrossProfitLoading || isJobsLoading || !data ? (
        <Loading />
      ) : (
        <DetailsPage
          tableData={{ columns: columns, data: data }}
          Heading={"Jobs"}
          Description={
            "% of Each Job That Is Free Cash To Use. Defined as (Total Income - COGS) / Total Income"
          }
          chart={<MyChart data={data} />}
        />
      )}
    </div>
  );
};

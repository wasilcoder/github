export function addOrReplaceQueryParam(key, value) {
  if (value === null || value === undefined) return;
  const urlSearchParams = new URLSearchParams(window.location.search);
  // Check if the key is already present in the URL
  if (urlSearchParams.has(key)) {
    // If key is present, replace the existing value
    urlSearchParams.set(key, value);
  } else {
    // If key is not present, add it
    urlSearchParams.append(key, value);
  }
  const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}${
    window.location.hash
  }`;
  window.history.replaceState(null, "", newUrl);
}
export function getAllParamsFromLocation() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const paramsObject = {};
  for (const [paramName, paramValue] of urlSearchParams) {
    paramsObject[paramName] = paramValue;
  }
  return paramsObject;
}

export const monthNamesMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const createIsoDate = (month, year) => {
  let m = (month + 1).toString();
  if (m.length === 1) m = "0" + m;
  const isoDate = `${year}-${m}-01T00:00:00.000Z`;
  return isoDate;
};

export const getMonthAndYear = (howback) => {
  let month = new Date().getMonth() - howback;
  let year = new Date().getFullYear();

  if (month < 0) {
    month = 12 + month;
    year -= 1;
  }
  return { month: month, year: year };
};

export function formatDate(date) {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export const getQbToken = () => {
  return localStorage.getItem("qbToken");
};

export const getQbTokenRefresh = () => {
  return localStorage.getItem("qbTokenref_token");
};


export const CalculateCustomers = (month, year, jobs) => {
  // month is 0-11
  const newClients = {};
  const recurringClients = {};
  const leadClients = {};

  jobs.forEach((job) => {
    const jobDate = new Date(job.createdAt);
    const clientDate = new Date(job.client.createdAt);
    const noOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    const startDate = new Date(year, month);
    const endDate = new Date(year, month, noOfDaysInMonth, 23, 59, 59);

    if (
      jobDate.getTime() >= startDate.getTime() &&
      jobDate.getTime() <= endDate.getTime()
    ) {
      if (
        clientDate.getTime() >= startDate.getTime() &&
        clientDate.getTime() <= endDate.getTime()
      )
        newClients[job.client.id] = job.client.createdAt;
      else recurringClients[job.client.id] = job.client.createdAt;
      if (job.client.isLead) leadClients[job.client.id] = job.client.isLead;
    }
  });

  return {
    new: Object.keys(newClients).length,
    recurring: Object.keys(recurringClients).length,
    leads: Object.keys(leadClients).length,
  };
};

export const calculateTotalHours = (timeSheetEntries) => {
  const totalSeconds = timeSheetEntries.reduce(
    (totalSeconds, timeSheetEntry) => {
      return totalSeconds + timeSheetEntry.visitDurationTotal;
    },
    0
  );
  return totalSeconds / 3600;
};

export const calculateSalesLast12Months = (sales) => {
  return sales.reduce((totalSales, sales) => {
    return totalSales + parseFloat(sales);
  }, 0);
};

export const calculateGrossProfitLast12Months = (grossProfits) => {
  return grossProfits.reduce((totalGrossProfit, grossProfit) => {
    return totalGrossProfit + parseFloat(grossProfit);
  }, 0);
};

export const calculateTotalHoursLast12Months = (timeSheetEntries) => {
  const timeSheetMap = {};
  for (let i = 11; i >= 0; i--) {
    const { month, year } = getMonthAndYear(i);
    timeSheetMap[
      monthNamesMap[new Date(year, month).getMonth()] + " " + year.toString()
    ] = 0;
  }
  timeSheetEntries.forEach((timeSheetEntry) => {
    const date = new Date(timeSheetEntry.createdAt);
    timeSheetMap[
      monthNamesMap[date.getMonth()] + " " + date.getFullYear().toString()
    ] += timeSheetEntry.visitDurationTotal;
  });

  Object.keys(timeSheetMap).forEach((month) => {
    timeSheetMap[month] /= 3600;
  });
  return timeSheetMap;
};

export const calculateTotalJobs = (jobs) => {
  return jobs.reduce((totalJobs) => {
    return totalJobs + 1;
  }, 0);
};


export const calculateTotalJobsLast12Months = (jobs) => {
  const jobsMap = {};
  for (let i = 11; i >= 0; i--) {
    const { month, year } = getMonthAndYear(i);
    jobsMap[
      monthNamesMap[new Date(year, month).getMonth()] + " " + year.toString()
    ] = 0;
  }
  jobs.forEach((job) => {
    const date = new Date(job.createdAt);
    jobsMap[
      monthNamesMap[date.getMonth()] + " " + date.getFullYear().toString()
    ] += 1;
  });

  return jobsMap;
};
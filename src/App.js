import "./App.css";
import Login from "./features/login/Login";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { Home } from "./features/Home";
import { Redirect } from "./components/Redirect";
import { LeadCustomerDetails } from "./features/Sales/LeadCustomerDetails";
import { CustomerDetails } from "./features/Sales/CustomerDetails";
import { SalesDetails } from "./features/Sales/SalesDetails";
import { Sales } from "./features/Sales/Sales";
import { Operations } from "./features/Operations/Operations";
import { Financials } from "./features/Financials/Financials";
import { LoginIn } from "./components/LoginIn";
import { Profile } from "./features/Profile";
import { GrossProfitDetails } from "./features/Financials/GrossProfitDetails";
import { NetIncomeDetails } from "./features/Financials/NetIncomeDetails";
import { BalanceSheetDetails } from "./features/Financials/BalanceSheetDetails";
import { GrossProfitMargin } from "./features/Operations/GrossProfitMargin";
import { RevenuePerHour } from "./features/Operations/RevenuePerHour";
import { JobsDetails } from "./features/Operations/JobsDetails";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { PaymentPage } from "./components/PaymentPage";
import RequireFirebaseAuth from "./components/RequireFirebaseAuth";
import RequirePayment from "./components/RequirePayment";

const qbParams = {
  // "grant_type": "authorization_code",
  // "redirect_uri": process.env.REACT_APP_REDIRECT_URI_QB
};

const jobberParams = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  grant_type: "authorization_code",
  redirect_uri: process.env.REACT_APP_REDIRECT_URI_JOBBER,
};

function App() {
  return (
    <Routes>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route element={<RequireFirebaseAuth />}>
        <Route path="subscription" element={<PaymentPage />} />
        <Route element={<RequirePayment />}>
          <Route path="login" element={<Login />} />
          <Route
            path="jobberauth"
            element={<Redirect url={process.env.REACT_APP_AUTH_URL} />}
          />
          <Route
            path="quickbooksauth"
            element={<Redirect url={process.env.REACT_APP_AUTH_QB_URL} />}
          />
          <Route
            path="loginSuccessQB"
            element={
              <LoginIn
                params={qbParams}
                type={"QuickBooks"}
                fetchUrl={process.env.REACT_APP_QB_TOKEN_URL}
              />
            }
          />
          <Route
            path="loginSuccessJobber"
            element={
              <LoginIn
                params={jobberParams}
                type={"Jobber"}
                fetchUrl={process.env.REACT_APP_JOBBER_TOKEN_URL}
              />
            }
          />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />}>
              <Route index element={<Sales />} />

              <Route path="Profile" element={<Profile />} />
              <Route path="Sales" element={<Sales />} />
              <Route path="Sales/SalesDetails" element={<SalesDetails />} />
              <Route path="Sales/Customers" element={<CustomerDetails />} />
              <Route path="Sales/Leads" element={<LeadCustomerDetails />} />
              <Route
                path="Financials/GrossProfitDetails"
                element={<GrossProfitDetails />}
              />
              <Route
                path="Financials/NetIncomeDetails"
                element={<NetIncomeDetails />}
              />
              <Route
                path="Financials/BalanceSheetDetails"
                element={<BalanceSheetDetails />}
              />
              <Route
                path="Operations/GrossProfitMargin"
                element={<GrossProfitMargin />}
              />
              <Route
                path="Operations/RevenuePerLabourHour"
                element={<RevenuePerHour />}
              />
              <Route path="Operations/JobsDetails" element={<JobsDetails />} />

              <Route path="Operations" element={<Operations />} />
              <Route path="Financials" element={<Financials />} />
              <Route path="*" element={<p>WHAT!</p>} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<p>OHH!</p>} />
    </Routes>
  );
}

export default App;

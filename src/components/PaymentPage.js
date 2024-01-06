import { useEffect, useState } from "react";
import { db } from "../firebase/setup";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "antd";
import Loading from "../reusable/loading";
import Logo from "../reusable/logo";

const containerStyle = {
  position: 'relative', // Relative positioning to place the logout button absolutely within
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f0f2f5',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const pricingTableStyle = {
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  backgroundColor: '#ffffff',
};

const logoutButtonStyle = {
  position: 'absolute', // Absolute positioning for the button
  top: '20px', // Distance from the top
  right: '20px', // Distance from the right
};

const freeTrialMessageStyle = {
  marginTop: '20px',
  fontSize: '16px',
  color: '#333333',
  textAlign: 'center',
};

export function PaymentPage() {
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState();
  const [key, setKey] = useState();

  console.log(id, key);

  const [message, setMessage] = useState();
  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    localStorage.clear();
  };

  useEffect(() => {
    getDoc(doc(db, "users", authUser.email))
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const status = data.status;

          if (status === "paid" || status === "trial") {
            setMessage("Your Subscription is active!");
          } else if (status === "unpaid") {
            setId(process.env.REACT_APP_PAYMENT_PAGE_TRIAL_ID);
            setKey(process.env.REACT_APP_PAYMENT_PAGE_TRIAL_KEY);
            console.log(process.env.REACT_APP_PAYMENT_PAGE_TRIAL_ID);
          } else if (status === "canceled") {
            setId(process.env.REACT_APP_PAYMENT_PAGE_ID);
            setKey(process.env.REACT_APP_PAYMENT_PAGE_KEY);
          }
        } else {
          // Handle the case when there are no matching documents
          // You might want to set default values or handle this situation differently.
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  if (loading) return <Loading />;
  if (message) return <p>{message}</p>;

  return (
    <div style={containerStyle}>
      <div style={pricingTableStyle}>
        <stripe-pricing-table
          pricing-table-id={id}
          publishable-key={key}
          customer-email={authUser.email}
        >
          <Logo />
        </stripe-pricing-table>
      </div>
      <Button type="primary" style={logoutButtonStyle} onClick={logout}>
        Log out
      </Button>
      <div style={freeTrialMessageStyle}>
        Try out for free for 15 days, won't charge you if you cancel!
      </div>
    </div>
  );
}

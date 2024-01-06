import React from "react";
import { Divider, Layout, Typography } from "antd";
const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        backgroundColor: "white",
        bottom: 0,
        width: "100%",
      }}
    >
      <Divider />
      <Text>
        © {new Date().getFullYear()} Dialed In Bookkeeping. All rights reserved.
      </Text>
      <br />
      <Link href="https://www.dialedinbookkeeping.com" target="_blank">
        Visit Dialed In Bookkeeping
      </Link>
      <br />
      <Text>Contact: </Text>
      <Link href="mailto:ben@dialedinbookkeeping.com">
        ben@dialedinbookkeeping.com
      </Link>
    </Footer>
  );
};

export default AppFooter;

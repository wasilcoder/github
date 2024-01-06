import { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import Dropdown from "antd/es/dropdown/dropdown";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function NavBar({ name }) {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(["/sales"]); // Initialize with the default selected key

  useEffect(() => {
    // Map your route paths to corresponding menu item keys
    const routeToMenuItemKey = {
      "/": "sales",
      "/Sales": "sales",
      "/Operations": "operations",
      "/Financials": "financials",
    };

    // Check if the current route exists in the mapping, and set the selected key accordingly
    if (routeToMenuItemKey[location.pathname]) {
      setSelectedKeys([routeToMenuItemKey[location.pathname]]);
    }
  }, [location.pathname]);

  // Function to clear all selections
  const clearSelection = () => {
    setSelectedKeys([]);
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    localStorage.clear();
    // if(!localStorage.getItem('token'))
    //   navigate('/login')
  };
  const profileMenu = (
    <Menu>
      <Menu.Item key="profile-settings">
        <Link to="/Profile" onClick={clearSelection}>
          Profile Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={selectedKeys}
      >
        <Menu.Item
          key="logo"
          style={{ marginLeft: "10px", cursor: "default" }}
          disabled={true}
        >
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>{name}</span>
        </Menu.Item>
        <Menu.Item
          key="sales"
          icon={<DollarCircleOutlined />}
          style={{ margin: "auto" }}
        >
          <Link to="/Sales">Sales</Link>
        </Menu.Item>
        <Menu.Item
          key="operations"
          icon={<FileTextOutlined />}
          style={{ margin: "auto" }}
        >
          <Link to="/Operations">Operations</Link>
        </Menu.Item>
        <Menu.Item
          key="financials"
          icon={<HomeOutlined />}
          style={{ margin: "auto" }}
        >
          <Link to="/Financials"> Financials</Link>
        </Menu.Item>
        <Menu.Item
          key="profile"
          style={{ marginRight: "10px", float: "right" }}
        >
          <Dropdown
            overlay={profileMenu}
            trigger={["click"]}
            style={{ float: "right", marginRight: "10px" }}
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <UserOutlined /> Profile <SettingOutlined />
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>
    </>
  );
}

export default NavBar;

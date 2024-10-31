import { Avatar, Dropdown } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./header.scss";

export const Header = ({ profileDetails }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("authToken");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };
  const items = [
    {
      key: "1",
      label: <p>{profileDetails?.role}</p>,
    },
    {
      key: "2",
      label: <p>{profileDetails?.email}</p>,
    },
    {
      key: "3",
      label: (
        <p onClick={handleLogout} className="logout">
          Logout
        </p>
      ),
    },
  ];
  return (
    <div className="header-container">
      <div>
        <p className="welcome-message">Welcome!! {profileDetails?.username}</p>
        <h3>Weather Forecast</h3>
      </div>
      <div className="dropdown-container">
        <Dropdown
          menu={{
            items,
          }}
          trigger="click"
          placement="bottomRight"
          arrow
          className="dropdown"
        >
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="profile-wrapper"
          ></Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

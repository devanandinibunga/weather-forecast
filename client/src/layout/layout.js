import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/header";
import axios from "axios";
import Cookies from "js-cookie";
import { Footer } from "../components/footer/footer";
const { Header: AntdHeader, Footer: AntdFooter, Content } = Layout;

const MainLayout = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const token = Cookies.get("authToken");
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/profile", {
          headers: {
            "x-token": Cookies.get("authToken"),
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setProfileDetails(res?.data);
          }
        });
    }
  }, []);
  return (
    <Layout>
      <AntdHeader>
        <Header profileDetails={profileDetails} />
      </AntdHeader>
      <Content style={{ paddingTop: "70px" }}>
        <Outlet />
      </Content>
      <AntdFooter>
        <Footer />
      </AntdFooter>
    </Layout>
  );
};
export default MainLayout;

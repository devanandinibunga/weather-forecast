import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/header";
import axios from "axios";
import Cookies from "js-cookie";
import { Footer } from "../components/footer/footer";
const { Header: AntdHeader, Footer: AntdFooter, Content } = Layout;

export const MainLayout = () => {
  const [profileDetails, setProfileDetails] = useState({});

  useEffect(() => {
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
  }, []);
  return (
    <Layout>
      <AntdHeader>
        <Header profileDetails={profileDetails} />
      </AntdHeader>
      <Content>
        <Outlet />
      </Content>
      <AntdFooter>
        <Footer />
      </AntdFooter>
    </Layout>
  );
};

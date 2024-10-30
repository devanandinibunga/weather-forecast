import React, { useState } from "react";
import "./login.scss";
import Cookies from "js-cookie";
import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [openForgotModal, setOpenForgotModal] = useState(false);
  const onFinish = async (values) => {
    await axios
      .post("http://localhost:5000/login", values)
      .then((res) => {
        if (res?.status === 200) {
          Cookies.set("authToken", res?.data?.token, { expires: 3600000 });
          localStorage.setItem("role", res?.data?.role);
          navigate("/dashboard");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Please enter email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input placeholder="Please enter password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Login</Button>
          </Form.Item>
          <p>
            New user? <a href="/register">Register</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

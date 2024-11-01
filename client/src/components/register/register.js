import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NotifyStatus from "../notify-status/notify-status";
import "./register.scss";

const Register = () => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);
  const onFinish = async (payload) => {
    await axios
      .post("https://weather-forecast-server-one.vercel.app/register", payload)
      .then((res) => {
        if (res?.status === 200) {
          form.resetFields();
          setStatus("success");
          setMessage("Registered successfully");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          console.log(res?.data);
        }
      });
  };
  return (
    <div className="register-page-container">
      <div className="register-logo-wrapper">
        <img src="/images/register.jpg" alt="register" className="login-logo" />
      </div>
      <div className="register-form-container">
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Please enter username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Please enter email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input placeholder="Please confirm password" />
          </Form.Item>
          <Form.Item
            name="confirmpassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input placeholder="Please confirm password" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter the role!" }]}
          >
            <Select
              placeholder="Please select the user role"
              options={[
                {
                  value: "user",
                  label: "user",
                },
                {
                  value: "manager",
                  label: "manager",
                },
                {
                  value: "admin",
                  label: "admin",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Register</Button>
          </Form.Item>
          <p>
            Already a user? <a href="/login">Login</a>
          </p>
        </Form>
      </div>
      {status && <NotifyStatus status={status} message={message} />}
    </div>
  );
};
export default Register;

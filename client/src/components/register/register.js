import React from "react";
import "./register.scss";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (payload) => {
    await axios.post("http://localhost:5000/register", payload).then((res) => {
      if (res?.status === 200) {
        form.resetFields();
        navigate("/login");
      }
    });
  };
  return (
    <div className="register-page-container">
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
            rules={[{ required: true, message: "Please enter your email!" }]}
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
          <Form.Item
            name="confirmpassword"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please enter your confirm password!",
              },
            ]}
          >
            <Input placeholder="Please enter confirm password" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              { required: true, message: "Please enter the role!" },
            ]}
          >
            <Input placeholder="Please enter role" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Register</Button>
          </Form.Item>
          <p>
            Already a user? <a href="/login">Login</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

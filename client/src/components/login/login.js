import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./login.scss";

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);
  const onFinish = async (values) => {
    await axios
      .post("https://weather-forecast-server-one.vercel.app/login", values)
      .then((res) => {
        if (res?.status === 200) {
          Cookies.set("authToken", res?.data?.token, { expires: 3600000 });
          localStorage.setItem("role", res?.data?.role);
          localStorage.setItem("isAuthenticated", "true");
          navigate("/dashboard", { replace: true });
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <>
      <div className="login-wrapper">
        <div className="login-form-wrapper">
          <Form
            onFinish={onFinish}
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="please enter email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              {/* <Input placeholder="please enter password" /> */}
              <Input.Password
                placeholder="Please confirm password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <div className="login-button-wrapper">
              <Button htmlType="submit" type="text" className="login-button">
                Login
              </Button>
            </div>
          </Form>
          <div className="register-container">
            <h5 className="new-customer">New Customer?</h5>
            <p className="register" onClick={handleRegister}>
              Register
            </p>
          </div>
        </div>
        <div className="login-logo-wrapper">
          <img
            src="/images/undraw_weather_re_qsmd.svg"
            alt="login"
            className="login-logo"
          />
        </div>
      </div>
    </>
  );
};
export default Login;

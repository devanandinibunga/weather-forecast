import React, { useEffect, useState } from "react";
import { notification } from "antd";
import "./notify-status-style.scss";
import { CheckCircleOutlined } from "@ant-design/icons";
import { PiWarningCircleLight } from "react-icons/pi";

const NotifyStatus = ({ status, message, description }) => {
  const [info, setInfo] = useState(status && status);
  const [statusAbout, setStatusAbout] = useState();
  const STATUS_KEY = 1;
  const NOTIFICATION_DURATION = 3;
  const resetStates = () => {
    setStatusAbout();
    setInfo();
  };
  const notifyStatus = (type) => {
    switch (type) {
      case "success":
        setStatusAbout(
          notification["success"]({
            onClose: resetStates,
            icon: (
              <div className="tick-container">
                <CheckCircleOutlined className="tick" />
              </div>
            ),
            className: "notify-status-container",
            key: STATUS_KEY,
            message: (
              <>
                <h2 className="message-title">{message}</h2>
                <h2 className="message-title">{description}</h2>
              </>
            ),
            duration: NOTIFICATION_DURATION,
          }),
        );
        break;
      case "warning":
        setStatusAbout(
          notification["warning"]({
            onClose: resetStates,
            icon: (
              <div className="warning-container">
                <PiWarningCircleLight className="warning" />
              </div>
            ),
            className: "notify-status-container",
            key: STATUS_KEY,
            message: <h2 className="message-title">{message}</h2>,
            duration: NOTIFICATION_DURATION,
          }),
        );
        break;
      case "addAccountSuccess":
        setStatusAbout(
          notification["success"]({
            onClose: resetStates,
            icon: (
              <div className="tick-container">
                <CheckCircleOutlined className="tick" />
              </div>
            ),
            className: "notify-status-container",
            key: STATUS_KEY,
            message: <h2 className="message-title">{message}</h2>,
            duration: NOTIFICATION_DURATION,
            placement: "bottomRight",
          }),
        );
        break;
      case "updateAccountSuccess":
        setStatusAbout(
          notification["success"]({
            onClose: resetStates,
            icon: (
              <div className="tick-container">
                <CheckCircleOutlined className="tick" />
              </div>
            ),
            className: "notify-status-container",
            key: STATUS_KEY,
            message: <h2 className="message-title">{message}</h2>,
            duration: NOTIFICATION_DURATION,
            placement: "bottomRight",
          }),
        );
        break;
      case "deleteAccountSuccess":
        setStatusAbout(
          notification["info"]({
            onClose: resetStates,
            icon: (
              <div className="tick-container">
                <CheckCircleOutlined className="tick" />
              </div>
            ),
            className: "notify-status-container info",
            key: STATUS_KEY,
            message: <h2 className="message-title">{message}</h2>,
            duration: NOTIFICATION_DURATION,
            placement: "bottomRight",
          }),
        );
        break;
      default:
    }
  };
  useEffect(() => {
    notifyStatus(info);
  });
  return <>{statusAbout}</>;
};
export default NotifyStatus;

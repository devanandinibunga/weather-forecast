import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Select, Table, DatePicker } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import "./forecast-table.scss";
import { useForm } from "antd/es/form/Form";
import { TableShimmer } from "../table-shimmer/table-shimmer";
import NotifyStatus from "../notify-status/notify-status";

const ForecastTable = ({
  location,
  filters,
  visible,
  showDrawer,
  handleLocationSelect,
  savedLocations,
  handleFilterSubmit,
  closeDrawer,
  setLocation,
}) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [form] = useForm();
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (location?.latitude !== null) {
      try {
        setIsLoading(true);
        axios
          .get("http://localhost:5000/forecast-data", {
            headers: {
              "x-token": Cookies.get("authToken"),
            },
            params: {
              latitude: location?.latitude,
              longitude: location?.longitude,
              start_date: filters?.start_date,
              end_date: filters?.end_date,
              min_temp: filters ? filters.min_temp : "",
              max_temp: filters ? filters.max_temp : "",
              page: currentPage,
              limit: pageSize,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setData(response?.data);
            setCurrentPage(response?.data?.page);
            setPageSize(response?.data?.limit);
          });
      } catch (err) {
        setStatus("warning");
        setMessage(err);
        setIsLoading(false);
      }
    }
  }, [location, currentPage, pageSize, filters]);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 80,
    },
    {
      title: "Temperature (°C)",
      dataIndex: "temperature",
      key: "temperature",
      width: 150,
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
      width: 150,
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
      width: 150,
    },
  ];

  const formattedData = data?.data?.map((item, index) => {
    const dateObj = moment(item.time);
    return {
      key: index,
      date: dateObj.format("DD-MM-YYYY"),
      time: dateObj.format("HH:mm"),
      temperature: item.temperature,
      latitude: item.latitude,
      longitude: item.longitude,
    };
  });
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const disabledDate = (current) => {
    const today = moment().startOf("day");
    return current < today || current > today.add(7, "days"); // Disable dates before today and after 7 days from today
  };
  return (
    <div className="table-wrapper">
      <div className="location-filter-wrapper">
        <h2 className="title">Hourly Temperature Forecast</h2>
        <div className="select-filter-wrapper">
          {role !== "user" && (
            <Select
              style={{ width: 200, margin: "20px 0" }}
              placeholder="Select location"
              onChange={handleLocationSelect}
              allowClear
            >
              {savedLocations?.map((loc) => (
                <Option
                  key={`${loc.latitude},${loc.longitude}`}
                  value={`${loc.latitude},${loc.longitude}`}
                >
                  {`Lat: ${loc.latitude}, Lon: ${loc.longitude}`}
                </Option>
              ))}
            </Select>
          )}
          <Button type="primary" onClick={showDrawer}>
            Filter
          </Button>
        </div>
      </div>
      <Drawer
        title="Apply Filters"
        placement="right"
        onClose={closeDrawer}
        open={visible}
      >
        <Form layout="vertical" onFinish={handleFilterSubmit} form={form}>
          <Form.Item label="Date Range" name="dateRange">
            <RangePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item label="Minimum Temperature" name="min_temp">
            <Input type="number" placeholder="Min Temperature" />
          </Form.Item>
          <Form.Item label="Maximum Temperature" name="max_temp">
            <Input type="number" placeholder="Max Temperature" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Table
        locale={isLoading && { emptyText: <TableShimmer row={5} col={5} /> }}
        columns={columns}
        scroll={{ x: "max-content", y: "calc(100vh - 34rem)" }}
        dataSource={formattedData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.total,
          onChange: handlePageChange,
        }}
      />
      {status && <NotifyStatus status={status} message={message} />}
    </div>
  );
};

export default ForecastTable;

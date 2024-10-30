import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { useForm } from "antd/es/form/Form";
import "./add-location.scss";

export const AddLocation = ({ setLocation, addLocation, setAddLocation }) => {
  const [form] = useForm();
  const showModal = () => {
    setAddLocation(true);
  };
  const handleCancel = () => {
    setAddLocation(false);
  };
  return (
    <div className="add-location-wrapper">
      <Button type="primary" onClick={showModal}>
        Add Location
      </Button>
      <Modal open={addLocation} onCancel={handleCancel} footer={null}>
        <Form
          layout="vertical"
          onFinish={(values) => setLocation(values)}
          form={form}
        >
          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[{ required: true, message: "Please enter latitude!" }]}
          >
            <Input placeholder="Please enter latitude" />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[{ required: true, message: "Please enter Longitude!" }]}
          >
            <Input placeholder="Please enter longitude" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Add location
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

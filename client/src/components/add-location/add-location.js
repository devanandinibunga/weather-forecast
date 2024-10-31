import { Button, Form, InputNumber, Modal } from "antd";
import React from "react";
import { useForm } from "antd/es/form/Form";
import "./add-location.scss";

const AddLocation = ({ setLocation, addLocation, setAddLocation }) => {
  const [form] = useForm();

  const showModal = () => {
    setAddLocation(true);
    form.resetFields();
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
          onFinish={(values) => {
            setLocation(values);
            setAddLocation(false);
          }}
          form={form}
        >
          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[
              { required: true, message: "Please enter latitude!" },
              {
                type: "number",
                min: -90,
                max: 90,
                message: "Latitude must be between -90 and 90",
              },
            ]}
          >
            <InputNumber
              placeholder="Please enter latitude"
              min={-90}
              max={90}
              style={{ width: "100%" }}
              step={0.01}
            />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              { required: true, message: "Please enter longitude!" },
              {
                type: "number",
                min: -180,
                max: 180,
                message: "Longitude must be between -180 and 180",
              },
            ]}
          >
            <InputNumber
              placeholder="Please enter longitude"
              min={-180}
              max={180}
              step={0.01}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <div className="add-location-btn">
            <Button htmlType="submit" type="primary">
              Add location
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default AddLocation;

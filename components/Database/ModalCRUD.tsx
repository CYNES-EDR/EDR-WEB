"use client";
import API_URL from "@/helpers/api-url";
import arrayToObject from "@/helpers/array-to-object";
import { customAxiosPost } from "@/helpers/custom-axios";
import { Button, Form, Input, Modal, Switch, Select } from "antd";
import React from "react";
type DataGridProps = {
  open: boolean;
  type: "create" | "edit" | "delete";
  onCancel: () => void;
  onOk: () => void;
  dataEdit: {
    id: number;
    type: string;
    description: string;
    is_active: boolean;
    content: string;
    level: number;
  };
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  openNotificationWithIcon: (type: NotificationType, data: string) => void;
};
type NotificationType = "success" | "info" | "warning" | "error";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const ModalCRUD: React.FC<DataGridProps> = ({
  open,
  type,
  onOk,
  onCancel,
  setReload,
  dataEdit,
  openNotificationWithIcon,
}) => {
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    if (type == "create") {
      let urlAdd = API_URL.DATABASE.ADD_DATABASE;
      let { db_info, ...restData } = values;
      let res: { error: boolean; msg: string } = await customAxiosPost(urlAdd, {
        ...restData,
        db_info,
      });
      if (res.error === false) {
        openNotificationWithIcon("success", res.msg);
        setReload((previous) => {
          return !previous;
        });
      } else {
        openNotificationWithIcon("error", res.msg);
      }
    } else {
      let urlEdit = API_URL.DATABASE.UPDATE_DATABASE;
      let { db_info, ...restData } = values;

      let res: { error: boolean; msg: string } = await customAxiosPost(
        urlEdit,
        { ...restData, db_info, id: dataEdit.id }
      );
      if (res.error === false) {
        openNotificationWithIcon("success", res.msg);
        setReload((previous) => {
          return !previous;
        });
      } else {
        openNotificationWithIcon("error", res.msg);
      }
    }
  };
  let title = type == "create" ? "Create Data" : "Edit Data";

  form.setFieldValue("type", dataEdit.type);
  form.setFieldValue("level", dataEdit.level);

  form.setFieldValue("description", dataEdit.description);
  form.setFieldValue("is_active", dataEdit.is_active);
  form.setFieldValue("content", dataEdit.content);
  return (
    <Modal width={600} title={title} onCancel={onCancel} open={open}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 800 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: "Please input your Type!" }]}
        >
          <Select>
            <Select.Option value={0}>0</Select.Option>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={2}>2</Select.Option>
            <Select.Option value={3}>3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please input your Level!" }]}
        >
          <Select defaultValue={"md5"}>
            <Select.Option value="md5">md5</Select.Option>
            <Select.Option value="ip">ip</Select.Option>
            <Select.Option value="domain">domain</Select.Option>
            <Select.Option value="url">url</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please input your Description!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input your Content!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCRUD;

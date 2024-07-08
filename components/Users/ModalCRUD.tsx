"use client";
import { Modal, Form, Button, Select, Input } from "antd";
import React from "react";
import { customAxiosPost } from "@/helpers/custom-axios";
import API_URL from "@/helpers/api-url";
type DataGridProps = {
  open: boolean;
  type: "create" | "edit" | "delete";
  onCancel: () => void;
  onOk: () => void;
  dataCreate: {
    user_name: string;
    password: string;
    display_name: string;
    role: string;
  };
  dataEdit: {
    user_name: string;
    password: string;
    display_name: string;
    role: string;
    id: string;
  };
  openNotificationWithIcon: (type: NotificationType, data: string) => void;

  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};
type NotificationType = "success" | "info" | "warning" | "error";

const ModalCRUD: React.FC<DataGridProps> = ({
  open,
  type,
  onOk,
  onCancel,
  setReload,
  dataEdit,
  openNotificationWithIcon,
  dataCreate,
}) => {
  const [form] = Form.useForm();
  const onFinishFailed = (errorInfo: any) => {
    openNotificationWithIcon("error", errorInfo.msg);
  };
  const onFinish = async (values: any) => {
    let { user_name, password, display_name, role } = values;
    if (type == "create") {
      let urlAdd = API_URL.USER.SIGN_UP;
      let res: { error: boolean; msg: string } = await customAxiosPost(urlAdd, {
        user_name,
        password,
        display_name,
        role,
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
      let urlEdit = API_URL.COMMANDS.UPDATE_COMMAND;
      let { user_name, password } = values;

      let res: { error: boolean; msg: string } = await customAxiosPost(
        urlEdit,
        {
          user_name,
          password,
          id: dataEdit.id,
        }
      );
      if (res.error === false) {
        openNotificationWithIcon("success", res.msg);
        setReload((previous) => {
          return !previous;
        });
      } else {
        openNotificationWithIcon("error", res.msg);
      }
      console.log(values);
    }
  };
  let title = type == "create" ? "Create User" : "Edit User";
  form.setFieldsValue({
    user_name: dataEdit.user_name,
    password: dataEdit.password,
    role: dataEdit.role,
    display_name: dataEdit.display_name,
  });
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
        <Form.Item name="user_name" label="User Name" required>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" required>
          <Input.Password />
        </Form.Item>
        <Form.Item name="display_name" label="Display Name" required>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role" required>
          <Select defaultValue={"user"}>
            <Select.Option value="admin">admin</Select.Option>
            <Select.Option value="user">user</Select.Option>
          </Select>
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

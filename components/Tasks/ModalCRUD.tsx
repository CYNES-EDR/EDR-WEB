"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import { Button, Form, Modal, Select, Switch } from "antd";
import React from "react";
type DataGridProps = {
  open: boolean;
  type: "create" | "edit" | "delete";
  onCancel: () => void;
  onOk: () => void;
  dataCreate: {
    groupList: { label: string; value: string }[];
    commandList: { label: string; value: string }[];
  };
  dataEdit: {
    id: string;
    group_id: number;
    group_name: string;
    command_id: number;
    command_name: string;
    is_active: boolean;
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
    let groupName =
      dataCreate.groupList.find((item) => item.value === values.group_id)
        ?.label || "";
    let commandName =
      dataCreate.commandList.find((item) => item.value === values.command_id)
        ?.label || "";
    if (type == "create") {
      let urlAdd = API_URL.TASKS.ADD_TASK;
      let res: { error: boolean; msg: string } = await customAxiosPost(urlAdd, {
        group_id: Number(values.group_id),
        command_id: Number(values.command_id),
        group_name: groupName,
        command_name: commandName,
        is_active: values.is_active,
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
      let urlEdit = API_URL.TASKS.UPDATE_TASK;
      // console.log(dataEdit);
      let { command_id, group_id } = values;
      let listCommandLabel = dataCreate.commandList.map((item) => item.label);
      let listGroupLabel = dataCreate.groupList.map((item) => item.label);
      if (listCommandLabel.includes(command_id)) {
        command_id =
          dataCreate.commandList.find((item) => item.label == command_id)
            ?.value || command_id;
      }
      if (listGroupLabel.includes(group_id)) {
        group_id =
          dataCreate.groupList.find((item) => item.label == group_id)?.value ||
          group_id;
      }
      let command_name = dataCreate.commandList.find(
        (item) => item.value == command_id
      )?.label;
      let group_name = dataCreate.groupList.find(
        (item) => item.value == group_id
      )?.label;

      let res: { error: boolean; msg: string } = await customAxiosPost(
        urlEdit,
        {
          is_active: values.is_active,
          command_name,
          group_name,
          command_id: Number(command_id),
          group_id: Number(group_id),
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
  let title = type == "create" ? "Create Task" : "Edit Task";
  form.setFieldsValue({
    group_id: dataEdit.group_name,
    command_id: dataEdit.command_name,
    is_active: dataEdit.is_active,
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
        <Form.Item name="group_id" label="Select Group" required>
          <Select options={dataCreate.groupList}></Select>
        </Form.Item>
        <Form.Item name="command_id" label="Select Command" required>
          <Select options={dataCreate.commandList}></Select>
        </Form.Item>
        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCRUD;

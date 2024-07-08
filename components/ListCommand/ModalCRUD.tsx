"use client";
import { Modal, Form, Input, Button, Space, Switch, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import { customAxiosPost } from "@/helpers/custom-axios";
import API_URL from "@/helpers/api-url";
import arrayToObject from "@/helpers/array-to-object";
type DataGridProps = {
  open: boolean;
  type: "create" | "edit" | "delete";
  onCancel: () => void;
  onOk: () => void;
  dataEdit: {
    id: number;
    command_type: string;
    command_name: string;
    is_show: boolean;
    command_info: any[];
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
    console.log(values);
    if (type == "create") {
      let urlAdd = API_URL.COMMANDS.ADD_COMMAND;
      let { command_info, ...restData } = values;
      command_info = arrayToObject(command_info);
      let res: { error: boolean; msg: string } = await customAxiosPost(urlAdd, {
        ...restData,
        command_info,
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
      let { command_info, ...restData } = values;
      command_info = arrayToObject(command_info);
      console.log({ ...restData, command_info });
      let res: { error: boolean; msg: string } = await customAxiosPost(
        urlEdit,
        { ...restData, command_info, id: dataEdit.id }
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
  let title = type == "create" ? "Create Command" : "Edit Command";

  form.setFieldValue("command_name", dataEdit.command_name);
  form.setFieldValue("command_type", dataEdit.command_type);
  form.setFieldValue("is_show", dataEdit.is_show);
  form.setFieldValue("command_info", dataEdit.command_info);
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
          label="Command Name"
          name="command_name"
          rules={[
            { required: true, message: "Please input your Command Name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Command Type"
          name="command_type"
          rules={[
            { required: true, message: "Please input your Command Type!" },
          ]}
        >
          <Select defaultValue={"UploadFile"}>
            <Select.Option value="UploadFile">UploadFile</Select.Option>
            <Select.Option value="DownloadFile">DownloadFile</Select.Option>
            <Select.Option value="CMD">CMD</Select.Option>
            <Select.Option value="RemoteCMD">RemoteCMD</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="is_show" label="Show" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.List
          name="command_info"
          rules={[
            {
              validator: async (_, fields) => {
                if (!fields || fields.length < 1) {
                  return Promise.reject(new Error("At least 1 passengers"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <p className="dark:text-white text-sm">
                Enter your Command Info here:
              </p>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "field"]}
                    rules={[{ required: true, message: "Missing field" }]}
                  >
                    <Select placeholder="Field" defaultValue={"upload_link"}>
                      <Select.Option value="upload_link">
                        upload_link
                      </Select.Option>
                      <Select.Option value="local_file">
                        local_file
                      </Select.Option>
                      <Select.Option value="download_link">
                        download_link
                      </Select.Option>
                      <Select.Option value="execute_file">
                        execute_file
                      </Select.Option>
                      <Select.Option value="dir">dir</Select.Option>
                      <Select.Option value="remote_time">
                        remote_time
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Missing value" }]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
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

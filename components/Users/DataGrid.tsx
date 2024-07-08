"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import getHeightScroll from "@/helpers/get-height-scroll";
import { USER } from "@/types/user";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import CONSTANT_DATA from "../common/constant";
import "./index.css";
import ModalCRUD from "./ModalCRUD";
type NotificationType = "success" | "info" | "warning" | "error";
type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
};
const DataGrid: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const columns: ColumnsType<USER> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 60,
      align: "center",
    },
    {
      title: "User name",
      dataIndex: "user_name",
      key: "user_name",
      width: 120,
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      align: "center",
    },
    {
      align: "center",

      title: "Create at",
      dataIndex: "created_at",
      key: "created_at",
      render: (item) => {
        return formatDateString(item);
      },
      width: 200,
    },

    {
      align: "center",
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 60,
      render: (item) => {
        return (
          <div className="flex justify-center items-center">
            {/* <EditOutlined
              onClick={() => {
                showModal("edit");
                setDataEdit({ ...item });
              }}
              className="w-1/3"
            /> */}
            <Popconfirm
              title="Delete the command"
              description="Are you sure to delete this command?"
              onConfirm={async () => {
                let urlDelete = API_URL.USER.DELETE_USER;
                let res: { error: boolean; msg: string } =
                  await customAxiosPost(urlDelete, { id: item.id });
                if (res.error) {
                  openNotificationWithIcon("error", res.msg);
                } else {
                  openNotificationWithIcon("success", res.msg);
                  setReload(!reload);
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="w-1/3" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, data: string) => {
    api[type]({
      message: type,
      description: data,
      placement: "bottomRight",
    });
  };
  const [users, setUserList] = useState<USER[]>([] as USER[]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);
  const showModal = (type: "create" | "edit" | "delete") => {
    setType(type);
    if (type == "edit") {
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [type, setType] = useState<"create" | "edit" | "delete">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [dataEdit, setDataEdit] = useState<{
    user_name: string;
    password: string;
    display_name: string;
    role: string;
    id: string;
  }>(
    {} as {
      user_name: string;
      password: string;
      display_name: string;
      role: string;
      id: string;
    }
  );
  const [dataCreate, setDataCreate] = useState<{
    user_name: string;
    password: string;
    display_name: string;
    role: string;
  }>(
    {} as {
      user_name: string;
      password: string;
      display_name: string;
      role: string;
    }
  );

  useEffect(() => {
    let url = API_URL.USER.GET_USERS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        users: USER[];
        count: number;
      } = await customAxiosPost(url, {});
      if (resData.success) {
        setTotalCount(resData.count);
        setUserList(
          resData.users.map((data, index) => {
            return {
              ID:
                (filter.page_no - 1) * CONSTANT_DATA.PAGINATION.page_size +
                index +
                1,
              ...data,
            };
          })
        );
        setLoading(false);
      }
    };
    getData();
  }, [timeRange, search, filter, reload]);
  return (
    <>
      {contextHolder}
      <ModalCRUD
        dataCreate={dataCreate}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        type={type}
        setReload={setReload}
        dataEdit={dataEdit}
        openNotificationWithIcon={openNotificationWithIcon}
      ></ModalCRUD>
      <div className=" mt-2 mr-2 flex justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            showModal("create");
            setDataEdit({
              id: "",
              user_name: "",
              password: "",
              role: "admin",
              display_name: "",
            });
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a user
        </Button>
      </div>
      <Table
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={users}
        scroll={{ y: getHeightScroll(), x: 1000 }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: CONSTANT_DATA.PAGINATION.page_size,
          total: totalCount, //response first filter require total
          onChange: (page, pageSize) => {
            setFilter({ ...filter, page_no: page });
          },
        }}
      ></Table>
    </>
  );
};

export default DataGrid;

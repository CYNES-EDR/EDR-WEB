"use client";
import React, { useState, useEffect } from "react";
import { Table, Tag, notification, Popconfirm, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./index.css";
import { COMMAND } from "@/types/command";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import CONSTANT_DATA from "../common/constant";
import getHeightScroll from "@/helpers/get-height-scroll";
import objectToArrayString, {
  objectToArray,
} from "@/helpers/object-to-array-string";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalCRUD from "./ModalCRUD";
type NotificationType = "success" | "info" | "warning" | "error";
type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
};
const DataGrid: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const columns: ColumnsType<COMMAND> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 90,
      align: "center",
    },
    {
      align: "center",
      title: "Command Name",
      dataIndex: "command_name",
      key: "command_name",
      width: 200,
    },
    {
      title: "Command Type",
      dataIndex: "command_type",
      key: "command_type",
      width: 200,
      align: "center",
    },
    {
      title: "Command Info",
      dataIndex: "command_info",
      key: "command_info",
      width: 400,
      render: (item) => {
        let arrayObject = objectToArrayString(item);
        return (
          <div className="flex flex-wrap">
            {arrayObject.map((item, index: number) => {
              return (
                <Tag key={index} className="filter mt-1 mb-1">
                  {Object.values(item).toString().replaceAll(",", "")}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      align: "center",
      title: "Update at",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 200,
      render: (item) => {
        return formatDateString(item);
      },
    },
    {
      align: "center",
      width: 200,
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (item) => {
        return formatDateString(item);
      },
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (item) => {
        return (
          <div className="flex justify-center items-center">
            <EditOutlined
              onClick={() => {
                showModal("edit");
                setDataEdit({
                  ...item,
                  command_info: objectToArray(item.command_info),
                });
              }}
              className="w-1/3 center"
            />
            <Popconfirm
              title="Delete the command"
              description="Are you sure to delete this command?"
              onConfirm={async () => {
                let urlDelete = API_URL.COMMANDS.DELETE_COMMAND;
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
              <DeleteOutlined className="w-1/3 center" />
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
  const [groups, setGroupList] = useState<COMMAND[]>([] as COMMAND[]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);
  const [totalCount, setTotalCount] = useState(0);
  const [reload, setReload] = useState(false);
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
  const [dataEdit, setDataEdit] = useState<{
    id: number;
    command_type: string;
    command_name: string;
    is_show: boolean;
    command_info: any[];
  }>(
    {} as {
      id: number;
      command_type: string;
      command_name: string;
      is_show: boolean;
      command_info: [];
    }
  );
  // if (timeRange) {
  //   const filterInTimeRage = [
  //     {
  //       field: "created_at",
  //       operator: ">=",
  //       value: timeRange[0],
  //     },
  //     {
  //       field: "created_at",
  //       operator: "<=",
  //       value: timeRange[1],
  //     },
  //   ];
  //   filter["filter"] = filterInTimeRage;
  // }
  if (search) {
    filter["filter"] = [...search]; //Add filter time range and search
  }
  Object.assign(filter, CONSTANT_DATA.REQUIRED_TOTAL);
  useEffect(() => {
    let url = API_URL.COMMANDS.GET_COMMANDS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        commands: COMMAND[];
        total_count: number;
      } = await customAxiosPost(url, filter);
      if (resData.success) {
        setTotalCount(resData.total_count);
        setGroupList(resData.commands);
        setLoading(false);
      }
    };
    getData();
  }, [timeRange, search, filter, reload]);
  return (
    <>
      {contextHolder}
      <ModalCRUD
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
              id: 0,
              command_type: "",
              command_name: "",
              is_show: true,
              command_info: [],
            });
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
      </div>
      <Table
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={groups}
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

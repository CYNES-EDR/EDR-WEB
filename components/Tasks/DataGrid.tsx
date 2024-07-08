"use client";
import React, { useState, useEffect } from "react";
import { Table, Tag, notification, Popconfirm, Button, Drawer } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./index.css";
import { TASK } from "@/types/task";
import API_URL from "@/helpers/api-url";
import { customAxiosPost, customAxiosGet } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import CONSTANT_DATA from "../common/constant";
import DrawerTask from "./Drawer";
import getHeightScroll from "@/helpers/get-height-scroll";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ModalCRUD from "./ModalCRUD";
import { GROUP } from "@/types/group";
import { COMMAND } from "@/types/command";

type NotificationType = "success" | "info" | "warning" | "error";
type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
};
const DataGrid: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const columns: ColumnsType<TASK> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 60,
      align: "center",
    },
    // {
    //   title: "Group ID",
    //   dataIndex: "group_id",
    //   key: "group_id",
    //   width: 120,
    // },
    {
      title: "Group Name",
      dataIndex: "group_name",
      key: "group_name",
      width: 120,
      align: "center",
    },
    // {
    //   title: "Command Id",
    //   dataIndex: "command_id",
    //   key: "command_id",
    //   width: 120,
    // },
    {
      title: "Command Name",
      dataIndex: "command_name",
      key: "command_name",
      width: 200,
      align: "center",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      width: 100,
      render: (is_active) => {
        return is_active ? (
          <Tag color="#19caff">Active</Tag>
        ) : (
          <Tag color="#717EA0">Inactive</Tag>
        );
      },
    },
    {
      title: "Create at",
      dataIndex: "created_at",
      key: "created_at",
      render: (item) => {
        return formatDateString(item);
      },
      width: 200,
      align: "center",
    },
    {
      title: "Update at",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 120,
      align: "center",
      render: (item) => {
        return formatDateString(item);
      },
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      align: "center",
      width: 120,
      render: (item) => {
        return (
          <div className="flex justify-center items-center">
            <EditOutlined
              onClick={() => {
                showModal("edit");
                setDataEdit({ ...item });
              }}
              className="w-1/3 center"
            />
            <Popconfirm
              title="Delete the task?"
              description="Are you sure to delete this task?"
              onConfirm={async () => {
                let urlDelete = API_URL.TASKS.DELETE_TASK;
                let res: { error: boolean; msg: string } =
                  await customAxiosPost(urlDelete, { id: item.id });
                if (res.error) {
                  openNotificationWithIcon("error", res.msg);
                } else {
                  openNotificationWithIcon("success", res.msg);
                  setReload(!reload);
                }
              }}
            >
              <DeleteOutlined className="w-1/3 center" />
            </Popconfirm>
            <ReloadOutlined
              onClick={async () => {
                let urlEdit = API_URL.TASKS.UPDATE_TASK;
                let { id, group_id, group_name, command_id, command_name } =
                  item;
                let res: { error: boolean; msg: string } =
                  await customAxiosPost(urlEdit, {
                    is_active: true,
                    command_name,
                    group_name,
                    command_id: Number(command_id),
                    group_id: Number(group_id),
                    id,
                  });
                if (res.error) {
                  openNotificationWithIcon("error", res.msg);
                } else {
                  openNotificationWithIcon("success", res.msg);
                  setReload(!reload);
                }
              }}
              className="w-1/3 center"
            />
          </div>
        );
      },
    },
  ];
  const [open, setOpen] = useState(false);
  const [taskDrawer, setTaskDrawer] = useState<{ [key: string]: string }>({});
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, data: string) => {
    api[type]({
      message: type,
      description: data,
      placement: "bottomRight",
    });
  };
  const [tasks, setTaskList] = useState<TASK[]>([] as TASK[]);
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
    id: string;
    group_id: number;
    group_name: string;
    command_id: number;
    command_name: string;
    is_active: boolean;
  }>(
    {} as {
      id: string;
      group_id: number;
      group_name: string;
      command_id: number;
      command_name: string;
      is_active: boolean;
    }
  );
  const [dataCreate, setDataCreate] = useState<{
    groupList: { label: string; value: string }[];
    commandList: { label: string; value: string }[];
  }>(
    {} as {
      groupList: { label: string; value: string }[];
      commandList: { label: string; value: string }[];
    }
  );
  //get list data for create group_id, command_id
  const getListData = async () => {
    let groupListRes: { count: number; error: boolean; groups: GROUP[] } =
      await customAxiosPost(
        API_URL.GROUPS.GET_GROUPS,
        CONSTANT_DATA.PAGINATION
      );
    let groupList =
      groupListRes.groups.map((item) => {
        return { label: item.group_name, value: item.id.toString() };
      }) || [];

    let commandListRes: { count: number; error: boolean; commands: COMMAND[] } =
      await customAxiosPost(
        API_URL.COMMANDS.GET_COMMANDS,
        CONSTANT_DATA.PAGINATION
      );
    let commandList =
      commandListRes.commands.map((item) => {
        return { label: item.command_name, value: item.id };
      }) || [];
    setDataCreate({ groupList, commandList });
  };

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
    getListData();
  }, []);
  useEffect(() => {
    let url = API_URL.TASKS.GET_TASKS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        tasks: TASK[];
        count: number;
      } = await customAxiosPost(url, filter);
      if (resData.success) {
        setTotalCount(resData.count);
        setTaskList(
          resData.tasks.map((data, index) => {
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
      <Drawer
        title={
          <>
            <span style={{ color: "#818798" }}>Task/ </span>
            <span className="text-white">Computers</span>
          </>
        }
        onClose={onClose}
        open={open}
        placement={"right"}
        width={800}
      >
        <DrawerTask receive_agents={taskDrawer}></DrawerTask>
      </Drawer>
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
              id: "0",
              group_id: 0,
              group_name: "",
              command_id: 0,
              command_name: "",
              is_active: true,
            });
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a task
        </Button>
      </div>

      <Table
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: async (event) => {
              showDrawer();
              let res: any = await customAxiosGet(
                `${API_URL.TASKS.GET_TASKS}/${record.id}`
              );
              if (!res.error && res.task.receive_agents) {
                setTaskDrawer(res.task.receive_agents);
              }
            },
          };
        }}
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={tasks}
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

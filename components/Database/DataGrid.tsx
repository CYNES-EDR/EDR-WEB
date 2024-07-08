"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import { DATABASE } from "@/types/database";
import getHeightScroll from "@/helpers/get-height-scroll";
import { notification, Table, Tag, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import CONSTANT_DATA from "../common/constant";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.css";
import ModalCRUD from "./ModalCRUD";
import exportToExcel from "@/helpers/export-to-excel";
import { ExportOutlined } from "@ant-design/icons";

type NotificationType = "success" | "info" | "warning" | "error";
type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
};
const DataGrid: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const columns: ColumnsType<DATABASE> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 90,
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 90,
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 100,
      align: "center",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      width: 200,
    },
    {
      title: "Update at",
      dataIndex: "updated_at",
      align: "center",
      key: "updated_at",
      width: 120,
      render: (item) => {
        return formatDateString(item);
      },
    },
    {
      align: "center",
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (is_active) => {
        return is_active ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="error">Not Active</Tag>
        );
      },
    },
    {
      width: 200,
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (item) => {
        return formatDateString(item);
      },
    },
    {
      title: "Action",
      key: "operation",
      align: "center",
      fixed: "right",
      width: 200,
      render: (item) => {
        return (
          <div className="flex justify-center items-center">
            <EditOutlined
              onClick={() => {
                console.log(item);
                showModal("edit");
                setDataEdit({
                  ...item,
                });
              }}
              className="w-1/3"
            />
            <Popconfirm
              title="Delete the record?"
              description="Are you sure to delete this record?"
              onConfirm={async () => {
                let urlDelete = API_URL.DATABASE.DELETE_DATABASE;
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
  const [database, setDatabaseList] = useState<DATABASE[]>([] as DATABASE[]);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
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
  const handleCancel: any = () => {
    setIsModalOpen(false);
  };
  const [type, setType] = useState<"create" | "edit" | "delete">("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<{
    id: number;
    type: string;
    description: string;
    is_active: boolean;
    content: string;
    level: number;
  }>(
    {} as {
      id: number;
      type: string;
      description: string;
      is_active: boolean;
      content: string;
      level: number;
    }
  );
  // if (timeRange) {
  //   const filterInTimeRage = [
  //     {
  //       field: "created_at",
  //       operator: ">=",
  //       value: timeRange[0],
  //     },
  //   ];
  //   filter["filter"] = filterInTimeRage;
  // }
  if (search) {
    filter["filter"] = [...search]; //Add filter time range and search
  }
  Object.assign(filter, CONSTANT_DATA.REQUIRED_TOTAL);
  const exportData = async () => {
    setLoadingExport(true);
    filter.page_no = 1;
    filter.page_size = 10000;
    let resData: {
      success: boolean;
      database: DATABASE[];
      count: number;
    } = await customAxiosPost(API_URL.DATABASE.GET_DATABASE, filter);
    exportToExcel(resData.database, "database.xlsx");
    setLoadingExport(false);
  };

  useEffect(() => {
    let url = API_URL.DATABASE.GET_DATABASE;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        database: DATABASE[];
        count: number;
      } = await customAxiosPost(url, filter);
      if (resData.success) {
        setTotalCount(resData.count);
        setDatabaseList(
          resData.database.map((data, index) => {
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
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        type={type}
        setReload={setReload}
        dataEdit={dataEdit}
        openNotificationWithIcon={openNotificationWithIcon}
      ></ModalCRUD>
      <div className=" mt-2 mr-2 flex justify-between">
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            showModal("create");
            // setDataEdit({
            //   id: "0",
            //   group_id: 0,
            //   group_name: "",
            //   command_id: 0,
            //   command_name: "",
            //   is_active: true,
            // });
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a data
        </Button>
        <div style={{ marginRight: "10px" }}>
          {loadingExport ? (
            <>
              {" "}
              <span style={{ marginRight: "18px" }}>Exporting</span>
              <div className="dot-pulse inline-block"></div>
            </>
          ) : (
            <ExportOutlined
              className="export"
              onClick={exportData}
            ></ExportOutlined>
          )}
        </div>
      </div>
      <Table
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={database}
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

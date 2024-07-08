"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosDelete, customAxiosPost } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import { FILE } from "@/types/file";
import UploadFile from "./Upload";
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Modal, Table, message, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import CONSTANT_DATA from "../common/constant";
import "./index.css";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
  reload: boolean;
  showUPload?: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  typeSource: string;
};
type NotificationType = "success" | "info" | "warning" | "error";

const DataGrid: React.FC<DataGridProps> = ({
  timeRange,
  search,
  reload,
  typeSource,
  setReload,
  showUPload = false,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, data: string) => {
    api[type]({
      message: type,
      description: data,
      placement: "bottomRight",
    });
  };
  const deleteFile = async (id: string) => {
    confirm({
      title: "Are you sure you want to delete this file?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        let url = API_URL.FILES.GET_FILES + `/${id}`;
        let res: { error: boolean; msg: string } = await customAxiosDelete(url);
        if (res.error) {
          openNotificationWithIcon("error", res.msg);
        } else {
          openNotificationWithIcon("success", res.msg);
          setReload(!reload);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // const downloadFile = async (id: string) => {
  //   let url = API_URL.FILES.GET_FILES + `/${id}`;
  //   window.open(url, "_blank", "noopener,noreferrer");
  // };
  const downloadFile = async (id: string, fileName: string) => {
    try {
      const response = await fetch(`${API_URL.FILES.GET_FILES}/${id}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Đặt tên file tải xuống
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const copyLink = (id: string, fileName: string) => {
    const link = window.location.hostname + `/api/v1/file/download/${id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        message.success(`${fileName} link copied to clipboard!`);
      },
      () => {
        message.error("Failed to copy link");
      }
    );
  };
  const columns: ColumnsType<FILE> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 30,
      align: "center",
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
      width: 30,
    },
    {
      align: "center",
      title: "Create at",
      dataIndex: "created_at",
      key: "created_at",
      render: (item) => {
        return formatDateString(item);
      },
      width: 50,
    },
    {
      title: "Action",
      dataIndex: "ID",
      key: "ID",
      width: 30,
      fixed: "right",
      align: "center",
      render: (item, record) => {
        return (
          <div className="flex justify-center items-center">
            <DownloadOutlined
              onClick={() => {
                downloadFile(record.id, record.file_name);
              }}
              className="w-1/4 center justify-center"
            />
            <DeleteOutlined
              onClick={() => {
                deleteFile(record.id);
              }}
              className="w-1/4 center justify-center"
            />
            <CopyOutlined
              onClick={() => {
                copyLink(item, record.file_name);
              }}
              className="w-1/4 center justify-center"
            />
          </div>
        );
      },
    },
  ];

  const [files, setFilesList] = useState<FILE[]>([] as FILE[]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);

  useEffect(() => {
    let url = API_URL.FILES.GET_FILES;
    filter["filter"] = [
      {
        field: "type",
        operator: "=",
        value: typeSource, //agent , user, license
      },
    ];
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        files: FILE[];
        count: number;
      } = await customAxiosPost(url, filter);

      if (resData.success) {
        setTotalCount(resData.count);
        setFilesList(
          resData.files.map((data, index) => {
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
  }, [timeRange, search, filter, reload, typeSource]);
  return (
    <>
      <div className="p-1 flex items-stretch justify-between">
        <p className="uppercase">{typeSource} Files:</p>
        {showUPload && (
          <UploadFile setReload={setReload} reload={reload}></UploadFile>
        )}
      </div>
      {contextHolder}
      <Table
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={files}
        scroll={{ y: 900 }}
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

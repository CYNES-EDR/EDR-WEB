"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import formatDateString from "@/helpers/format-date";
import getHeightScroll from "@/helpers/get-height-scroll";
import { ALERT } from "@/types/alert";
import { Drawer, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import CONSTANT_DATA from "../common/constant";
import { ExportOutlined } from "@ant-design/icons";
import "./index.css";
import exportToExcel from "@/helpers/export-to-excel";
const columns: ColumnsType<ALERT> = [
  {
    title: "ID",
    dataIndex: "ID",
    key: "ID",
    width: 70,
    align: "center",
  },
  // {
  //   title: "Agent",
  //   dataIndex: "agent_id",
  //   key: "agent_id",
  //   width: 120,
  // },
  {
    title: "MAC",
    dataIndex: "mac",
    key: "mac",
    width: 180,
    align: "center",
  },
  {
    title: "Local IP ",
    dataIndex: "local_ip",
    key: "local_ip",
    width: 140,
    align: "center",
  },
  {
    title: "Alert Type",
    dataIndex: "alert_type",
    key: "alert_type",
    width: 200,
    align: "center",
  },

  {
    title: "Alert Name",
    dataIndex: "alert_name",
    key: "alert_name",
    width: 220,
    align: "center",
  },
  {
    title: "Alert level",
    dataIndex: "alert_level",
    key: "alert_level",
    width: 120,
    align: "center",
    render: (alert_level) => {
      switch (alert_level) {
        case 1:
          return <Tag color="rgb(251, 229, 181)">Low</Tag>;
        case 2:
          return <Tag color="rgb(242, 179, 37)">Medium</Tag>;
        default:
          return <Tag color="rgb(239, 131, 37)">High</Tag>;
      }
    },
  },
  {
    title: "Alert description",
    dataIndex: "alert_description",
    key: "alert_description",
    width: 440,
    className: "ellipsis-cell",
  },
  {
    title: "Time",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 200,
    render: (item) => {
      return formatDateString(item);
    },
  },
];
type DataGridProps = {
  timeRange?: string[];
  search?: { field: string; operator: string; value: string }[];
};
const DataGrid: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const [loadingExport, setLoadingExport] = useState(false);
  const [record, setRecord] = useState<ALERT>({} as ALERT);
  const [open, setOpen] = useState(false);
  const [alerts, setAlertList] = useState<ALERT[]>([] as ALERT[]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  //=== End ====
  if (timeRange) {
    const filterInTimeRage = [
      {
        field: "created_at",
        operator: ">=",
        value: timeRange[0],
      },
      {
        field: "created_at",
        operator: "<=",
        value: timeRange[1],
      },
    ];
    filter["filter"] = filterInTimeRage;
  }
  if (search) {
    filter["filter"] = [...filter["filter"], ...search]; //Add filter time range and search
  }
  Object.assign(filter, CONSTANT_DATA.REQUIRED_TOTAL);
  const exportData = async () => {
    setLoadingExport(true);
    filter.page_no = 1;
    filter.page_size = 10000;
    let resData: {
      success: boolean;
      alerts: ALERT[];
      count: number;
    } = await customAxiosPost(API_URL.ALERTS.GET_ALERTS, filter);
    exportToExcel(resData.alerts, "alerts.xlsx");
    setLoadingExport(false);
  };
  useEffect(() => {
    let url = API_URL.ALERTS.GET_ALERTS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        alerts: ALERT[];
        count: number;
      } = await customAxiosPost(url, filter);

      if (resData.success) {
        setTotalCount(resData.count);
        setAlertList(
          resData.alerts.map((data, index) => {
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
  }, [timeRange, search, filter]);
  return (
    <>
      <Drawer
        title={
          <>
            <span style={{ color: "#818798" }}>Alert/ </span>
            <span className="text-white">Details</span>
          </>
        }
        onClose={onClose}
        open={open}
        placement={"right"}
        width={800}
      >
        <div className="p-8 pt-0">
          <h3 className="summary-title text-white text-3xl pb-2">Sumary</h3>
          <div
            className="summary-detail p-4"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <p className="flex">
              <Tag color="#0B5970"> Event Description: </Tag>
              <span className="dark:text-white">
                {record.alert_description}
              </span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Artifact Name: </Tag>
              <span className="dark:text-white">{record.artifact_name}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Received time: </Tag>
              <span className="dark:text-white">{record.receive_time}</span>
            </p>
            {/* <p className="mt-2">
              <Tag color="#0B5970">Mitre Technique: </Tag>
              <span className="dark:text-white">{record.}</span>
            </p> */}
          </div>
        </div>
        <div className="p-8 pt-0">
          <h3 className="summary-title text-white text-3xl pb-2">Json</h3>
          <div
            className="summary-detail p-4 json-view-container"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <ReactJson
              quotesOnKeys={false}
              displayDataTypes={false}
              name="Event Info"
              src={record.alert_info}
              theme="ocean"
            />
          </div>
        </div>
      </Drawer>
      <div className="float-right" style={{ marginRight: "10px" }}>
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
      <Table
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              showDrawer();
              setRecord({ ...record });
            },
          };
        }}
        rowKey="ID"
        loading={loading}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={alerts}
        scroll={{ y: getHeightScroll(), x: 1000 }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: CONSTANT_DATA.PAGINATION.page_size,
          total: totalCount, //response first filter require total
          onChange: (page, pageSize) => {
            setFilter({ ...filter, page_no: page });
          },
        }}
      />
    </>
  );
};

export default DataGrid;

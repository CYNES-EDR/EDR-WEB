"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import exportToExcel from "@/helpers/export-to-excel";
import formatDateString from "@/helpers/format-date";
import getHeightScroll from "@/helpers/get-height-scroll";
import { EVENT } from "@/types/event";
import { ExportOutlined } from "@ant-design/icons";
import { Drawer, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import CONSTANT_DATA from "../common/constant";
import "./index.css";

const columns: ColumnsType<EVENT> = [
  {
    title: "ID",
    dataIndex: "ID",
    key: "ID",
    width: 70,
    align: "center",
  },
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
    width: 180,
    align: "center",
  },
  {
    title: "Event Name",
    dataIndex: "event_name",
    key: "event_name",
    width: 120,
    align: "center",
  },
  {
    title: "Event level",
    dataIndex: "event_level",
    key: "event_level",
    width: 120,
    align: "center",
    render: (event_level) => {
      switch (event_level) {
        case 1:
          return <Tag color="rgba(255, 255, 255, 0.52)">Low</Tag>;
        case 2:
          return <Tag color="#7EE1FF">Medium</Tag>;
        default:
          return <Tag color="#2693F5">High</Tag>;
      }
    },
  },
  {
    title: "Event description",
    dataIndex: "event_description",
    key: "event_description",
    width: 440,
    className: "ellipsis-cell",
  },
  {
    title: "Time",
    dataIndex: "created_at",
    key: "created_at",
    fixed: "right",
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
  const [record, setRecord] = useState<EVENT>({} as EVENT);
  const [open, setOpen] = useState(false);
  const [events, setEventList] = useState<EVENT[]>([] as EVENT[]);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
    filter["filter"] = [...filter["filter"], ...search]; // Add filter time range and search
  }

  Object.assign(filter, CONSTANT_DATA.REQUIRED_TOTAL);

  const exportData = async () => {
    setLoadingExport(true);
    filter.page_no = 1;
    filter.page_size = 10000;
    let resData: {
      success: boolean;
      events: EVENT[];
      count: number;
    } = await customAxiosPost(API_URL.EVENTS.GET_EVENTS, filter);
    exportToExcel(resData.events, "events.xlsx");
    setLoadingExport(false);
  };

  useEffect(() => {
    let url = API_URL.EVENTS.GET_EVENTS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        events: EVENT[];
        count: number;
      } = await customAxiosPost(url, filter);
      if (resData.success) {
        setTotalCount(resData.count);
        setEventList(
          resData.events.map((data, index) => {
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
            <span style={{ color: "#818798" }}>Event/ </span>
            <span className="text-white">Details</span>
          </>
        }
        onClose={onClose}
        open={open}
        placement={"right"}
        width={800}
      >
        <div className="p-8 pt-0">
          <h3 className="summary-title text-white text-3xl pb-2">Summary</h3>
          <div
            className="summary-detail p-4"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <p className="flex items-center">
              <Tag color="#0B5970"> Event Description: </Tag>
              <span className="dark:text-white">
                {record.event_description}
              </span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Artifact Name: </Tag>
              <span className="dark:text-white">{record.artifact_name}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Mitre Tactic: </Tag>
              <span className="dark:text-white">{record.mitre_tactic}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Mitre Technique: </Tag>
              <span className="dark:text-white">{record.mitre_technique}</span>
            </p>
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
              src={record.event_info}
              theme="ocean"
            />
          </div>
        </div>
      </Drawer>
      <div className="float-right" style={{ marginRight: "10px" }}>
        {loadingExport ? (
          <>
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
        rowKey="ID"
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              showDrawer();
              setRecord({ ...record });
            },
          };
        }}
        className="dark:border-strokedark dark:bg-boxdark"
        columns={columns}
        dataSource={events}
        scroll={{ y: getHeightScroll(), x: 1000 }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: CONSTANT_DATA.PAGINATION.page_size,
          total: totalCount, // response first filter require total
          onChange: (page, pageSize) => {
            setFilter({ ...filter, page_no: page });
          },
        }}
      />
    </>
  );
};

export default DataGrid;

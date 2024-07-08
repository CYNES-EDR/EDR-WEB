"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost, customAxiosDelete } from "@/helpers/custom-axios";
import exportToExcel from "@/helpers/export-to-excel";
import { ExportOutlined } from "@ant-design/icons";
import formatDateString from "@/helpers/format-date";
import getHeightScroll from "@/helpers/get-height-scroll";
import { AGENT } from "@/types/agent";
import type { TableColumnsType } from "antd";
import {
  Drawer,
  List,
  Progress,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import CONSTANT_DATA from "../common/constant";
import "./index.css";
const checkOnline = (lastSeen: string) => {
  const inputTime = new Date(lastSeen);
  const currentTime = new Date();
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
  // Compare the input time with the current time
  if (inputTime > fiveMinutesAgo) {
    return (
      <Tag
        style={{
          height: "16px",
          borderRadius: "50%",
          width: "16px",
          minWidth: "unset",
        }}
        color="#87d068"
      ></Tag>
    );
  } else {
    return (
      <Tag
        style={{
          height: "16px",
          borderRadius: "50%",
          width: "16px",
          minWidth: "unset",
        }}
        color="rgba(255, 255, 255, 0.52)"
      ></Tag>
    );
  }
};
function extractNumericValue(inputString: string) {
  if (inputString == "") {
    return 0;
  }
  var match = inputString.match(/\(([^)]+)\)$/);
  if (match) {
    var numericValue = parseInt(match[1], 10);
    return numericValue;
  } else {
    return 0;
  }
}

type DataGridProps = {
  groupFilter: any;
  search?: { field: string; operator: string; value: string }[];
};
const DrawerAgent: React.FC<DataGridProps> = ({ groupFilter, search }) => {
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentList, setAgentList] = useState<AGENT[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [agentDrawer, setAgentDrawer] = useState<AGENT>({} as AGENT); //set data when dupble click in table row
  const [filter, setFilter] = useState<any>(CONSTANT_DATA.PAGINATION);
  const uninstall = (url: string) => {
    customAxiosDelete(url).then((response: any) => {
      if (!response?.error) {
        setReload(!reload);
      }
    });
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
  filter["filter"] = groupFilter;
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
      data: { agents: AGENT[] };
      count: number;
    } = await customAxiosPost(API_URL.AGENT.GET_AGENTS, filter);
    exportToExcel(resData.data.agents, "agents.xlsx");
    setLoadingExport(false);
  };

  // === Drawer ====
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  //=== End ====
  const columns: TableColumnsType<AGENT> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 50,
      align: "center",
    },
    {
      title: "MAC",
      dataIndex: "mac",
      key: "mac",
      width: 150,
      align: "center",
      render: (item, record) => {
        console.log(record);
        return (
          <div className="flex items-center">
            {checkOnline(record.last_seen || "")} <span>{item}</span>
          </div>
        );
      },
    },

    {
      title: "Local IP",
      dataIndex: "local_ip",
      key: "local_ip",
      width: 150,
      align: "center",
    },
    {
      title: "Public IP",
      dataIndex: "public_ip",
      key: "public_ip",
      width: 120,
      align: "center",
    },
    {
      title: "Computer Name",
      dataIndex: "computer_name",
      key: "computer_name",
      width: 200,
      align: "center",
    },
    // { title: "OS", dataIndex: "os", key: "os", width: 200 },

    {
      title: "Version",
      dataIndex: "agent_version",
      key: "agent_version",
      width: 120,
      align: "center",
    },
    // {
    //   title: "Agent install",
    //   dataIndex: "agent_first_install",
    //   key: "agent_first_install",
    //   width: 120,
    // },
    {
      title: "User",
      dataIndex: "agent_user",
      key: "agent_user",
      width: 120,
      align: "center",
    },
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      render: (item) => {
        return formatDateString(item);
      },
      align: "center",
    },
    {
      title: "Remote",
      key: "remote",
      align: "center",
      width: 120,
      render: (item, record) => {
        return (
          <Switch
            onChange={(checked) => {
              remote(record.id, checked);
            }}
          />
        );
      },
    },
  ];

  const remote = async (id: string, checked: boolean) => {
    let url = API_URL.AGENT.REMOTE_AGENT;
    let params = {
      id: id,
      require_remote: checked,
    };
    let resData: {
      success: boolean;
      msg: string;
    } = await customAxiosPost(url, params);
    if (resData.success && checked) {
      window.open("/control-directly", "_blank", "noopener,noreferrer");
    }
  };
  useEffect(() => {
    let url = API_URL.AGENT.GET_AGENTS;
    let getData = async () => {
      setLoading(true);
      let resData: {
        success: boolean;
        data: { agents: AGENT[]; count: number };
      } = await customAxiosPost(url, filter);
      if (resData.success) {
        console.log(resData);
        setTotalCount(resData.data.count);
        setAgentList(
          resData.data.agents.map((data, index) => {
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
  }, [groupFilter, search, filter, reload]);
  //

  return (
    <>
      {/* Show Drawer content in the rightside  */}
      <Drawer
        title={
          <>
            <span style={{ color: "#818798" }}>Agent/ </span>
            <span className="text-white">Details</span>
          </>
        }
        onClose={onClose}
        open={open}
        placement={"right"}
        width={800}
        extra={
          <Button
            className="text-white"
            type="primary"
            onClick={() => {
              uninstall(API_URL.AGENT.GET_AGENTS + "/" + agentDrawer?.id);
            }}
          >
            Uninstall
          </Button>
        }
      >
        <div className="p-8 pt-6">
          <div className="flex justify-between">
            <h3 className="summary-title text-white text-3xl pb-2">
              Agent Info
            </h3>
            <div>{checkOnline(agentDrawer?.last_seen || "undefine")}</div>
          </div>

          <div
            className="summary-detail p-4"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <p className="flex">
              <Tag color="#0B5970"> ID: </Tag>
              <span className="dark:text-white">{agentDrawer.id}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Computer Name: </Tag>
              <span className="dark:text-white">
                {agentDrawer.computer_name}
              </span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Created At: </Tag>
              <span className="dark:text-white">{agentDrawer.created_at}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Received time: </Tag>
              <span className="dark:text-white">{agentDrawer.last_seen}</span>
            </p>
          </div>
        </div>
        <div className="p-8 pt-0">
          <h3 className="summary-title text-white text-3xl pb-2">Properties</h3>
          <div
            className="summary-detail p-4"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <p className="mt-2 flex">
              <Tag color="#0B5970">Model: </Tag>
              <span className="dark:text-white">{agentDrawer.model}</span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Manufacturer: </Tag>
              <span className="dark:text-white">
                {agentDrawer.manufacturer}
              </span>
            </p>
            <p className="mt-2 flex">
              <Tag color="#0B5970">Tag: </Tag>
              <span className="dark:text-white">{agentDrawer.tags}</span>
            </p>
          </div>
        </div>
        <div className="p-8 pt-0">
          <h3 className="summary-title text-white text-3xl pb-2">
            About Agents
          </h3>
          <div
            className="summary-detail p-4"
            style={{ backgroundColor: "rgb(38 38 41)" }}
          >
            <Tabs
              // onChange={onChange}
              className="dark:text-white"
              type="card"
              items={[
                {
                  label: `Detail`,
                  key: "1",
                  children: (
                    <List
                      dataSource={[
                        `MAC: ${agentDrawer.mac}`,
                        `Local IP: ${agentDrawer.local_ip}`,
                        `Public IP: ${agentDrawer.public_ip}`,
                        `Computer Name: ${agentDrawer.computer_name}`,
                        `Motherboard Serial: ${agentDrawer.motherboard_serial}`,
                        `OS: ${agentDrawer.os}`,
                      ]}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  ),
                },
                {
                  label: `Network card`,
                  key: "2",
                  children: (
                    <Table
                      dataSource={agentDrawer.network_cards}
                      columns={[
                        {
                          title: "MAC",
                          dataIndex: "mac",
                          key: "mac",
                        },
                        {
                          title: "IP",
                          dataIndex: "ip",
                          key: "ip",
                        },
                        {
                          title: "Description",
                          dataIndex: "description",
                          key: "description",
                        },
                      ]}
                    />
                  ),
                },
                {
                  label: `Software Info`,
                  key: "3",
                  children: (
                    <Table
                      dataSource={agentDrawer.software_info}
                      columns={[
                        {
                          title: "Software name",
                          dataIndex: "name",
                          key: "name",
                        },
                        {
                          title: "Version",
                          dataIndex: "version",
                          key: "version",
                        },
                      ]}
                    />
                  ),
                },

                {
                  label: `Hardware`,
                  key: "4",
                  children: (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-300 p-4">
                        <span className="mr-4">CPU:</span>
                        <Progress
                          strokeColor={"rgb(38, 147, 245)"}
                          status="active"
                          type="circle"
                          percent={extractNumericValue(agentDrawer.ram || "")}
                        />
                      </div>
                      <div className="bg-gray-300 p-4">
                        <span className="mr-4">RAM:</span>
                        <Progress
                          strokeColor={"rgb(38, 147, 245)"}
                          status="active"
                          type="circle"
                          percent={extractNumericValue(agentDrawer?.cpu || "")}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Drawer>
      {/* Table content */}
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
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => {
              showDrawer();
              setAgentDrawer(record);
            },
          };
        }}
        columns={columns} //column name and title
        dataSource={agentList} //dataSource from useEffect
        scroll={{ y: 500, x: 1000 }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: CONSTANT_DATA.PAGINATION.page_size,
          total: totalCount, //response first filter require total
          onChange: (page, pageSize) => {
            setFilter({ ...filter, page_no: page });
          },
        }}
      />
      {/* ================ */}
    </>
  );
};

export default DrawerAgent;

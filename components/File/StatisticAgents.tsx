"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import { Col, Row, Statistic, Badge } from "antd";
import { customAxiosPost } from "@/helpers/custom-axios";
import API_URL from "@/helpers/api-url";
type DataGridProps = {
  timeRange: string[];
};
type AgentStatus = {
  online: number;
  offline: number;
};
const StatisticAgents: React.FC<DataGridProps> = ({ timeRange }) => {
  const [data, setData] = useState<AgentStatus>({ online: 0, offline: 0 });
  let startDate = "";
  if (timeRange) {
    startDate = timeRange[0];
  }
  useEffect(() => {
    let url = API_URL.AGENT.COUNT_AGENTS;
    let getData = async () => {
      let resData: { success: boolean; data: AgentStatus } =
        await customAxiosPost(url, startDate);
      console.log(resData);
      if (resData.success) {
        setData(resData.data);
      }
    };
    getData();
  }, [timeRange, startDate]);
  return (
    <div className="">
      <Row gutter={16}>
        <Col
          className="flex justify-center items-center border-r border-solid border-gray"
          span={4}
        >
          <h4 className="text-xl capitalize text-center">Agent Status</h4>
        </Col>

        <Col className="border-r border-solid border-gray " span={5}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="success" />
                <p className="ml-2 opacity-70 font-bold"> Online</p>
              </div>
            }
            value={data.online}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="error" />
                <p className="ml-2 opacity-70 font-bold"> Offline</p>
              </div>
            }
            value={data.offline}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticAgents;

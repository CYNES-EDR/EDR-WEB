"use client";
import API_URL from "@/helpers/api-url";
import calculatePercentages from "@/helpers/caculatePercentages";
import { customAxiosPost } from "@/helpers/custom-axios";
import { Progress } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
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
  let [dataPercentage, setDataPercentage] = useState<any>({
    online: 0,
    offline: 0,
  });
  useEffect(() => {
    let url = API_URL.AGENT.COUNT_AGENTS;
    let getData = async () => {
      let resData: { success: boolean; data: AgentStatus } =
        await customAxiosPost(url, startDate);
      if (resData.success) {
        setData(resData.data);
        setDataPercentage(calculatePercentages(resData.data));
      }
    };
    getData();
  }, [timeRange, startDate]);
  return (
    <div className="severity">
      <div className="flex justify-around items-center">
        <div className="w-1/4">
          <div className="flex items-center  justify-around flex-row">
            {/* <div className="w-1/2"></div> */}
            <div className="w-full">
              <div className="parent m-auto">
                <b
                  style={{
                    color: "#dceefd",
                    width: "90%",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                  {Object.values(data)
                    .reduce((acc, val) => acc + val, 0)
                    .toLocaleString("en-US")}
                </b>
                <div className="total-events w-full text-center">Agents</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#2693f5",
                width: "fit-content",
                marginRight: "10px",
                fontSize: "24px",
              }}
            >
              {data.online.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">Online</p>
              <Progress
                strokeColor="#2693f5"
                status="active"
                percent={dataPercentage.online}
              />
            </div>
          </div>
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#dceefd",
                width: "fit-content",
                marginRight: "10px",
                fontSize: "24px",
              }}
            >
              {data.offline.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">Offline</p>
              <Progress
                percent={dataPercentage.offline}
                strokeColor="#dceefd"
                status="active"
              />
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <img
            className="art-icon float-right"
            alt=""
            src="/images/art-agent.png"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default StatisticAgents;

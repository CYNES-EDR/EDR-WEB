"use client";
import API_URL from "@/helpers/api-url";
import calculatePercentages from "@/helpers/caculatePercentages";
import { customAxiosPost } from "@/helpers/custom-axios";
import { Progress } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
type DataGridProps = {
  timeRange: string[];
  search?: { field: string; operator: string; value: string }[];
};
type AlertLevel = {
  hight: number;
  medium: number;
  low: number;
};
const StatisticEvent: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const [data, setData] = useState<AlertLevel>({ hight: 0, medium: 0, low: 0 });
  let [dataPercentage, setDataPercentage] = useState<any>({
    hight: 0,
    medium: 0,
    low: 0,
  });
  let filter: any = {};
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
  useEffect(() => {
    let url = API_URL.ALERTS.COUNT_ALERTS;
    let getData = async () => {
      let resData: { success: boolean; data: AlertLevel } =
        await customAxiosPost(url, filter);
      console.log(resData);
      if (resData.success) {
        setData(resData.data);
        setDataPercentage(calculatePercentages(resData.data));
      }
    };

    getData();
  }, [timeRange, search]);
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
                    width: "100%",
                    fontSize: "24px",
                    textAlign: "center",
                  }}
                >
                  {Object.values(data)
                    .reduce((acc, val) => acc + val, 0)
                    .toLocaleString("en-US")}
                </b>
                <p className="total-events text-center w-full">Total alerts</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#EF8325",
                width: "fit-content",
                marginRight: "10px",
                fontSize: "24px",
              }}
            >
              {data.hight.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">High</p>
              <Progress
                strokeColor="#EF8325"
                status="active"
                percent={dataPercentage.hight}
              />
            </div>
          </div>
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#F2B325",
                width: "fit-content",
                marginRight: "10px",
                fontSize: "24px",
              }}
            >
              {data.medium.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">Medium</p>
              <Progress
                percent={dataPercentage.medium}
                strokeColor="#F2B325"
                status="active"
              />
            </div>
          </div>
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#FBE5B5",
                width: "fit-content",
                marginRight: "10px",
                fontSize: "24px",
              }}
            >
              {data.low.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">Low</p>
              <Progress
                percent={dataPercentage.low}
                strokeColor="#FBE5B5"
                status="active"
              />
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div
            style={{
              backgroundImage:
                'url("/images/alert_icon.svg"), url("/images/ArtBG2.png")',
              backgroundPosition: "center center, center bottom",
              backgroundRepeat: "no-repeat, no-repeat",
              width: "100%",
              height: "144px",
            }}
          ></div>
        </div>
      </div>

      {/* <Row gutter={15}>
        <Col
          className="flex justify-center items-center border-r border-solid border-gray"
          span={4}
        >
          <h4 className="text-xl capitalize">Severity</h4>
        </Col>
        <Col className="border-r border-solid border-gray" span={5}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="error" />
                <p className="ml-2 opacity-70 font-bold"> Hight</p>
              </div>
            }
            value={data.hight}
          />
        </Col>

        <Col className="border-r border-solid border-gray" span={5}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="warning" />
                <p className="ml-2 opacity-70 font-bold"> Medium</p>
              </div>
            }
            value={data.medium}
          />
        </Col>
        <Col className="border-r border-solid border-gray " span={5}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="processing" />
                <p className="ml-2 opacity-70 font-bold"> Low</p>
              </div>
            }
            value={data.low}
          />
        </Col>
      </Row> */}
    </div>
  );
};

export default StatisticEvent;

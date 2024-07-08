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
type EventLevel = {
  hight: number;
  medium: number;
  low: number;
};
const StatisticEvent: React.FC<DataGridProps> = ({ timeRange, search }) => {
  const [data, setData] = useState<EventLevel>({ hight: 0, medium: 0, low: 0 });
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

    if (search) {
      filter["filter"] = [...filter["filter"], ...search]; // Add filter time range and search
    }
  }
  useEffect(() => {
    let url = API_URL.EVENTS.COUNT_EVENTS;
    let getData = async () => {
      let resData: { success: boolean; data: EventLevel } =
        await customAxiosPost(url, filter);
      console.log(resData);
      if (resData.success) {
        setData(resData.data);
        console.log(calculatePercentages(resData.data));
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
              <div className="parent m-auto" style={{ width: "80%" }}>
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
                <p className="total-events text-center w-full">Total events</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/4">
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
              {data.hight.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">High</p>
              <Progress
                strokeColor="#2693f5"
                status="active"
                percent={dataPercentage.hight}
              />
            </div>
          </div>
          <div className="flex items-center  justify-around flex-row">
            <p
              className="font-bold"
              style={{
                color: "#7ee1ff",
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
                strokeColor="#7ee1ff"
                status="active"
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
              {data.low.toLocaleString("en-US")}
            </p>
            <div style={{ width: "90%" }}>
              <p className="font-bold">Low</p>
              <Progress
                percent={dataPercentage.low}
                strokeColor="#dceefd"
                status="active"
              />
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div
            style={{
              backgroundImage:
                'url("/images/calendar_icon.svg"), url("/images/ArtBG2.png")',
              backgroundPosition: "center center, center bottom",
              backgroundRepeat: "no-repeat, no-repeat",
              width: "100%",
              height: "144px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatisticEvent;

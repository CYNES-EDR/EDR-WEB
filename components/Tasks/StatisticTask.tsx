"use client";
import React, { useEffect, useState } from "react";
import "./index.css";
import { customAxiosPost } from "@/helpers/custom-axios";
import API_URL from "@/helpers/api-url";
import { Col, Row, Statistic, Badge } from "antd";
type DataGridProps = {
  timeRange: string[];
};
type TaskStatus = {
  active: number;
  deactivate: number;
};
const StatisticDatabase: React.FC<DataGridProps> = ({ timeRange }) => {
  const [data, setData] = useState<TaskStatus>({ active: 0, deactivate: 0 });
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
  useEffect(() => {
    let url = API_URL.TASKS.COUNT_TASKS;
    console.log("url", url);
    let getData = async () => {
      let resData: { success: boolean; data: TaskStatus } =
        await customAxiosPost(url, filter);
      console.log(resData);
      if (resData.success) {
        setData(resData.data);
      }
    };

    getData();
  }, [timeRange]);

  return (
    <div className="">
      <Row gutter={16}>
        <Col
          className="flex justify-center items-center border-r border-solid border-gray"
          span={4}
        >
          <h4 className="text-xl capitalize">Severity</h4>
        </Col>
        <Col className="border-r border-solid border-gray" span={6}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="error" />
                <p className="ml-2 opacity-70 font-bold"> Deactivate</p>
              </div>
            }
            value={data.deactivate}
          />
        </Col>

        <Col className="border-r border-solid border-gray " span={6}>
          <Statistic
            title={
              <div className="flex">
                <Badge status="processing" />
                <p className="ml-2 opacity-70 font-bold"> Active</p>
              </div>
            }
            value={data.active}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticDatabase;

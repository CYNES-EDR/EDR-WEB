import React from "react";
import "./index.css";
import { Col, Row, Statistic, Badge } from "antd";
import {
  WifiOutlined,
  UploadOutlined,
  DownloadOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
const StatisticAgents: React.FC = () => (
  <div className="">
    <Row gutter={16}>
      <Col
        className="flex justify-center items-center border-r border-solid border-gray"
        span={4}
      >
        <h4 className="text-xl capitalize text-center">List Command</h4>
      </Col>

      <Col className="border-r border-solid border-gray " span={5}>
        <Statistic
          title={
            <div className="flex">
              <UploadOutlined className="text-xl"></UploadOutlined>
              <p className="ml-2 opacity-70 font-bold"> Upload</p>
            </div>
          }
          value={28}
        />
      </Col>
      <Col className="border-r border-solid border-gray " span={5}>
        <Statistic
          title={
            <div className="flex">
              <WifiOutlined className="text-xl" />
              <p className="ml-2 opacity-70 font-bold"> Live</p>
            </div>
          }
          value={19}
        />
      </Col>
      <Col className="border-r border-solid border-gray" span={5}>
        <Statistic
          title={
            <div className="flex">
              <CloudSyncOutlined className="text-xl" />
              <p className="ml-2 opacity-70 font-bold"> Update</p>
            </div>
          }
          value={90}
        />
      </Col>
      <Col span={5}>
        <Statistic
          title={
            <div className="flex">
              <DownloadOutlined className="text-xl" />
              <p className="ml-2 opacity-70 font-bold"> Download</p>
            </div>
          }
          value={190}
        />
      </Col>
    </Row>
  </div>
);

export default StatisticAgents;

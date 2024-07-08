import React from "react";
import "./index.css";
import { Col, Row, Statistic, Badge } from "antd";

const StatisticDatabase: React.FC = () => (
  <div className="">
    <Row gutter={16}>
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
              <p className="ml-2 opacity-70 font-bold"> Critical</p>
            </div>
          }
          value={90}
        />
      </Col>

      <Col className="border-r border-solid border-gray" span={5}>
        <Statistic
          title={
            <div className="flex">
              <Badge status="warning" />
              <p className="ml-2 opacity-70 font-bold"> Hight</p>
            </div>
          }
          value={130}
        />
      </Col>
      <Col className="border-r border-solid border-gray " span={5}>
        <Statistic
          title={
            <div className="flex">
              <Badge status="processing" />
              <p className="ml-2 opacity-70 font-bold"> Medium</p>
            </div>
          }
          value={2880}
        />
      </Col>
      <Col span={5}>
        <Statistic
          title={
            <div className="flex">
              <Badge status="default" />
              <p className="ml-2 opacity-70 font-bold"> Low</p>
            </div>
          }
          value={1990}
        />
      </Col>
    </Row>
  </div>
);

export default StatisticDatabase;

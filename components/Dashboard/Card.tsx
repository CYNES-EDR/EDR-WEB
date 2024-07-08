"use client";
import API_URL from "@/helpers/api-url";
import { customAxiosPost } from "@/helpers/custom-axios";
import { Tag } from "antd";
import React, { useEffect, useState } from "react";
import ChartThree from "../../components/Charts/ChartThree";
import CardDataStats from "../CardDataStats";
import calculatePercentages from "@/helpers/caculatePercentages";
import { DeliveredProcedureOutlined } from "@ant-design/icons";

type CARD = {
  agents: {
    online: number;
    offline: number;
  };
  alerts: {
    hight: number;
    medium: number;
    low: number;
  };
  events: {
    hight: number;
    medium: number;
    low: number;
  };
};
const cardInit: CARD = {
  agents: {
    online: 0,
    offline: 0,
  },
  alerts: {
    hight: 0,
    medium: 0,
    low: 0,
  },
  events: {
    hight: 0,
    medium: 0,
    low: 0,
  },
};
function formatNumberWithDots(number: number) {
  // Convert number to string
  const numStr = number.toString();
  // Check if the number is greater than 1000
  if (number > 1000) {
    // Split the string into parts before and after the decimal point
    const parts = numStr.split(".");
    // Add dots (or commas) as thousand separators to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Join the parts back together
    return parts.join(".");
  } else {
    // Return the original number if it's not greater than 1000
    return numStr;
  }
}
function calculateRatios(number1: number, number2: number, number3?: number) {
  // Check if any of the numbers is zero
  if (number1 === 0) {
    return [0, 100];
  }
  if (number2 == 0) {
    return [100, 0];
  }
  let sum = number1 + number2;
  if (number3) {
    sum = sum + number3;
  }
  const ratio1 = (number1 / sum) * 100;
  const ratio2 = (number2 / sum) * 100;
  return [Number(ratio1.toFixed(0)), Number(ratio2.toFixed(0))];
}
type DataGridProps = {
  timeRange?: string[];
  card?: CARD;
};
type AgentStatus = {
  online: number;
  offline: number;
};
type AlertLevel = {
  hight: number;
  medium: number;
  low: number;
};
const Card: React.FC<DataGridProps> = ({ timeRange }) => {
  const [card, setCard] = useState<CARD>(cardInit);
  let startDate = "";
  let filter: any = {};
  if (timeRange) {
    startDate = timeRange[0];
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
    let urlAgent = API_URL.AGENT.COUNT_AGENTS;
    let urlAlert = API_URL.ALERTS.COUNT_ALERTS;
    let urlEvent = API_URL.EVENTS.COUNT_EVENTS;
    let getDataAgent = async () => {
      let resData: { success: boolean; data: AgentStatus } =
        await customAxiosPost(urlAgent, startDate);
      if (resData.success) {
        setCard((prevState) => {
          return {
            ...prevState,
            agents: resData.data,
          };
        });
      }
    };
    let getDataAlert = async () => {
      let resData: { success: boolean; data: AlertLevel } =
        await customAxiosPost(urlAlert, filter);
      if (resData.success) {
        setCard((prevState) => {
          return {
            ...prevState,
            alerts: resData.data,
          };
        });
      }
    };
    let getDataEvent = async () => {
      let resData: { success: boolean; data: AlertLevel } =
        await customAxiosPost(urlEvent, filter);
      if (resData.success) {
        setCard((prevState) => {
          return {
            ...prevState,
            events: resData.data,
          };
        });
      }
    };
    getDataAlert();
    getDataAgent();
    getDataEvent();
  }, [timeRange, startDate]);

  return (
    <div className="dashboard-card gap-2 grid grid-cols-1  md:grid-cols-2  xl:grid-cols-2  mt-7.5">
      <CardDataStats
        filter={filter}
        title="Agents"
        total={formatNumberWithDots(card.agents.online + card.agents.offline)}
        // newData="+ 1"
        detail={[
          {
            title: "Online",
            count: formatNumberWithDots(card.agents.online),
            ratio: calculateRatios(card.agents.online, card.agents.offline)[0],
          },
          {
            title: "Offline",
            count: formatNumberWithDots(card.agents.offline),
            ratio: calculateRatios(card.agents.online, card.agents.offline)[1],
          },
        ]}
        // levelUp
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="101"
          height="100"
          viewBox="0 0 101 100"
          fill="none"
        >
          <g clip-path="url(#clip0_3388_11467)">
            <path
              d="M3 11C3 6.58172 6.58172 3 11 3H91C95.4183 3 99 6.58172 99 11V91C99 95.4183 95.4183 99 91 99H11C6.58172 99 3 95.4183 3 91V11Z"
              fill="url(#paint0_linear_3388_11467)"
              fill-opacity="0.8"
            />
            <g filter="url(#filter1_b_3388_11467)">
              <path
                d="M3 11C3 6.58172 6.58172 3 11 3H91C95.4183 3 99 6.58172 99 11V91C99 95.4183 95.4183 99 91 99H11C6.58172 99 3 95.4183 3 91V11Z"
                fill="url(#paint1_linear_3388_11467)"
                fill-opacity="0.6"
              />
            </g>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 2H91C95.9706 2 100 6.02944 100 11V91C100 95.9706 95.9706 100 91 100H11C6.02944 100 2 95.9706 2 91V11C2 6.02944 6.02944 2 11 2ZM11 3C6.58172 3 3 6.58172 3 11V91C3 95.4183 6.58172 99 11 99H91C95.4183 99 99 95.4183 99 91V11C99 6.58172 95.4183 3 91 3H11Z"
              fill="url(#paint2_linear_3388_11467)"
            />
            <g filter="url(#filter2_d_3388_11467)">
              <path
                d="M77.6666 21.667H24.3334C21.3932 21.667 19 24.059 19 27.0004V64.3337C19 67.2751 21.3932 69.6671 24.3334 69.6671H43.006C42.95 71.7944 42.5437 75.1971 41.0182 76.8039C40.4584 77.3924 39.8177 77.6671 39 77.6671C38.263 77.6671 37.6666 78.2635 37.6666 79.0005C37.6666 79.7375 38.263 80.3339 39 80.3339H63C63.737 80.3339 64.3334 79.7375 64.3334 79.0005C64.3334 78.2635 63.737 77.6671 63 77.6671C62.1823 77.6671 61.5416 77.3936 60.9844 76.8051C59.4626 75.2064 59.0537 71.7987 58.9956 69.6671H77.6668C80.6069 69.6671 83.0001 67.2752 83.0001 64.3337V27.0004C83 24.059 80.6068 21.667 77.6666 21.667ZM51 67.0081C49.526 67.0081 48.3255 65.8076 48.3255 64.3336C48.3255 62.8596 49.526 61.6591 51 61.6591C52.474 61.6591 53.6745 62.8596 53.6745 64.3336C53.6745 65.8076 52.474 67.0081 51 67.0081ZM24.3334 59.0004V27.0004H77.6668L77.669 59.0004H24.3334Z"
                fill="url(#paint3_linear_3388_11467)"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_b_3388_11467"
              x="-0.470703"
              y="-1.6377"
              width="105.471"
              height="106.638"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="3" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_3388_11467"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_3388_11467"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_b_3388_11467"
              x="-27"
              y="-27"
              width="156"
              height="156"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="15" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_3388_11467"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_3388_11467"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d_3388_11467"
              x="16"
              y="18.667"
              width="72"
              height="66.667"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0117647 0 0 0 0 0.364706 0 0 0 0 0.745098 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3388_11467"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_3388_11467"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_3388_11467"
              x1="-27"
              y1="-18"
              x2="114"
              y2="108"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.635465" stop-color="#00BBFF" stop-opacity="0" />
              <stop offset="1" stop-color="#18ACFF" stop-opacity="0.8" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_3388_11467"
              x1="3"
              y1="-3.5"
              x2="96.5"
              y2="99"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#00BBFF" stop-opacity="0.19" />
              <stop offset="1" stop-color="#206DC7" stop-opacity="0.1" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_3388_11467"
              x1="120"
              y1="99"
              x2="8.5"
              y2="-10"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.005" stop-color="#B5EBFF" />
              <stop offset="0.543227" stop-color="#238AC5" />
              <stop offset="1" stop-color="#1E1F24" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_3388_11467"
              x1="49"
              y1="81.5004"
              x2="74.1542"
              y2="84.6286"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2693F5" />
              <stop offset="1" stop-color="#19CAFF" />
            </linearGradient>
            <clipPath id="clip0_3388_11467">
              <rect width="101" height="100" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </CardDataStats>

      {/* Card left side end*/}

      <div
        className="grid grid-cols-2 gap-4 p-4"
        style={{ background: "#292A3", border: "1px solid rgb(46 58 71)" }}
      >
        <div className="flex flex-col justify-center items-center">
          {" "}
          <div className="bg-blue-100 flex items-center justify-center rounded-lg p-4">
            <div
              style={{
                background:
                  "linear-gradient(167deg, #FFD978 -44%, rgba(0, 0, 0, 0.00) -43.99%, rgba(255, 199, 0, 0.14) 101.49%)",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.25)",
              }}
              className="p-2 mr-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <path
                  d="M35.6832 30.2603L19.8889 4.06678C19.4897 3.40479 18.773 3 17.9999 3C17.2269 3 16.5102 3.40472 16.111 4.06678L0.316825 30.2603C-0.0939411 30.9415 -0.106105 31.7912 0.285114 32.4839C0.676333 33.1766 1.41019 33.605 2.2057 33.605H33.7943C34.5898 33.605 35.3236 33.1765 35.7149 32.4839C36.1061 31.7912 36.094 30.9415 35.6832 30.2603ZM18.0118 12.0606C18.9189 12.0606 19.6864 12.5724 19.6864 13.4794C19.6864 16.2471 19.3608 20.2244 19.3608 22.9921C19.3608 23.7132 18.57 24.0154 18.0118 24.0154C17.2676 24.0154 16.6395 23.7131 16.6395 22.9921C16.6395 20.2244 16.314 16.2471 16.314 13.4794C16.314 12.5724 17.0582 12.0606 18.0118 12.0606ZM18.035 29.2022C17.0117 29.2022 16.2441 28.3649 16.2441 27.4113C16.2441 26.4345 17.0116 25.6205 18.035 25.6205C18.9886 25.6205 19.8027 26.4345 19.8027 27.4113C19.8027 28.3649 18.9886 29.2022 18.035 29.2022Z"
                  fill="url(#paint0_linear_3388_11646)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_3388_11646"
                    x1="23"
                    y1="6"
                    x2="-3.10599e-06"
                    y2="34.0525"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FFEA79" />
                    <stop offset="1" stop-color="#F1890F" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-2xl font-bold text-white">
                {Object.values(card.alerts)
                  .reduce((acc, curr) => acc + curr, 0)
                  .toLocaleString("en-US")}
              </p>
              <p className="text-xs">Alerts</p>
            </div>
            <div className="hidden xl:block">
              <ChartThree
                labels={["High", "Medium", "Low"]}
                colors={["#EF8325", "#F2B325", "#FBE5B5"]}
                data={Object.values(calculatePercentages(card.alerts)).map(
                  Number
                )}
              />
            </div>
          </div>
          {/* <div className="flex flex-col flex-wrap items-start xl:flex-row xl:items-center justify-between">
            <div className="flex items-center justify-center flex-wrap bg-blue-300">
              <Tag color="#EF8325">{card.alerts.hight}</Tag>
              <span className="text-white">Hight</span>
            </div>
            <div className="flex items-center justify-center bg-green-300">
              <Tag color="#F2B325">{card.alerts.medium}</Tag>
              <span className="text-white">Medium</span>
            </div>
            <div className="flex items-center justify-center bg-yellow-300">
              <Tag color="#FBE5B5">{card.alerts.low}</Tag>
              <span className="text-white">Low</span>
            </div>
          </div> */}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="bg-blue-100 flex items-center justify-center rounded-lg p-4">
            <div
              style={{
                background:
                  "linear-gradient(167deg, #98E8FF -44%, rgba(189, 240, 255, 0.00) -43.99%, rgba(105, 221, 255, 0.31) 101.49%)",
                padding: "10px",
                borderRadius: "10px",
              }}
              className="p-2 mr-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
              >
                <g filter="url(#filter0_d_3388_11655)">
                  <path
                    d="M33.9 8.1H32.2V4.7C32.2 4.24913 32.0209 3.81673 31.7021 3.49792C31.3833 3.17911 30.9509 3 30.5 3C30.0491 3 29.6167 3.17911 29.2979 3.49792C28.9791 3.81673 28.8 4.24913 28.8 4.7V8.1H15.2V4.7C15.2 4.24913 15.0209 3.81673 14.7021 3.49792C14.3833 3.17911 13.9509 3 13.5 3C13.0491 3 12.6167 3.17911 12.2979 3.49792C11.9791 3.81673 11.8 4.24913 11.8 4.7V8.1H10.1C8.7474 8.1 7.45019 8.63732 6.49376 9.59376C5.53732 10.5502 5 11.8474 5 13.2V14.9H39V13.2C39 11.8474 38.4627 10.5502 37.5062 9.59376C36.5498 8.63732 35.2526 8.1 33.9 8.1Z"
                    fill="url(#paint0_linear_3388_11655)"
                  />
                  <path
                    d="M5 31.9C5 33.2526 5.53732 34.5498 6.49376 35.5062C7.45019 36.4627 8.7474 37 10.1 37H33.9C35.2526 37 36.5498 36.4627 37.5062 35.5062C38.4627 34.5498 39 33.2526 39 31.9V18.3H5V31.9Z"
                    fill="url(#paint1_linear_3388_11655)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_3388_11655"
                    x="0"
                    y="0"
                    width="42"
                    height="42"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="-1" dy="1" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.0684862 0 0 0 0 0.456624 0 0 0 0 0.14222 0 0 0 0.31 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_3388_11655"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_3388_11655"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_3388_11655"
                    x1="39"
                    y1="0.343749"
                    x2="-6.6875"
                    y2="42.8438"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#A5EAFF" />
                    <stop offset="1" stop-color="#52D7FF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_3388_11655"
                    x1="39"
                    y1="0.343749"
                    x2="-6.6875"
                    y2="42.8438"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#A5EAFF" />
                    <stop offset="1" stop-color="#52D7FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-2xl font-bold text-white">
                {" "}
                {Object.values(card.events)
                  .reduce((acc, curr) => acc + curr, 0)
                  .toLocaleString("en-US")}
              </p>
              <p className="text-xs">Events</p>
            </div>
            <ChartThree
              labels={["High", "Medium", "Low"]}
              colors={["#2693F5", "#7EE1FF", "#DCEEFD"]}
              data={Object.values(calculatePercentages(card.events)).map(
                Number
              )}
            />
          </div>
          {/* <div className="flex flex-wrap flex-col items-start xl:flex-row xl:items-center justify-between pt-2">
            <div className=" flex items-center justify-center bg-blue-300">
              <Tag color="#2693F5">{card.events.hight}</Tag>
              <span className="text-white">Hight</span>
            </div>
            <div className=" flex items-center justify-center bg-green-300">
              <Tag color="#7EE1FF">{card.events.medium}</Tag>
              <span className="text-white">Medium</span>
            </div>
            <div className=" flex items-center justify-center bg-yellow-300">
              <Tag color="#DCEEFD">
                {card.events.low.toLocaleString("en-US")}
              </Tag>
              <span className="text-white">Low</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Card;

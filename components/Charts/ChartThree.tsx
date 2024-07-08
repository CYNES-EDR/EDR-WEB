"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartThreeState {
  series: number[];
}

type ChartThreeProps = {
  data: number[];
  colors: string[];
  labels: string[];
};
const ChartThree: React.FC<ChartThreeProps> = ({ data, colors, labels }) => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors,
    labels,
    legend: {
      show: false,
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "30%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };
  return <ReactApexChart options={options} series={data} type="donut" />;
};

export default ChartThree;

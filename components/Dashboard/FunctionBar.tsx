import React, { ReactNode } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { TimeRangePickerProps } from "antd";
import { DatePicker } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Popover } from "antd";
const { RangePicker } = DatePicker;
const onRangeChange = (
  dates: null | (Dayjs | null)[],
  dateStrings: string[]
) => {
  if (dates) {
  } else {
    console.log("Clear");
  }
};

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];
const FunctionBar = () => {
  return (
    <div className=" justify-between flex  rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div>{/* <p>Organization Dashboard!</p> */}</div>
      <div className=" justify-end items-center flex w-2/3 md:w-2/4 xl:w-2/3 ">
        {/* Export dashboard to PDF */}
        <Popover
          content={() => {
            return <div>Export dashboard data!</div>;
          }}
        >
          <Button type="primary" icon={<DownloadOutlined />}>
            Export Dashboard
          </Button>
        </Popover>
        <div className="ml-2">
          <RangePicker
            presets={[
              {
                label: (
                  <span aria-label="Start Day to End of Day">SOD ~ EOD</span>
                ),
                value: () => [dayjs().startOf("day"), dayjs().endOf("day")], // 5.8.0+ support function
              },
              ...rangePresets,
            ]}
            defaultValue={[dayjs(), dayjs().endOf("day")]}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={onRangeChange}
          />
        </div>
        <div className="ml-2">
          <Popover
            content={() => {
              return <div>Reload</div>;
            }}
          >
            <ReloadOutlined style={{ fontSize: "16px", color: "#08c" }} />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FunctionBar;

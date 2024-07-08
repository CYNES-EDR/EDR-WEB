import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import type { SelectProps, TimeRangePickerProps } from "antd";
import SearchBar from "../SearchBar";
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Popover,
  Select,
  Space,
  Tag,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
const { RangePicker } = DatePicker;
function findKeysWithEmptyStringValue(obj: any) {
  const keysWithEmptyString = [];
  let keys = Object.keys(obj);
  const sample = ["field", "operator", "value"];
  const diffKey = sample.filter((item) => !keys.includes(item));
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === "") {
      keysWithEmptyString.push(key);
    }
  }
  return [...keysWithEmptyString, ...diffKey];
}

// <===== data suggestion for search box ======>
const filterOperator = [">", "<", ">=", "<=", "="];
const optionOperator: SelectProps["options"] = [];
filterOperator.forEach((item) => {
  optionOperator.push({
    value: item,
    label: item,
  });
});
//=============================================
const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs().endOf("d")] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs().endOf("d")] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs().endOf("d")] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs().endOf("d")] },
];
type FunctionBarProps = {
  setTimeRange?: React.Dispatch<React.SetStateAction<string[]>>;
  setSearch?: React.Dispatch<
    React.SetStateAction<{ field: string; operator: string; value: string }[]>
  >;
  search: { field: string; operator: string; value: string }[];
  storedValue: string[];
  setStoredValue?: React.Dispatch<React.SetStateAction<string[]>>;
  placeHolder?: string;
  filterKey?: string[];
  showSearchBar: boolean;
  showTimeRangePicker?: boolean;
};

const FunctionBar: React.FC<FunctionBarProps> = ({
  setTimeRange,
  setSearch, // getValue from Search bar to parent component
  storedValue,
  setStoredValue,
  showSearchBar,
  filterKey,
  placeHolder,
  showTimeRangePicker = true,
  search = [{ field: "string", operator: "string", value: "string" }],
}) => {
  //<============Notification api===========>
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (data: string) => {
    api["error"]({
      message: "Error",
      description: `${data} is empty`,
      placement: "bottomLeft",
    });
  };
  // <======Filter key========>
  let filterKeyData;
  if (filterKey) {
    filterKeyData = filterKey.map((item) => {
      return { value: item, label: item };
    });
  }
  // ==========================
  const [filterData, setFilterData] = useState<{
    field: string;
    operator: string;
    value: string;
  }>({} as { field: string; operator: string; value: string });
  const [open, setOpen] = useState(false);
  const handleFilter = () => {
    const fieldEmpty = findKeysWithEmptyStringValue(filterData);
    if (fieldEmpty.length > 0) {
      openNotificationWithIcon(fieldEmpty.toString());
    } else {
      if (filterData && search && setSearch) {
        setSearch([...search, filterData]);
      }
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  // <======= Datetime global and save to local_storage =========>
  const onRangeChange = (values: any, dateStrings: string[]) => {
    if (values) {
      if (setTimeRange) {
        setTimeRange([values[0].toISOString(), values[1].toISOString()]);
        if (setStoredValue) {
          setStoredValue([values[0].toISOString(), values[1].toISOString()]);
        }
      }
    } else {
      console.log("Clear");
    }
  };
  // ==========================================
  return (
    <div className=" function-bar justify-start flex  rounded-sm border border-stroke bg-white py-2 px-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      {contextHolder}
      <Drawer
        title="Filter"
        placement={"left"}
        width={800}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <Divider orientation="left" plain>
          Setting
        </Divider>
        <div className="flex ">
          <div className="flex flex-col w-1/3">
            <span> Field:</span>
            <Select
              showSearch
              onSelect={(value: string) =>
                setFilterData({ ...filterData, field: value })
              }
              size="large"
              placeholder={"Field"}
              options={filterKeyData || []}
            />
          </div>
          <div className="flex flex-col w-1/3">
            <span> Operator:</span>

            <Select
              showSearch
              onSelect={(value: string) =>
                setFilterData({ ...filterData, operator: value })
              }
              size="large"
              placeholder={"Operator"}
              options={optionOperator}
            />
          </div>
          <div className=" w-1/3 flex flex-col">
            <span> Value:</span>
            <Input
              style={{ marginTop: "5px" }}
              placeholder="Value"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterData({ ...filterData, value: e.target.value })
              }
            />
          </div>
        </div>
        <Button className="mt-2" type="primary" onClick={handleFilter}>
          Apply filter
        </Button>
        <Divider orientation="left" plain>
          Filter Value
        </Divider>
        {/* <==== Show Tag has filter when apply filter  */}
        {search.map((item, key) => {
          return (
            <Tag
              className="filter"
              key={key}
              onClick={() => {
                search.splice(key, 1); //remove element when click x
                if (setSearch) {
                  setSearch([...search]);
                }
              }}
              // closeIcon={<CloseCircleOutlined />}
              icon={<CloseCircleOutlined />}
            >
              {Object.values(item).toString().replaceAll(",", "")}
            </Tag>
          );
        })}

        {/* ===================================== */}
      </Drawer>
      <div className="flex  justify-start items-center w-2/3 md:w-2/3">
        {filterKey && (
          <Button
            className="mr-2"
            type="primary"
            icon={<FilterOutlined />}
            onClick={showDrawer}
          ></Button>
        )}

        {showSearchBar && (
          <SearchBar
            filterKey={filterKey || []}
            placeHolder={placeHolder || ""}
            searchFunction={setSearch}
          />
        )}
      </div>

      <div className=" justify-end items-center flex w-1/3 md:w-1/3  ">
        {/* Export dashboard to PDF */}
        <Popover
          content={() => {
            return <div>Export dashboard data!</div>;
          }}
        ></Popover>
        {showTimeRangePicker && (
          <div className="ml-2 event-range-padding">
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
              defaultValue={
                storedValue.length > 0
                  ? [dayjs(storedValue[0]), dayjs(storedValue[1])]
                  : [dayjs(), dayjs().endOf("day")]
              }
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={onRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionBar;

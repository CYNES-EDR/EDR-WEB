"use client";
import FunctionBar from "@/components/common/FunctionBar";
import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import StatisticAgents from "./StatisticCommand";
import dayjs from "dayjs";

import DataGrid from "./DataGrid";
const ListCommand = () => {
  const [storedValue, setStoredValue] = useLocalStorage("local-time", [
    dayjs().toISOString(),
    dayjs().endOf("day").toISOString(),
  ]);
  const defaultTimeRange =
    storedValue.length > 0
      ? [storedValue[0], storedValue[1]]
      : [dayjs().toISOString(), dayjs().endOf("day").toISOString()];
  const [timeRange, setTimeRange] = useState<string[]>(defaultTimeRange);
  const [search, setSearch] = useState<
    { field: string; operator: string; value: string }[]
  >([]);
  return (
    <>
      {/* <!-- ====== FunctionBar Section Start ====== --> */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FunctionBar
          showSearchBar={false}
          setStoredValue={setStoredValue}
          storedValue={storedValue}
          setTimeRange={setTimeRange}
          setSearch={setSearch}
          search={search}
          placeHolder="Search by query (mac='AA-DC-2F-4A-AD-F5')"
          filterKey={["command_type", "command_name"]}
          showTimeRangePicker={false}
        ></FunctionBar>
      </div>
      {/* <!-- ====== FunctionBar Section End ====== --> */}

      {/* <!-- ====== StatisticEvent Section Start ====== --> */}
      {/* <div className=" mt-1 w-full max-w-full rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <StatisticAgents></StatisticAgents>
      </div> */}

      {/* <!-- ====== Event Section End ====== --> */}
      {/* <!-- ====== DataGrid Section Start ====== --> */}

      <div className=" main-background  mt-1 w-full max-w-full rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <DataGrid timeRange={timeRange} search={search}></DataGrid>
      </div>
      {/* <!-- ====== DataGrid Section End ====== --> */}
    </>
  );
};

export default ListCommand;

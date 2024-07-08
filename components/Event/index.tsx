"use client";
import FunctionBar from "@/components/common/FunctionBar";
import StatisticEvent from "./StatisticEvent";
import DataGrid from "./DataGrid";
import { useState } from "react";
import dayjs from "dayjs";
import useLocalStorage from "@/hooks/useLocalStorage";
const Event = () => {
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
          showSearchBar
          setStoredValue={setStoredValue}
          storedValue={storedValue}
          setTimeRange={setTimeRange}
          setSearch={setSearch}
          search={search}
          placeHolder="Search by query (mac=AA-DC-2F-4A-AD-F5,ip=192.168.1.1)"
          filterKey={[
            "mac",
            "agent",
            "local_ip",
            "computer_name",
            "event_name",
            "event_type",
            "event_level",
            "event_description",
            "=",
            ">",
            "<",
            ">=",
            "<=",
          ]}
        ></FunctionBar>
      </div>
      {/* <!-- ====== FunctionBar Section End ====== --> */}

      {/* <!-- ====== StatisticEvent Section Start ====== --> */}
      <div className=" mt-1 w-full max-w-full rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <StatisticEvent timeRange={timeRange} search={search}></StatisticEvent>
      </div>

      {/* <!-- ====== Event Section End ====== --> */}
      {/* <!-- ====== DataGrid Section Start ====== --> */}

      <div className=" mt-1 w-full max-w-full rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <DataGrid timeRange={timeRange} search={search}></DataGrid>
      </div>
      {/* <!-- ====== DataGrid Section End ====== --> */}
    </>
  );
};

export default Event;

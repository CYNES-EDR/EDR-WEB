"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import dayjs from "dayjs";
import { useState } from "react";
import DataGrid from "./DataGrid";
const FileManager = () => {
  const [reloadGrid, setReloadGrid] = useState(false);
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
    <div className="file-page">
      <div className=" flex mt-1 rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <div className="w-full">
          <DataGrid
            reload={reloadGrid}
            setReload={setReloadGrid}
            timeRange={timeRange}
            typeSource="agent"
            search={search}
          ></DataGrid>
        </div>
        {/* <div className="w-1/4 p-4" style={{ background: "#1e2432" }}>
          <Upload reload={reloadGrid} setReload={setReloadGrid}></Upload>
        </div> */}
      </div>
      <div className=" flex mt-1 rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark shadow-default">
        <div className="w-full">
          <DataGrid
            showUPload={true}
            typeSource="user"
            reload={reloadGrid}
            setReload={setReloadGrid}
          ></DataGrid>
        </div>
      </div>
      {/* <!-- ====== DataGrid Section End ====== --> */}
    </div>
  );
};

export default FileManager;

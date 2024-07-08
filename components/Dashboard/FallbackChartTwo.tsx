import { Skeleton } from "antd";

export default function FallbackChartTwo() {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Statistic
          </h4>
        </div>
      </div>
      <Skeleton active></Skeleton>
    </div>
  );
}

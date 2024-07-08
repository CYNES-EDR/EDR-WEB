"use client";
import React, { useState } from "react";
import { FullscreenOutlined } from "@ant-design/icons";
import { Modal } from "antd";
const MapOne = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white pt-3 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 px-7 pb-2 text-xl font-semibold text-black dark:text-white">
        Theat Map{" "}
        <span className="live-tag blink bg-red text-white ">LIVE</span>
        {/* <FullscreenOutlined
          className="float-right"
          style={{ paddingTop: "5px" }}
          onClick={showModal}
        ></FullscreenOutlined> */}
      </h4>

      <div id="mapOne" className="mapOne map-btn h-90">
        <iframe
          className="h-full w-full relative top-0 left-0"
          src="https://livethreatmap.radware.com/"
          title="threat map"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapOne;

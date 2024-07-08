"use client";
import React, { useState, useEffect } from "react";
import { Upload, message, Spin } from "antd";
import API_URL from "@/helpers/api-url";
import { InboxOutlined } from "@ant-design/icons";
import LicenseStatusComponent from "./LicenseStatus";
interface LicenseStatus {
  msg: {
    credentials: string;
    expires: number;
    id_device: string;
  };
  status: boolean;
}
const { Dragger } = Upload;

const LicenseManagementPage: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(
    null
  );

  const handleUpload = async (file: any) => {
    setUploading(true);
    try {
      // Send the file to the server via API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_type", "license");
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data.error) {
        setLicenseStatus(data);
        message.success("License file uploaded successfully!");
      }
    } catch (error) {
      message.error("An error occurred while uploading the license file!");
    } finally {
      setUploading(false);
    }
  };
  useEffect(() => {
    const fetchLicenseStatus = async () => {
      try {
        const response = await fetch(API_URL.LICENSE.CHECK_LICENSE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data: LicenseStatus = await response.json();
        setLicenseStatus(data);
      } catch (error) {
        console.error("Error fetching license status:", error);
      }
    };

    fetchLicenseStatus();
  }, []);
  return (
    <div>
      <LicenseStatusComponent licenseStatus={licenseStatus} />
      <Dragger
        fileList={fileList}
        onChange={(info) => setFileList(info.fileList)}
        onRemove={(file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        }}
        beforeUpload={(file) => {
          handleUpload(file);
          return false; // Do not upload the file immediately
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Only one file can be uploaded at a time
        </p>
      </Dragger>
      {uploading && <Spin tip="Uploading file..." />}
    </div>
  );
};

export default LicenseManagementPage;

import React, { useState } from "react";
import { Upload, Button, message, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/lib/upload";

type FileUploadProps = {
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileUploadComponent: React.FC<FileUploadProps> = ({
  reload,
  setReload,
}) => {
  const [fileList, setFileList] = useState<UploadProps["fileList"]>([]);

  const handleChange = (info: UploadChangeParam) => {
    setReload(!reload);
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const uploadProps: UploadProps = {
    action: "/api/files/upload", // Replace with your upload endpoint
    onChange: handleChange,
    multiple: true,
    fileList,
  };

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Upload file</Button>
      </Upload>
    </div>
  );
};

export default FileUploadComponent;

import React from "react";
import { Card, Typography, Divider, Tag } from "antd";

const { Title, Text } = Typography;
interface LicenseStatus {
  msg: {
    credentials: string;
    expires: number;
    id_device: string;
  };
  status: boolean;
}
interface LicenseStatusProps {
  licenseStatus: LicenseStatus | null;
}

const LicenseStatus: React.FC<LicenseStatusProps> = ({ licenseStatus }) => {
  const renderLicenseDetails = () => {
    if (!licenseStatus || !licenseStatus.status) {
      return (
        <div>
          <Tag color="error">Invalid License</Tag>
        </div>
      );
    }

    const { msg } = licenseStatus;
    const expirationDate = new Date(msg.expires * 1000).toLocaleString();

    return (
      <>
        <Tag color="success">Valid License</Tag>
        <div>
          <Text className="text-white" strong>
            Credentials: {msg.credentials}
          </Text>{" "}
        </div>
        <div>
          <Text className="text-white" strong>
            Expiration Date: {expirationDate}
          </Text>{" "}
        </div>
        <div>
          <Text className="text-white" strong>
            ID Device: {msg.id_device}
          </Text>{" "}
        </div>
      </>
    );
  };

  return (
    <Card className="mt-2 mb-2" style={{ backgroundColor: "#1e1f24" }}>
      {renderLicenseDetails()}
    </Card>
  );
};

export default LicenseStatus;

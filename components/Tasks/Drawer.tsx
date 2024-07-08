import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReactJson from "react-json-view";
import { customAxiosGet } from "@/helpers/custom-axios";
import API_URL from "@/helpers/api-url";

interface ReceiveAgentsProps {
  receive_agents: { [key: string]: string };
}

const ReceiveAgentsTable: React.FC<ReceiveAgentsProps> = ({
  receive_agents,
}) => {
  const [globalSearch, setGlobalSearch] = useState("");
  const [filteredData, setFilteredData] = useState<
    { key: string; value: string }[]
  >([]);
  const [agentDetails, setAgentDetails] = useState<{ agent: any }>(
    {} as { agent: any }
  );

  useEffect(() => {
    const receiveAgentsData = Object.entries(receive_agents).map(
      ([key, value]) => ({
        key,
        value,
      })
    );
    setFilteredData(receiveAgentsData);
  }, [receive_agents]);

  const columns: ColumnsType<{ key: string; value: string }> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Computer Name",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record.key)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleViewDetails = async (id: string) => {
    try {
      const url = `${API_URL.AGENT.GET_AGENTS}/${id}`;
      const response: { agent: Object } = await customAxiosGet(url);
      setAgentDetails(response);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayData = useMemo(
    () =>
      filteredData
        .filter(
          (item) =>
            item.key.toLowerCase().includes(globalSearch.toLowerCase()) ||
            item.value.toLowerCase().includes(globalSearch.toLowerCase())
        )
        .slice(startIndex, endIndex),
    [filteredData, startIndex, endIndex, globalSearch]
  );

  return (
    <div className="p-4">
      <Input.Search
        placeholder="Search..."
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={displayData}
        rowKey="key"
        pagination={{
          position: ["bottomLeft"],
          current: currentPage,
          pageSize,
          total: filteredData.filter(
            (item) =>
              item.key.toLowerCase().includes(globalSearch.toLowerCase()) ||
              item.value.toLowerCase().includes(globalSearch.toLowerCase())
          ).length,
          showTotal: (total) => (
            <p className="text-white pl-4">
              Total:{" "}
              <span className="text-xl" style={{ color: "rgb(38, 147, 245)" }}>
                {total}
              </span>{" "}
              items
            </p>
          ),
          onChange: (page, newPageSize) => {
            setCurrentPage(page);
            if (newPageSize) {
              setPageSize(newPageSize);
            }
          },
        }}
      />

      {agentDetails && (
        <ReactJson
          displayDataTypes={false}
          name={
            agentDetails.agent?.computer_name
              ? agentDetails.agent?.computer_name
              : "data"
          }
          src={agentDetails.agent}
          theme="ocean"
        />
      )}
    </div>
  );
};

export default ReceiveAgentsTable;

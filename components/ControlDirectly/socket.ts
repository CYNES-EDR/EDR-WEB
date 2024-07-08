"use client";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
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
const socket = io("https://socket-edr.onrender.com/user", {
  extraHeaders: headers,
});
export { userName };
export default socket;

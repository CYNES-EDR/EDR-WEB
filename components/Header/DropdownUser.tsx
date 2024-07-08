"use client";
import { UserOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from "@/helpers/api-url";
const parseCookies = () => {
  return document.cookie.split(";").reduce((cookies: any, cookie) => {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    cookies[name] = value;
    return cookies;
  }, {});
};

const DropdownUser = () => {
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
  const cookies = parseCookies();
  let userName: { expires: number; id: string; username: string } = {
    expires: 0,
    id: "",
    username: "",
  };
  if (cookies.token) {
    userName = jwtDecode(cookies.token);
  }

  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const logout = async () => {
    showModal();
  };
  const signOut = async () => {
    localStorage.removeItem("local-time");
    try {
      await axios.get(API_URL.LOGOUT);
      router.push(API_URL.PAGES.LOGIN);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative ">
      <Modal
        className="log-out"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="156"
            height="156"
            viewBox="0 0 156 156"
            fill="none"
          >
            <g clip-path="url(#clip0_3388_11910)">
              <g clip-path="url(#clip1_3388_11910)">
                <g filter="url(#filter0_d_3388_11910)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M73.5329 119.043C101.19 109.935 116.228 80.1308 107.12 52.4732C103.866 42.5924 97.9701 34.3223 90.4747 28.1885C90.3598 28.1612 90.2447 28.1342 90.1294 28.1076C61.7579 21.5539 33.4454 39.2409 26.8918 67.6124C22.2292 87.7974 29.8362 107.952 44.8313 120.263C54.0162 122.459 63.9046 122.214 73.5329 119.043Z"
                    fill="url(#paint0_linear_3388_11910)"
                  />
                </g>
                <g filter="url(#filter1_b_3388_11910)">
                  <path
                    d="M129.634 91.3453C123.08 119.717 94.7679 137.404 66.3963 130.85C38.0247 124.297 20.3378 95.9841 26.8914 67.6125C33.445 39.2409 61.7575 21.554 90.1291 28.1076C118.501 34.6612 136.188 62.9737 129.634 91.3453Z"
                    fill="url(#paint1_linear_3388_11910)"
                  />
                </g>
                <g filter="url(#filter2_b_3388_11910)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M66.6214 129.876C94.4548 136.305 122.23 118.954 128.66 91.1202C135.089 63.2868 117.737 35.5113 89.904 29.082C62.0706 22.6526 34.2951 40.0041 27.8658 67.8376C21.4364 95.671 38.7879 123.446 66.6214 129.876ZM66.3963 130.85C94.7679 137.404 123.08 119.717 129.634 91.3453C136.188 62.9737 118.501 34.6612 90.1291 28.1076C61.7575 21.554 33.445 39.2409 26.8914 67.6125C20.3378 95.9841 38.0247 124.297 66.3963 130.85Z"
                    fill="url(#paint2_linear_3388_11910)"
                  />
                </g>
              </g>
              <g filter="url(#filter3_d_3388_11910)">
                <path
                  d="M102.867 86.9827C101.448 86.2937 99.7321 86.9023 99.0456 88.3264C97.1465 92.2885 94.1947 95.642 90.4993 98.0307C86.7124 100.477 82.3191 101.775 77.7886 101.775C64.7918 101.775 54.2204 91.163 54.2204 78.1168C54.2204 65.0705 64.7918 54.459 77.7886 54.459C82.3191 54.459 86.7124 55.7567 90.5108 58.1914C94.2062 60.5687 97.1579 63.9336 99.0571 67.8957C99.7435 69.3198 101.448 69.9284 102.878 69.2394C104.297 68.5503 104.903 66.8391 104.217 65.4036C101.86 60.4768 98.199 56.308 93.5998 53.3565C88.8862 50.3246 83.4174 48.7168 77.7886 48.7168C69.963 48.7168 62.6066 51.7716 57.0806 57.3301C51.5433 62.877 48.5 70.2615 48.5 78.1168C48.5 85.9721 51.5433 93.3566 57.0806 98.9035C62.618 104.462 69.963 107.517 77.7886 107.517C83.4174 107.517 88.8862 105.909 93.5998 102.866C98.1876 99.9027 101.86 95.7338 104.217 90.8185C104.892 89.383 104.297 87.6718 102.867 86.9827Z"
                  fill="url(#paint3_linear_3388_11910)"
                />
                <path
                  d="M79.3102 89.2911C79.8708 89.8538 80.603 90.1295 81.3352 90.1295C82.0674 90.1295 82.7997 89.8538 83.3603 89.2911L90.5565 82.0674C91.6091 81.0109 92.1811 79.6098 92.1811 78.1283C92.1811 76.6468 91.5977 75.2342 90.5565 74.1891L83.3603 66.9655C82.2391 65.84 80.4314 65.84 79.3102 66.9655C78.189 68.0909 78.189 69.9055 79.3102 71.0309L83.5319 75.2687H67.2744C65.6956 75.2687 64.4142 76.5549 64.4142 78.1398C64.4142 79.7246 65.6956 81.0109 67.2744 81.0109H83.5433L79.3216 85.2486C78.2004 86.3511 78.2004 88.1656 79.3102 89.2911Z"
                  fill="url(#paint4_linear_3388_11910)"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_d_3388_11910"
                x="-0.472656"
                y="0.743164"
                width="144.252"
                height="154.96"
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
                <feOffset dx="4" dy="4" />
                <feGaussianBlur stdDeviation="15" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.0980392 0 0 0 0 0.792157 0 0 0 0 1 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3388_11910"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3388_11910"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_b_3388_11910"
                x="9.52734"
                y="10.7432"
                width="137.471"
                height="137.472"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="8" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_3388_11910"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_3388_11910"
                  result="shape"
                />
              </filter>
              <filter
                id="filter2_b_3388_11910"
                x="9.52734"
                y="10.7432"
                width="137.471"
                height="137.472"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="8" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_3388_11910"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_3388_11910"
                  result="shape"
                />
              </filter>
              <filter
                id="filter3_d_3388_11910"
                x="30.5"
                y="30.7168"
                width="96"
                height="98.7998"
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
                <feOffset dx="2" dy="2" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.12549 0 0 0 0 0.482353 0 0 0 0 0.807843 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_3388_11910"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_3388_11910"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_3388_11910"
                x1="25.7349"
                y1="68.5532"
                x2="112.648"
                y2="73.9081"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#29333F" />
                <stop offset="0.558358" stop-color="#1392BA" />
                <stop offset="1" stop-color="#2A62A1" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_3388_11910"
                x1="90.1291"
                y1="28.1076"
                x2="66.3963"
                y2="130.85"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0.12" />
                <stop offset="1" stop-color="white" stop-opacity="0.16" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_3388_11910"
                x1="29.4417"
                y1="27.3627"
                x2="125.828"
                y2="115.099"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#80C2DE" />
                <stop offset="0.559846" stop-color="#445259" />
                <stop offset="0.862511" stop-color="#273539" />
                <stop offset="1" stop-color="#31B2DB" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_3388_11910"
                x1="100.5"
                y1="51.2168"
                x2="48.5"
                y2="107.717"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="#B1EDFF" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_3388_11910"
                x1="100.5"
                y1="51.2168"
                x2="48.5"
                y2="107.717"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="#B1EDFF" />
              </linearGradient>
              <clipPath id="clip0_3388_11910">
                <rect
                  width="155"
                  height="155"
                  fill="white"
                  transform="translate(0.5 0.716797)"
                />
              </clipPath>
              <clipPath id="clip1_3388_11910">
                <rect
                  width="145"
                  height="155"
                  fill="white"
                  transform="translate(-0.5 0.716797)"
                />
              </clipPath>
            </defs>
          </svg>
          <p className="text-white text-2xl">Do you want to sign out?</p>
          <div className="flex items-center w-full justify-center p-6 ">
            <div className="flex w-full justify-around items-center gap-3">
              <button
                onClick={handleCancel}
                style={{
                  background:
                    "linear-gradient(88deg, #2693F5 -12.53%, #19CAFF 100.28%)",
                }}
                className="bg-gray-300 text-white font-semibold py-4 px-6 rounded"
              >
                Cancel
              </button>
              <button
                onClick={signOut}
                style={{ border: "1px solid  #19CAFF" }}
                className="bg-red-500 text-white font-semibold py-4 px-6 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block uppercase text-sm font-medium text-black dark:text-white">
            {userName.username}
          </span>
        </span>

        <span className=" text-lg rounded-full">
          <UserOutlined />
        </span>
        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute dropdown-header right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                  fill=""
                />
                <path
                  d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                  fill=""
                />
              </svg>
              My Profile
            </Link>
          </li>
        </ul>
        <button
          onClick={logout}
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
              fill=""
            />
            <path
              d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
              fill=""
            />
          </svg>
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;

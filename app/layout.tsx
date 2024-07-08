"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import { usePathname } from "next/navigation";
import API_URL from "@/helpers/api-url";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader =
    pathname === API_URL.PAGES.LOGIN || pathname === API_URL.PAGES.SIGNUP
      ? false
      : true; //hide header in Login page
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) : (
            <div className="flex h-screen overflow-hidden">
              {/* <!-- ===== Sidebar Start ===== --> */}

              {showHeader && (
                <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
              )}

              {/* <!-- ===== Sidebar End ===== --> */}

              {/* <!-- ===== Content Area Start ===== --> */}
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}

                {showHeader && (
                  <Header sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
                )}

                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main className={`${!showHeader && "overflow-hidden"}`}>
                  <div
                    className={`mx-auto ${showHeader && "p-4 md:p-6 2xl:p-5"}`}
                  >
                    <StyledComponentsRegistry>
                      {children}
                    </StyledComponentsRegistry>
                  </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
              </div>
              {/* <!-- ===== Content Area End ===== --> */}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}

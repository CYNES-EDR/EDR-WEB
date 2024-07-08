"use client";
import Link from "next/link";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
interface BreadcrumbProps {
  pageName?: string;
}

const BreadcrumbCustom = ({ pageName }: BreadcrumbProps) => {
  {
    /* <!-- Get url path with useRouter --> */
  }

  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  console.log(paths);
  const breadcrumbList = pathNames.map((segment, index) => {
    const url = `/${pathNames.slice(0, index + 1).join("/")}`;
    return {
      title: (
        <Link className="capitalize" href={url}>
          <p className="capitalize text-4xl  text-white">{segment}</p>
        </Link>
      ),
    };
  });
  if (paths === "/") {
    return (
      <div className="  font-bold flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <Link
                  className="capitalize text-4xl  text-white"
                  href="/"
                  style={{ color: "white" }}
                >
                  Dashboard
                </Link>
              ),
            },
          ]}
        />
      </div>
    );
  } else {
    return (
      <div className=" text-4xl text-white  font-bold flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb separator=">" items={[...breadcrumbList]} />
      </div>
    );
  }
};

export default BreadcrumbCustom;

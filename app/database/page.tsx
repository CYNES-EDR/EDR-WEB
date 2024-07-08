import Event from "@/components/Database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database Page",
  description: "This is Database page",
  // other metadata
};

const DatabasePage = () => {
  return (
    <>
      <Event />
    </>
  );
};

export default DatabasePage;

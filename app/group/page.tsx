import Group from "@/components/Group";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group",
  description: "This is Database page",
  // other metadata
};

const DatabasePage = () => {
  return (
    <>
      <Group />
    </>
  );
};

export default DatabasePage;

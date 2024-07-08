import ListCommand from "@/components/ListCommand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "List commands",
  description: "This is Tables page for TailAdmin Next.js",
  // other metadata
};

const TablesPage = () => {
  return <ListCommand></ListCommand>;
};

export default TablesPage;

import FileManager from "@/components/File";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Page",
  description: "This is Calendar page for TailAdmin Next.js",
  // other metadata
};

const File = () => {
  return (
    <>
      <FileManager />
    </>
  );
};

export default File;

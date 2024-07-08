import Alert from "@/components/Alert";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alert Page",
  description: "This is Calendar page for TailAdmin Next.js",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Alert />
    </>
  );
};

export default CalendarPage;

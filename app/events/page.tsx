import Event from "@/components/Event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Page",
  description: "This is Calendar page for TailAdmin Next.js",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Event />
    </>
  );
};

export default CalendarPage;

import Tasks from "@/components/Tasks";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tasks",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const TasksPage = () => {
  return <Tasks></Tasks>;
};

export default TasksPage;

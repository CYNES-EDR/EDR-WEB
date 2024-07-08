import Agent from "@/components/Agents";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Agent",
  description: "This is Profile page for TailAdmin Next.js",
  // other metadata
};

const Agents = () => {
  return <Agent></Agent>;
};

export default Agents;

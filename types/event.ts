export type EVENT = {
  id: string;
  parent_event_id: string;
  agent_id: string;
  computer_name: string;
  local_ip: string;
  mac: string;
  event_type: string;
  event_name: string;
  event_description: string;
  event_info: object;
  event_level: number;
  artifact_name: string;
  mitre_tactic: string;
  mitre_technique: string;
  receive_time: string;
  created_at: string;
};

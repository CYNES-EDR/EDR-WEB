export type ALERT = {
  id: string;
  agent_id: string;
  computer_name: string;
  local_ip: string;
  mac: string;
  alert_type: string;
  alert_name: string;
  alert_description: string;
  alert_info: object;
  alert_level: number;
  artifact_name: string;
  receive_time: string;
  created_at: string;
};

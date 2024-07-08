export type COMMAND = {
  id: string;
  command_name: string;
  command_type: string;
  command_info: CommandInfo;
  is_show: boolean;
  update_at: string;
  created_at: string;
};

export interface CommandInfo {
  local_file: string;
  upload_link: string;
  zip_pass: string;
}

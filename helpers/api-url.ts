let BACK_END_URL = process.env.BACK_END_URL;
const API_URL = {
  LOGIN: "/api/users/login",
  LOGOUT: "/api/users/logout",
  PAGES: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/",
    AGENT: "/agents",
  },
  FILES: {
    GET_FILES: "/api/files",
  },
  AGENT: {
    GET_AGENTS: "/api/agents",
    COUNT_AGENTS: "/api/agents/statistic_agents",
    REMOTE_AGENT: "/api/agents/remote",
    COUNT_OS: "/api/agents/count-os",
  },
  EVENTS: {
    GET_EVENTS: "/api/events",
    COUNT_EVENTS: "/api/events/statistic_events",
    COUNT_EVENTS_BY_DATE: "/api/events/count_event",
  },
  ALERTS: {
    GET_ALERTS: "/api/alerts",
    COUNT_ALERTS: "/api/alerts/statistic_alerts",
  },
  GROUPS: {
    GET_GROUPS: "/api/groups",
    ADD_GROUP: "/api/groups/add",
    UPDATE_GROUP: "/api/groups/update",
    DELETE_GROUP: "/api/groups/delete",
  },
  TASKS: {
    GET_TASKS: "/api/tasks",
    ADD_TASK: "/api/tasks/add",
    UPDATE_TASK: "/api/tasks/update",
    DELETE_TASK: "/api/tasks/delete",
    COUNT_TASKS: "/api/tasks/statistic_tasks",
  },
  COMMANDS: {
    GET_COMMANDS: "/api/commands",
    ADD_COMMAND: "/api/commands/add",
    UPDATE_COMMAND: "/api/commands/update",
    DELETE_COMMAND: "/api/commands/delete",
  },
  DATABASE: {
    GET_DATABASE: "/api/database",
    ADD_DATABASE: "/api/database/add",
    UPDATE_DATABASE: "/api/database/update",
    DELETE_DATABASE: "/api/database/delete",
  },
  DASHBOARD: {
    GET_ALERT_CHART_DAYS: "/api/dashboard/alert_chart_days",
  },
  USER: {
    GET_USERS: "/api/users/list",
    SIGN_UP: "/api/users/signup",
    DELETE_USER: "/api/users/delete",
  },
  LICENSE: {
    CHECK_LICENSE: "/api/license/",
  },
};

export const API_BACKEND = {
  USER: {
    LOGIN: BACK_END_URL + "/api/v1/user/signin",
    GET_USERS: BACK_END_URL + "/api/v1/user",
    SIGN_UP: BACK_END_URL + "/api/v1/user/signup",
  },
  AGENT: {
    GET_DETAIL_AGENT: BACK_END_URL + "/api/v1/agent",
    GET_AGENTS: BACK_END_URL + "/api/v1/agent/list",
    DELETE_AGENT: BACK_END_URL + "/api/v1/agent",
    COUNT_AGENTS: BACK_END_URL + "/api/v1/agent/count",
    REMOTE_AGENT: BACK_END_URL + "/api/v1/agent/remote",
  },
  EVENTS: {
    GET_EVENTS: BACK_END_URL + "/api/v1/event/list",
    COUNT_EVENTS: BACK_END_URL + "/api/v1/event/count",
  },
  ALERTS: {
    GET_ALERTS: BACK_END_URL + "/api/v1/alert/list",
    COUNT_ALERTS: BACK_END_URL + "/api/v1/alert/count",
  },
  GROUP: {
    GET_GROUPS: BACK_END_URL + "/api/v1/group/list",
    ADD_GROUP: BACK_END_URL + "/api/v1/group",
  },
  TASK: {
    GET_TASKS: BACK_END_URL + "/api/v1/task/list",
    ADD_TASK: BACK_END_URL + "/api/v1/task",
  },
  COMMAND: {
    GET_COMMAND: BACK_END_URL + "/api/v1/command/list",
    ADD_COMMAND: BACK_END_URL + "/api/v1/command",
  },
  DATABASE: {
    GET_DATABASE: BACK_END_URL + "/api/v1/db/list",
    ADD_DATABASE: BACK_END_URL + "/api/v1/db",
  },
  DASHBOARD: {
    GET_DASHBOARD: BACK_END_URL + "/api/v1/dashboard",
    GET_ALERT_COUNT: BACK_END_URL + "/api/v1/alert/count",
    GET_AGENT_COUNT: BACK_END_URL + "/api/v1/agent/count",
  },
  FILES: {
    GET_FILES: BACK_END_URL + "/api/v1/file/show",
    DOWNLOAD_FILE: BACK_END_URL + "/api/v1/file/download",
    DELETE_FILE: BACK_END_URL + "/api/v1/file",
    UPLOAD_FILE: BACK_END_URL + "/api/v1/file/upload",
  },
  LICENSE: {
    CHECK_LICENSE: BACK_END_URL + "/api/v1/license/check",
  },
};
export default API_URL;

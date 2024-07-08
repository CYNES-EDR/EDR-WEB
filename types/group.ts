export  type GROUP= {
    id: string;
    group_name: string;
    group_filter: GROUP_FILTER[];
    update_at: string;
    created_at: string;
  }
  
  export interface GROUP_FILTER {
    field: string
    operator: string
    value: string
  }
  
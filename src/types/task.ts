
export interface Task {
  id?: string;

  client: string;

  title: string;

  phone: string;

  priority: string;

  deadline: string;

  responsible: string;

  description: string;

  lawsuitId: string | undefined;

  status?: string;

  lawsuitClient?: string | undefined;

  lawsuitOrderType?: string | undefined;
}

export interface Email {
  emailId: number;
  nome: string;
  email: string;
}

export interface Cliente {
  clienteId: number;
  nome: string;
  emails: Email[];
}
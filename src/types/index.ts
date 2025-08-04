export interface FormData {
  employeeName: string;
  employeeId: string;
  expenseDescription: string;
  amount: string;
  businessPurpose: string;
  clientName: string;
  notes: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  ssn: string;
}

export interface ApprovalParams {
  employee?: string;
  id?: string;
  token?: string;
}

export interface LogEntry {
  type: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  redirectUrl?: string;
}
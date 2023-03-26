export interface MoneyTransactionDocType {
    amount: number;
    date: string;
    description: string;
    id: string;
    tags: Array<string>;
    reverted: boolean;
}

export interface BudgetDocType {
    title: string;
    amount: number;
    progression: number;
    creationDate: string;
    expirationDate: string;
    budgetType: "recurrent" | "one-time";
    description: string;
    id: string;
    tags: Array<string>;
}

export interface GoalDocType {
    title: string;
    targetAmount: number;
    progression: number;
    creationDate: string;
    expirationDate: string | null;
    description: string;
    id: string;
    tags: Array<string>;
}

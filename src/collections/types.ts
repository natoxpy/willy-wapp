export interface MoneyTransactionDocType {
    amount: number;
    date: string;
    description: string;
    id: string;
    tags: Array<string>;
    reverted: boolean;
}

export interface TransactionDocType {
    amount: number;
    createdAt: string;
    description: string;
    title: string;
    id: string;
    tags: Array<string>;
    reverted: boolean;
    type: "budget" | "goal";
    targetId: string; // could be a budget or a goal, depends on the type.
}

export interface BudgetDocType {
    title: string;
    amount: number;
    progression: number;
    creationDate: string;
    expirationDate: string;
    budgetType: "recurrent" | "one-time";
    budgetRecurrence?: "day" | "week" | "month";
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
    completionDate: null;
    dropped: boolean | null;
}

import { Timestamp } from "firebase/firestore";

export interface UserDocument {
    name: string;
    uid: string;
    walletMoney: number;
}

export interface MoneyTransaction {
    creationDate: Timestamp;

    userUid: string;
    amount: number;
    date: Timestamp;
    tags: Array<string>;

    uid: string;
}

export interface Budget {
    creationDate: Timestamp;

    userUid: string;
    amount: number;
    usedAmount: number;

    tags: Array<string>;

    title: string;

    type: "limitedTime" | "recurrent";
    recurrentType: "daily" | "weekly" | "monthly" | null;
    recurrencyStartDate: Timestamp | null;
    nextRecurrencyReset: Timestamp | null;
    time_limit: Timestamp | null;

    uid: string;
}

export interface Goal {
    creationDate: Timestamp;

    userUid: string;
    amount: number;
    filledAmount: number;

    tags: Array<string>;

    title: string;

    timeLimit: Timestamp;

    uid: string;
}

export interface Transaction {
    creationDate: Timestamp;

    uid: string;

    userUid: string;
    amount: number;
    tags: Array<string>;

    title: string;
    targetId: string;

    targetType: "budget" | "goal";
}

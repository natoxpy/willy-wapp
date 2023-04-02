export interface UserDocument {
    name: string;
    uid: string;
    wallet_money: number;
}

export interface MoneyTransaction {
    user_uid: string;
    amount: number;
    date: Date;
    tags: Array<string>;
}

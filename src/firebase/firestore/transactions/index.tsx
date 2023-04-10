import { useAuthUser } from "@/firebase/auth/authUser";
import { db } from "@/firebase/firebase.config";
import { uuid } from "@/utils";
import {
    addDoc,
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Transaction } from "../types";

interface TransactionsContextType {
    transactions: Transaction[];
    transactionsLoaded: boolean | null;
    addTransaction: (
        transaction: Omit<Transaction, "uid" | "userUid" | "creationDate">
    ) => void;
}

const TransactionsContext = createContext<TransactionsContextType>({
    transactions: [],
    transactionsLoaded: null,
    addTransaction: () => {},
});

export const useTransactions = () => useContext(TransactionsContext);

export function TransactionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loggedin } = useAuthUser();
    const [queried, setQueried] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoaded, setTransactionsLoaded] = useState<
        boolean | null
    >(null);

    const transactionsCol = collection(db, "transactions");

    useEffect(() => {
        if (queried) return;
        if (!loggedin) return;

        setQueried(true);
        getDocs(
            query(transactionsCol, where("user_uid", "==", user?.uid))
        ).then((snap) => {
            setTransactions([]);

            snap.docs.forEach((doc) => {
                let data = doc.data() as Transaction;
                setTransactions((prev) => [...prev, data]);
            });

            setTransactionsLoaded(true);
        });
    }, [loggedin, queried, user?.uid, transactionsCol]);

    const contextData: TransactionsContextType = {
        transactions: transactions,
        transactionsLoaded: transactionsLoaded,
        addTransaction: async (transaction) => {
            const transactionComplete: Transaction = {
                creationDate: Timestamp.fromDate(new Date()),
                uid: uuid(),
                userUid: user?.uid ?? "NO UID",
                ...transaction,
            };

            setTransactions([transactionComplete, ...transactions]);

            await addDoc(transactionsCol, {
                ...transactionComplete,
                user_uid: user?.uid,
            });
        },
    };

    return (
        <TransactionsContext.Provider value={contextData}>
            {children}
        </TransactionsContext.Provider>
    );
}

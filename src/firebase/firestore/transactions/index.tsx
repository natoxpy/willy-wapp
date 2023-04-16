import { useAuthUser } from "@/firebase/auth/authUser";
import { db } from "@/firebase/firebase.config";
import { uuid } from "@/utils";
import {
    addDoc,
    collection,
    deleteDoc,
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
    findById: (uid: string) => Transaction | undefined;
    deleteTransaction: (uid: string) => void;
    clear: () => void;
}

const TransactionsContext = createContext<TransactionsContextType>({
    transactions: [],
    transactionsLoaded: null,
    addTransaction: () => {},
    findById: () => undefined,
    deleteTransaction: () => {},
    clear: () => {},
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

        console.log("loading transactions...");

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
    }, [loggedin, queried, user?.uid, transactionsCol, user]);

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
        findById: (uid) => transactions.find((t) => t.uid === uid),
        deleteTransaction: async (uid) => {
            const q = query(transactionsCol, where("uid", "==", uid));
            const snap = await getDocs(q);
            if (snap.empty) return;
            let doc = snap.docs[0];

            setTransactions((prev) => prev.filter((b) => b.uid !== uid));

            await deleteDoc(doc.ref);
        },
        clear: () => {
            setTransactions([]);
            setTransactionsLoaded(null);
            setQueried(false);
        },
    };

    return (
        <TransactionsContext.Provider value={contextData}>
            {children}
        </TransactionsContext.Provider>
    );
}

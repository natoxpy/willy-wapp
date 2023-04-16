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
import { MoneyTransaction } from "../types";

interface MoneyTransactionsContextType {
    moneyTransactions: MoneyTransaction[];
    moneyTransactionsLoaded: boolean | null;
    addMoneyTransaction: (
        moneyTransaction: Omit<MoneyTransaction, "creationDate" | "uid">
    ) => void;
    clear: () => void;
}

const MoneyTransactionsContext = createContext<MoneyTransactionsContextType>({
    moneyTransactions: [],
    moneyTransactionsLoaded: null,
    addMoneyTransaction: () => {},
    clear: () => {},
});

export const useMoneyTransactions = () => useContext(MoneyTransactionsContext);

export function MoneyTransactionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loggedin } = useAuthUser();
    const [queried, setQueried] = useState<boolean>(false);
    const [moneyTransactions, setMoneyTransactions] = useState<
        MoneyTransaction[]
    >([]);
    const [moneyTransactionsLoaded, setMoneyTransactionsLoaded] = useState<
        boolean | null
    >(null);

    const moneyTransactionsCol = collection(db, "money_transactions");

    // getDocs(query(users, where("uid", "==", user?.uid))).then((snap)
    useEffect(() => {
        if (queried) return;
        if (!loggedin) return;

        console.log("loading money transactions...");

        setQueried(true);
        getDocs(
            query(moneyTransactionsCol, where("userUid", "==", user?.uid))
        ).then((snap) => {
            setMoneyTransactions([]);

            snap.docs.forEach((doc) => {
                let data = doc.data() as MoneyTransaction;
                setMoneyTransactions((prev) => [...prev, data]);
            });

            setMoneyTransactionsLoaded(true);
        });
    }, [loggedin, queried, user?.uid, moneyTransactionsCol, user]);

    const contextData: MoneyTransactionsContextType = {
        moneyTransactions: moneyTransactions,
        moneyTransactionsLoaded: moneyTransactionsLoaded,
        addMoneyTransaction: async (moneyTransaction) => {
            const creationDate = Timestamp.fromDate(new Date());
            const uid = uuid();

            setMoneyTransactions([
                {
                    creationDate: creationDate,
                    uid,
                    ...moneyTransaction,
                },
                ...moneyTransactions,
            ]);

            await addDoc(moneyTransactionsCol, {
                creationDate: creationDate,
                uid,
                ...moneyTransaction,
                user_uid: user?.uid,
            });
        },
        clear: () => {
            setMoneyTransactions([]);
            setMoneyTransactionsLoaded(null);
            setQueried(false);
        },
    };

    return (
        <MoneyTransactionsContext.Provider value={contextData}>
            {children}
        </MoneyTransactionsContext.Provider>
    );
}

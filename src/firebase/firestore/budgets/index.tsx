import { useAuthUser } from "@/firebase/auth/authUser";
import { db } from "@/firebase/firebase.config";
import { uuid } from "@/utils";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Budget } from "../types";

interface BudgetsContextType {
    budgets: Budget[];
    budgetsLoading: boolean | null;
    addBudget: (
        budget: Omit<Budget, "creationDate" | "userUid" | "uid" | "usedAmount">
    ) => void;
    findById: (uid: string) => Budget | undefined;
    updateBudget: (budget: Budget) => void;
}

const BudgetsContext = createContext<BudgetsContextType>({
    budgets: [],
    budgetsLoading: null,
    addBudget: () => {},
    findById: () => undefined,
    updateBudget: () => {},
});

export const useBudgets = () => useContext(BudgetsContext);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
    const { user, loggedin } = useAuthUser();
    const [queried, setQueried] = useState<boolean>(false);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [budgetsLoaded, setBudgetsLoaded] = useState<boolean | null>(null);

    const budgetsCol = collection(db, "budgets");

    useEffect(() => {
        if (queried) return;
        if (!loggedin) return;

        setQueried(true);
        getDocs(query(budgetsCol, where("userUid", "==", user?.uid))).then(
            (snap) => {
                setBudgets([]);

                snap.docs.forEach((doc) => {
                    let data = doc.data() as Budget;
                    setBudgets((prev) => [...prev, data]);
                });

                setBudgetsLoaded(true);
            }
        );
    }, [loggedin, queried, user?.uid, budgetsCol]);

    const contextData: BudgetsContextType = {
        budgets: budgets,
        budgetsLoading: budgetsLoaded,
        findById: (uid) => budgets.find((b) => b.uid === uid),
        updateBudget: async (budget) => {
            const q = query(budgetsCol, where("uid", "==", budget.uid));
            const snap = await getDocs(q);
            if (snap.empty) return;
            let doc = snap.docs[0];

            setBudgets((prev) => {
                const index = prev.findIndex((b) => b.uid === budget.uid);
                if (index === -1) return prev;
                const newBudgets = [...prev];
                newBudgets[index] = budget;
                return newBudgets;
            });

            await setDoc(doc.ref, budget);
        },

        addBudget: async (budget) => {
            const uid = uuid();

            const budgetComplete = {
                creationDate: Timestamp.fromDate(new Date()),
                userUid: user?.uid ?? "No user UID",
                uid,
                usedAmount: 0,
                ...budget,
            };

            setBudgets([budgetComplete, ...budgets]);

            await addDoc(budgetsCol, budgetComplete);
        },
    };

    return (
        <BudgetsContext.Provider value={contextData}>
            {children}
        </BudgetsContext.Provider>
    );
}

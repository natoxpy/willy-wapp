import { useAuthUser } from "@/firebase/auth/authUser";
import { db } from "@/firebase/firebase.config";
import { uuid } from "@/utils";
import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Goal } from "../types";

interface GoalsContextType {
    goals: Goal[];
    goalsLoading: boolean | null;
    addGoal: (
        goal: Omit<Goal, "creationDate" | "userUid" | "uid" | "filledAmount">
    ) => void;
    findById: (uid: string) => Goal | undefined;
    deleteGoal: (uid: string) => void;
    updateGoal: (budget: Goal) => void;
    clear: () => void;
}

const GoalsContext = createContext<GoalsContextType>({
    goals: [],
    goalsLoading: null,
    addGoal: () => {},
    findById: () => undefined,
    deleteGoal: () => {},
    updateGoal: () => {},
    clear: () => {},
});

export const useGoals = () => useContext(GoalsContext);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
    const { user, loggedin } = useAuthUser();
    const [queried, setQueried] = useState<boolean>(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [goalsLoaded, setGoalsLoaded] = useState<boolean | null>(null);

    const goalsCol = collection(db, "goals");

    useEffect(() => {
        if (queried) return;
        if (!loggedin) return;

        setQueried(true);
        getDocs(query(goalsCol, where("userUid", "==", user?.uid))).then(
            (snap) => {
                setGoals([]);

                snap.docs.forEach((doc) => {
                    let data = doc.data() as Goal;
                    setGoals((prev) => [...prev, data]);
                });

                setGoalsLoaded(true);
            }
        );
    }, [loggedin, queried, user?.uid, goalsCol, user]);

    const contextData: GoalsContextType = {
        goals: goals,
        goalsLoading: goalsLoaded,
        findById: (uid) => goals.find((g) => g.uid === uid),
        deleteGoal: async (uid) => {
            const q = query(goalsCol, where("uid", "==", uid));
            const snap = await getDocs(q);
            if (snap.empty) return;
            let doc = snap.docs[0];

            setGoals((prev) => prev.filter((g) => g.uid !== uid));

            await deleteDoc(doc.ref);
        },
        updateGoal: async (goal) => {
            const q = query(goalsCol, where("uid", "==", goal.uid));
            const snap = await getDocs(q);
            if (snap.empty) return;
            let doc = snap.docs[0];

            setGoals((prev) => {
                const index = prev.findIndex((b) => b.uid === goal.uid);
                if (index === -1) return prev;
                const newGoals = [...prev];
                newGoals[index] = goal;
                return newGoals;
            });

            await setDoc(doc.ref, goal);
        },
        addGoal: async (goal) => {
            const uid = uuid();
            const goalComplete = {
                creationDate: Timestamp.fromDate(new Date()),
                userUid: user?.uid ?? "No user UID",
                uid,
                filledAmount: 0,
                ...goal,
            };

            setGoals((prev) => [goalComplete, ...prev]);

            await addDoc(goalsCol, goalComplete);
        },
        clear: () => {
            setGoals([]);
            setGoalsLoaded(null);
            setQueried(false);
        },
    };

    return (
        <GoalsContext.Provider value={contextData}>
            {children}
        </GoalsContext.Provider>
    );
}

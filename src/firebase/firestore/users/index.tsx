import { useAuthUser } from "@/firebase/auth/authUser";
import { createContext, useContext, useEffect, useState } from "react";
import { UserDocument } from "../types";
import { db } from "@/firebase/firebase.config";
import {
    collection,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

interface ContextProps {
    userDoc: UserDocument | null;
    userDocLoaded: boolean | null;
    increaseMoney: (amount: number) => void;
}

const Context = createContext<ContextProps>({
    userDoc: null,
    userDocLoaded: null,
    increaseMoney: () => {},
});

export const useUserFireStore = () => useContext(Context);

export function UsersFireStoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { loggedin, user } = useAuthUser();
    const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
    const [userDocLoaded, setUserDocLoaded] = useState<null | boolean>(null);

    useEffect(() => {
        setUserDocLoaded(false);

        if (!loggedin) return;
        const users = collection(db, "users");

        getDocs(query(users, where("uid", "==", user?.uid))).then((snap) =>
            snap.docs.forEach((doc) => {
                setUserDoc(doc.data() as UserDocument);
                setUserDocLoaded(true);
            })
        );
    }, [loggedin, user]);

    let increaseMoney = (money: number) => {
        if (!loggedin) return;
        const users = collection(db, "users");

        getDocs(query(users, where("uid", "==", user?.uid))).then((snap) =>
            snap.docs.forEach((doc) => {
                let data = doc.data() as UserDocument;

                updateDoc(doc.ref, {
                    wallet_money: data.wallet_money + money,
                });

                setUserDoc({
                    ...data,
                    wallet_money: data.wallet_money + money,
                });
            })
        );
    };

    let contextData: ContextProps = {
        userDoc: userDoc,
        userDocLoaded: userDocLoaded,
        increaseMoney: increaseMoney,
    };

    return <Context.Provider value={contextData}>{children}</Context.Provider>;
}

import { useAuthUser } from "@/firebase/auth/authUser";
import { createContext, useContext, useEffect, useState } from "react";
import { UserDocument } from "../types";
import { db } from "@/firebase/firebase.config";
import {
    addDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

interface ContextProps {
    userDoc: UserDocument | null;
    userDocLoaded: boolean | null;
    increaseMoney: (amount: number) => void;
    changeName: (name: string) => void;
    createNewUser: (name: string, uid: string) => void;
}

const Context = createContext<ContextProps>({
    userDoc: null,
    userDocLoaded: null,
    increaseMoney: () => {},
    changeName: () => {},
    createNewUser: () => {},
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

        console.log("loading user...");

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

                const newWalletMoney = Number(data.walletMoney) + Number(money);

                updateDoc(doc.ref, {
                    walletMoney: newWalletMoney,
                });

                setUserDoc({
                    ...data,
                    walletMoney: newWalletMoney,
                });
            })
        );
    };

    let changeName = (name: string) => {
        if (!loggedin) return;
        const users = collection(db, "users");

        getDocs(query(users, where("uid", "==", user?.uid))).then((snap) =>
            snap.docs.forEach((doc) => {
                let data = doc.data() as UserDocument;

                updateDoc(doc.ref, {
                    name: name,
                });

                setUserDoc({
                    ...data,
                    name: name,
                });
            })
        );
    };

    let createNewUser = async (name: string, uid: string) => {
        const users = collection(db, "users");

        await addDoc(users, {
            name: name,
            uid,
            walletMoney: 0,
        });
    };

    let contextData: ContextProps = {
        userDoc: userDoc,
        userDocLoaded: userDocLoaded,
        increaseMoney: increaseMoney,
        changeName: changeName,
        createNewUser: createNewUser,
    };

    return <Context.Provider value={contextData}>{children}</Context.Provider>;
}

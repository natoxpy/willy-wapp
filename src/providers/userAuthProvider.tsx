import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
} from "react";
import { signInWithEmailAndPassword, AuthError, User } from "firebase/auth";
import { auth, db } from "../firebase.config";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import { collection, getDocs, query, setDoc, where } from "firebase/firestore";

interface UserAuthContextProps {
    user: User | null;
    error: AuthError | null;
    loggedin: boolean | null;
}

const UserAuthContext = createContext<UserAuthContextProps>({
    user: null,
    error: null,
    loggedin: null,
});

export const useUser = () => useContext(UserAuthContext);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<AuthError | null>(null);
    const [loggedin, setLoggedin] = useState<boolean | null>(null);

    const { toggleColorScheme, colorScheme } = useMantineColorScheme();
    const users = collection(db, "users");

    useEffect(() => {
        if (!user) return;
        getDocs(query(users, where("uid", "==", user.uid))).then((snap) =>
            snap.docs.forEach((doc) => {
                if (colorScheme == undefined) {
                    toggleColorScheme();
                    if (colorScheme != doc.data()["color_theme"])
                        toggleColorScheme();
                } else if (doc.data()["color_theme"] != colorScheme)
                    setDoc(
                        doc.ref,
                        { color_theme: colorScheme },
                        { merge: true }
                    );
            })
        );
    }, [colorScheme, user, users, toggleColorScheme]);

    useEffect(() => {
        // Check if the user is already signed in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setLoggedin(true);
                setUser(user);
            } else {
                setLoggedin(false);
            }
        });

        return () => {
            unsubscribe();
        };
    });

    return (
        <UserAuthContext.Provider value={{ user, error, loggedin }}>
            {children}
        </UserAuthContext.Provider>
    );
};

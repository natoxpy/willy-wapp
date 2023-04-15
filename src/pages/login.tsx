import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Container,
    Group,
    Button,
    Image,
    Center,
    Tabs,
    LoadingOverlay,
    Box,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import passwordValitator from "password-validator";
import emailValitator from "email-validator";
import { useRouter } from "next/router";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
// import { auth } from "@/firebase.config";
// import { useUser } from "@/providers/userAuthProvider";
import { auth } from "@/firebase/firebase.config";

import { serialize } from "cookie";
import { useTheme } from "@/themes";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { CText } from "@/CustomComponents/CText";
import { ConfirmButton } from "@/CustomComponents/buttons/ConfirmButton";
import { ActionButton } from "@/drySystems/ActionButton";

const passwordSchema = new passwordValitator()
    .has()
    .lowercase()
    .has()
    .is()
    .min(6)
    .not()
    .spaces();

function attempLogin(
    email: string,
    password: string,
    setEmailErr: (a: string | boolean) => void,
    setPasswordErr: (a: string | boolean) => void,
    failedLogin: () => void,
    goHome: () => void
) {
    let err = false;
    if (!emailValitator.validate(email)) {
        setEmailErr("Email not valid!");
        err = true;
    }

    let passVal = passwordSchema.validate(password, {
        details: true,
    }) as any;
    if (passVal.length != 0) {
        setPasswordErr(passVal[0]["message"]);
        err = true;
    }

    if (err) return failedLogin();

    signInWithEmailAndPassword(auth, email, password)
        .then((creds) => {
            goHome();
        })
        .catch(() => {
            setEmailErr("Incorrect email");
            setPasswordErr("Incorrect password");
            failedLogin();
        });
}

function LoginTab(goHome: () => void) {
    const [loading, setLoading] = useState(false);
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");

    let [passwordErr, setPasswordErr] = useState<string | boolean>("");
    let [emailErr, setEmailErr] = useState<string | boolean>("");
    const { theme } = useTheme();

    return (
        <>
            <CTextInput
                label="Email"
                placeholder="Your@gmail.com"
                onChange={(event) => {
                    setEmailErr(false);
                    setEmail(event.currentTarget.value);
                }}
                error={emailErr}
                required
                onKeyUp={(e) => {
                    if (e.key == "Enter") {
                        setLoading(true);
                        attempLogin(
                            email,
                            password,
                            (e: string | boolean) => setEmailErr(e),
                            (e: string | boolean) => setPasswordErr(e),
                            () => setLoading(false),
                            goHome
                        );
                    }
                }}
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                variant="filled"
                onChange={(event) => {
                    setPasswordErr(false);
                    setPassword(event.currentTarget.value);
                }}
                sx={{
                    color: "red",
                }}
                styles={{
                    input: {
                        backgroundColor: theme.backgroundColor,
                        border: "1px solid " + theme.dividerColor,
                    },
                    visibilityToggle: {
                        "&:hover": {
                            backgroundColor: theme.hoverColor,
                        },
                    },
                    innerInput: {
                        color: theme.textColor,
                        backgroundColor: theme.backgroundColor,
                        "&:disabled": {
                            backgroundColor: theme.backgroundColor,
                            color: theme.segundaryTextColor,
                            border: "1px solid " + theme.segundaryTextColor,
                        },
                    },
                    label: {
                        color: theme.segundaryTextColor,
                    },
                }}
                error={passwordErr}
                mt="md"
                onKeyUp={(e) => {
                    if (e.key == "Enter") {
                        setLoading(true);
                        attempLogin(
                            email,
                            password,
                            (e: string | boolean) => setEmailErr(e),
                            (e: string | boolean) => setPasswordErr(e),
                            () => setLoading(false),
                            goHome
                        );
                    }
                }}
            />
            <ActionButton
                fullWidth
                mt="xl"
                loading={loading}
                onClick={() => {
                    setLoading(true);
                    attempLogin(
                        email,
                        password,
                        (e: string | boolean) => setEmailErr(e),
                        (e: string | boolean) => setPasswordErr(e),
                        () => setLoading(false),
                        goHome
                    );
                }}
            >
                Sign in
            </ActionButton>
        </>
    );
}

interface AttempSignUpProps {
    name: string;
    email: string;
    password: string;

    setNameErr: (a: string | boolean) => void;
    setEmailErr: (a: string | boolean) => void;
    setPasswordErr: (a: string | boolean) => void;

    failedLogin: () => void;

    goHome: () => void;
}

function attempSignUp({
    email,
    name,
    password,
    failedLogin,
    goHome,
    setEmailErr,
    setNameErr,
    setPasswordErr,
}: AttempSignUpProps) {
    let err = false;

    if (name.length < 3) {
        setNameErr("Name must be at least 3 characters long");
        err = true;
    }

    if (!emailValitator.validate(email)) {
        setEmailErr("Email not valid!");
        err = true;
    }

    let passVal = passwordSchema.validate(password, {
        details: true,
    }) as any;
    if (passVal.length != 0) {
        setPasswordErr(passVal[0]["message"]);
        err = true;
    }

    if (err) return failedLogin();

    createUserWithEmailAndPassword(auth, email, password)
        .then((creds) => {
            goHome();
        })
        .catch(() => {
            setEmailErr("Email already in use");
            setPasswordErr("Password not valid");
            failedLogin();
        });
}

function SignupTab(goHome: () => void) {
    const [loading, setLoading] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [errorName, setErrorName] = useState<string | boolean>("");
    const [errorEmail, setErrorEmail] = useState<string | boolean>("");
    const [errorPassword, setErrorPassword] = useState<string | boolean>("");

    const { theme } = useTheme();

    const attempSignUpBtnClick = (e: any) => {};

    return (
        <>
            <CTextInput
                label="Name"
                placeholder="Your name"
                required
                onChange={() => {
                    setErrorName("");
                }}
                error={errorName}
                Cref={nameRef}
            />
            <CTextInput
                label="Email Address"
                placeholder="Your@gmail.com"
                Cref={emailRef}
                error={errorEmail}
                required
                mt="md"
            />
            <PasswordInput
                styles={{
                    input: {
                        backgroundColor: theme.backgroundColor,
                        border: "1px solid " + theme.dividerColor,
                    },
                    visibilityToggle: {
                        "&:hover": {
                            backgroundColor: theme.hoverColor,
                        },
                    },
                    innerInput: {
                        color: theme.textColor,
                        backgroundColor: theme.backgroundColor,
                        "&:disabled": {
                            backgroundColor: theme.backgroundColor,
                            color: theme.segundaryTextColor,
                            border: "1px solid " + theme.segundaryTextColor,
                        },
                    },
                    label: {
                        color: theme.segundaryTextColor,
                    },
                }}
                error={errorPassword}
                onChange={(e) => {
                    setErrorPassword("");
                }}
                ref={passwordRef}
                label="Password"
                placeholder="Your password"
                required
                mt="md"
            />
            <ActionButton
                fullWidth
                mt="xl"
                onClick={() => {
                    setLoading(true);
                }}
                loading={loading}
            >
                Create account
            </ActionButton>
        </>
    );
}

export default function AuthenticationPage() {
    let router = useRouter();
    const { theme } = useTheme();

    return (
        <Center w="100vw">
            <Container size={600} my={30}>
                <Paper
                    withBorder
                    shadow="md"
                    p={40}
                    mt={30}
                    radius="md"
                    style={{
                        background: theme.backgroundColor,
                        border: "1px solid " + theme.dividerColor,
                    }}
                >
                    <Center mb="lg">
                        <Image
                            src="/img/BigLogo.png"
                            alt="GPay logo"
                            width={250}
                        />
                    </Center>

                    <Tabs defaultValue="login" variant="default">
                        <Tabs.List
                            style={{
                                borderBottom: "1px solid " + theme.dividerColor,
                            }}
                        >
                            <Tabs.Tab
                                value="login"
                                sx={{
                                    border: "none",
                                    "&:hover": {
                                        background: theme.hoverColor,
                                        borderBotton:
                                            "2px solid red !important",
                                    },
                                    "&[data-active]": {
                                        borderBottom:
                                            "2px solid " +
                                            theme.buttonActiveBackgroundColor,
                                    },
                                    "&[data-active]:hover": {
                                        borderBottom:
                                            "2px solid " +
                                            theme.buttonActiveBackgroundColor,
                                    },
                                }}
                            >
                                <CText>Login</CText>
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="signup"
                                sx={{
                                    border: "none",
                                    "&:hover": {
                                        background: theme.hoverColor,
                                        borderBotton:
                                            "2px solid red !important",
                                    },
                                    "&[data-active]": {
                                        borderBottom:
                                            "2px solid " +
                                            theme.buttonActiveBackgroundColor,
                                    },
                                    "&[data-active]:hover": {
                                        borderBottom:
                                            "2px solid " +
                                            theme.buttonActiveBackgroundColor,
                                    },
                                }}
                            >
                                <CText>Signup</CText>
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="login" pt="xl">
                            {LoginTab(() => {
                                router.push("/dashboard");
                            })}
                        </Tabs.Panel>

                        {/* TODO: Setup signup */}
                        <Tabs.Panel value="signup" pt="xl">
                            {SignupTab(() => {
                                router.push("/dashboard");
                            })}
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
            </Container>
        </Center>
    );
}

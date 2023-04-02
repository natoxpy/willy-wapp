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
import { useEffect, useState } from "react";
import passwordValitator from "password-validator";
import emailValitator from "email-validator";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/firebase.config";
// import { useUser } from "@/providers/userAuthProvider";
import { auth } from "@/firebase/firebase.config";

import { serialize } from "cookie";

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
            console.log("crets", creds);
            goHome();
        })
        .catch(() => {
            setEmailErr("Incorrect email");
            setPasswordErr("Incorrect password");
            failedLogin();
        });
}

function LoginTab(
    setLoadingForm: (state: boolean) => void,
    goHome: () => void
) {
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");

    let [passwordErr, setPasswordErr] = useState<string | boolean>("");
    let [emailErr, setEmailErr] = useState<string | boolean>("");

    return (
        <>
            <TextInput
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
                        setLoadingForm(true);
                        attempLogin(
                            email,
                            password,
                            (e: string | boolean) => setEmailErr(e),
                            (e: string | boolean) => setPasswordErr(e),
                            () => setLoadingForm(false),
                            goHome
                        );
                    }
                }}
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                onChange={(event) => {
                    setPasswordErr(false);
                    setPassword(event.currentTarget.value);
                }}
                error={passwordErr}
                mt="md"
                onKeyUp={(e) => {
                    if (e.key == "Enter") {
                        setLoadingForm(true);
                        attempLogin(
                            email,
                            password,
                            (e: string | boolean) => setEmailErr(e),
                            (e: string | boolean) => setPasswordErr(e),
                            () => setLoadingForm(false),
                            goHome
                        );
                    }
                }}
            />
            <Group position="apart" mt="lg">
                <Container></Container>
                <Anchor component="button" size="sm">
                    Forgot password?
                </Anchor>
            </Group>
            <Button
                fullWidth
                mt="xl"
                onClick={() => {
                    setLoadingForm(true);
                    attempLogin(
                        email,
                        password,
                        (e: string | boolean) => setEmailErr(e),
                        (e: string | boolean) => setPasswordErr(e),
                        () => setLoadingForm(false),
                        goHome
                    );
                }}
            >
                Sign in
            </Button>
        </>
    );
}

export default function AuthenticationPage() {
    let router = useRouter();
    // let { loggedin } = useUser();
    const [loadingForm, setLoadingForm] = useState(false);

    // useEffect(() => {
    //     if (loggedin) router.push("/dashboard");
    // }, [loggedin]);

    return (
        <Center w="100vw">
            <Container size={450} my={30}>
                <LoadingOverlay visible={loadingForm} overlayBlur={2} />
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <Center mb="lg">
                        <Image
                            src="/img/BigLogo.png"
                            alt="GPay logo"
                            width={250}
                        />
                    </Center>

                    <Tabs defaultValue="login" variant="outline">
                        <Tabs.List>
                            <Tabs.Tab value="login">Login</Tabs.Tab>
                            <Tabs.Tab value="signup">Signup</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="login" pt="xl">
                            {LoginTab(
                                (state) => {
                                    setLoadingForm(state);
                                },
                                () => {
                                    router.push("/dashboard");
                                }
                            )}
                        </Tabs.Panel>

                        {/* TODO: Setup signup */}
                        <Tabs.Panel value="signup" pt="xl">
                            <TextInput
                                label="Name"
                                placeholder="Your name"
                                required
                            />
                            <TextInput
                                label="Email Address"
                                placeholder="Your@gmail.com"
                                required
                                mt="md"
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                required
                                mt="md"
                            />
                            <Button fullWidth mt="xl">
                                Create account
                            </Button>
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
            </Container>
        </Center>
    );
}

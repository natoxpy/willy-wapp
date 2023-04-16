import { CBadge } from "@/CustomComponents/CBadge";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { ActionIconBtn } from "@/drySystems/ActionIconBtn";
import { useAuthUser } from "@/firebase/auth/authUser";
import { useUserFireStore } from "@/firebase/firestore";
import { Group, Space, Stack } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRef, useState } from "react";

export default function ProfileDrawer() {
    const { userDoc, changeName } = useUserFireStore();
    const { user } = useAuthUser();
    const [canChangedName, setChangedName] = useState(false);
    const newNameRef = useRef<HTMLInputElement | null>(null);

    return (
        <Stack mx="lg">
            <Group position="apart">
                <CTextInput
                    Cref={newNameRef}
                    label="New Username"
                    placeholder={userDoc?.name}
                    onKeyUp={(e) => {
                        if (!canChangedName) return;

                        if (e.key === "Enter") {
                            changeName(newNameRef.current?.value.trim()!);
                            newNameRef.current!.value = "";
                            setChangedName(false);
                            newNameRef.current!.focus();
                        }
                    }}
                    onChange={(e) => {
                        if (!newNameRef.current) return setChangedName(false);

                        if (newNameRef.current.value.trim() === userDoc?.name)
                            return setChangedName(false);

                        if (newNameRef.current.value.length < 3)
                            return setChangedName(false);

                        setChangedName(true);
                    }}
                    w="calc(100%)"
                    rightSection={
                        <ActionIconBtn
                            colorVariant="green"
                            disabled={!canChangedName}
                            onClick={() => {
                                if (!canChangedName) return;
                                changeName(newNameRef.current?.value.trim()!);
                                newNameRef.current!.value = "";
                                setChangedName(false);
                                newNameRef.current!.focus();
                            }}
                        >
                            <IconDeviceFloppy />
                        </ActionIconBtn>
                    }
                />
            </Group>

            <Space h={10} />

            <Group position="center">
                <CBadge variant="blue">
                    created{" "}
                    {dayjs(user?.metadata.creationTime).format("MMM D, YYYY")}
                </CBadge>
            </Group>
        </Stack>
    );
}

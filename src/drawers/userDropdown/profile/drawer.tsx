import { ConfirmButton } from "@/CustomComponents/buttons/ConfirmButton";
import { CDivider } from "@/CustomComponents/CDivider";
import { CPasswordInput } from "@/CustomComponents/CPasswordInput";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { useAuthUser } from "@/firebase/auth/authUser";
import { useUserFireStore } from "@/firebase/firestore";
import { Stack } from "@mantine/core";

export default function ProfileDrawer() {
    const { userDoc } = useUserFireStore();
    return (
        <Stack>
            <CTextInput label="New Username" placeholder={userDoc?.name} />

            <CPasswordInput
                label="Password"
                placeholder="password"
                required
                mb="sm"
            />

            <ConfirmButton>Save</ConfirmButton>
        </Stack>
    );
}

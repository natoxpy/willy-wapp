import { useTheme } from "@/themes";
import { PasswordInput, PasswordInputProps } from "@mantine/core";

export function CPasswordInput(props: PasswordInputProps) {
    const { theme } = useTheme();

    return (
        <>
            <PasswordInput
                {...props}
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
            />
        </>
    );
}

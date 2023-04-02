import { useTheme } from "@/themes";
import { TextInput, TextInputProps } from "@mantine/core";
import { Ref, useState } from "react";

interface CTextInputProps extends TextInputProps {
    Cref: Ref<HTMLInputElement>;
}

export function CTextInput(props: CTextInputProps) {
    const { theme } = useTheme();

    return (
        <TextInput
            {...props}
            ref={props.Cref}
            styles={{
                input: {
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    border: "1px solid " + theme.dividerColor,
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
    );
}

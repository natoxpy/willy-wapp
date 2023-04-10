import {
    CAccordionControl,
    CAccordionItem,
} from "@/CustomComponents/CAccordion";
import { CBadge } from "@/CustomComponents/CBadge";
import { CText } from "@/CustomComponents/CText";
import { CTextInput } from "@/CustomComponents/CTextInput";
import {
    Accordion,
    ActionIcon,
    Flex,
    Group,
    Space,
    Stack,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { ActionButton } from "./ActionButton";

export function FilterOptionsAccItem({
    filterTags,
    setTags,
}: {
    filterTags: Array<string>;
    setTags: (tags: Array<string>) => void;
}) {
    let inputRef = useRef<HTMLInputElement>(null);
    let [inputError, setInputError] = useState("");

    return (
        <>
            <Stack>
                <Flex>
                    <CTextInput
                        placeholder="Tag name"
                        type="text"
                        min={"100px"}
                        maw="500px"
                        w="100%"
                        autoComplete="organization"
                        Cref={inputRef}
                        error={inputError}
                        onChange={() => {
                            setInputError("");
                        }}
                    ></CTextInput>
                    <Space w={16} />
                    <ActionButton
                        size="sm"
                        onClick={() => {
                            if (inputRef.current?.value.trim() == "") {
                                setInputError("Tag name cannot be empty");
                                return;
                            }

                            if (
                                filterTags.includes(
                                    inputRef.current?.value || ""
                                )
                            ) {
                                setInputError("Tag already included");
                                return;
                            }

                            setInputError("");
                            setTags([
                                ...filterTags,
                                inputRef.current?.value || "",
                            ]);

                            if (inputRef.current) inputRef.current.value = "";
                        }}
                    >
                        <IconPlus size={24} />
                    </ActionButton>
                </Flex>
                <Space />
                <Group position="center">
                    {filterTags.length > 0 ? (
                        filterTags.map((tag) => {
                            return (
                                <CBadge
                                    variant="blue"
                                    key={Math.random()}
                                    rightSection={
                                        <ActionIcon
                                            size="xs"
                                            color="red"
                                            radius="xl"
                                            variant="transparent"
                                        >
                                            <IconX />
                                        </ActionIcon>
                                    }
                                    onClick={() => {
                                        setTags(
                                            filterTags.filter((t) => t !== tag)
                                        );
                                    }}
                                >
                                    {tag}
                                </CBadge>
                            );
                        })
                    ) : (
                        <CBadge variant="red" color="red">
                            No tags added
                        </CBadge>
                    )}
                </Group>
            </Stack>
        </>
    );
}

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
    Badge,
    Button,
    Center,
    Group,
    rem,
    Stack,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { ActionButton } from "./ActionButton";
import { ActionIconBtn } from "./ActionIconBtn";

interface Props {
    tags: Array<string>;
    setTags: (tags: Array<string>) => void;
    setTagNameError: (error: string) => void;
    tagNameError: string;
}

export function AccordionTagsAdder({
    setTagNameError,
    setTags,
    tagNameError,
    tags,
}: Props) {
    let tagNameRef = useRef<HTMLInputElement>(null);

    const addTag = () => {
        if (tagNameRef.current == null) return;

        let tagNameval = (tagNameRef.current.value as string).trim();

        if (tagNameval == "") setTagNameError("Tag name cannot be empty");
        else if (tagNameval.length <= 1)
            setTagNameError("Tag name must be atleast 2 characters long");
        else if (tagNameval.length > 16)
            setTagNameError("Tag name must be less than 16 characters long");
        else {
            let err = false;
            tags.map((tag) => {
                if (tag == tagNameval) {
                    setTagNameError("Tag already exists");
                    err = true;
                }
            });

            if (err) return;
            setTags([...tags, tagNameval]);
            tagNameRef.current.value = "";
        }
    };

    return (
        <CAccordionItem value="tags">
            <CAccordionControl>
                <CText>Tags</CText>
            </CAccordionControl>
            <Accordion.Panel>
                <Stack mb="sm">
                    <CTextInput
                        label="Tag"
                        size="md"
                        type="text"
                        error={tagNameError}
                        onKeyUp={(e) => e.key == "Enter" && addTag()}
                        onChange={() => {
                            setTagNameError("");
                        }}
                        placeholder="unnamed"
                        Cref={tagNameRef}
                    />
                    <Group position="center">
                        <ActionButton w="8em" onClick={addTag}>
                            Add tag
                        </ActionButton>
                    </Group>
                </Stack>
                <Accordion defaultValue={"created_tags"}>
                    <CAccordionItem value="created_tags">
                        <CAccordionControl>
                            <CText>tags added</CText>
                        </CAccordionControl>
                        <Accordion.Panel>
                            {tags.length == 0 ? (
                                <Group position="center" mt="sm">
                                    <CBadge variant="red" color="red">
                                        No tags added
                                    </CBadge>
                                </Group>
                            ) : (
                                <Group position="center" mt="sm">
                                    {tags.map((tag) => (
                                        <CBadge
                                            variant="green"
                                            key={tag}
                                            rightSection={
                                                <ActionIconBtn
                                                    size="xs"
                                                    radius="xl"
                                                    variant="transparent"
                                                    style={{
                                                        background:
                                                            "transparent",
                                                    }}
                                                    onClick={() => {
                                                        let newTags =
                                                            tags.filter(
                                                                (t) => t != tag
                                                            );
                                                        setTags(newTags);
                                                    }}
                                                >
                                                    <IconX size={rem(16)} />
                                                </ActionIconBtn>
                                            }
                                        >
                                            {tag}
                                        </CBadge>
                                    ))}
                                </Group>
                            )}
                        </Accordion.Panel>
                    </CAccordionItem>
                </Accordion>
            </Accordion.Panel>
        </CAccordionItem>
    );
}

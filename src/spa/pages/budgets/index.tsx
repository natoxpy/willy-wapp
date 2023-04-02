import { UseQuery } from "@/utils";
import { Box, Container, Divider } from "@mantine/core";

export default function BudgetsPage() {
    let { matchMaxWidth } = UseQuery();

    let responsiveCalcChange = matchMaxWidth("sm") ? 20 : 50;

    console.log(responsiveCalcChange);

    return (
        <Box
            sx={() => ({
                overflow: "hidden",

                minWidth: "100vw",
                maxWidth: "100vw",
            })}
        >
            <Box
                style={{
                    width: `calc(100vw - 10px)`,
                }}
            >
                Budgets
                <Divider />
            </Box>
        </Box>
    );
}

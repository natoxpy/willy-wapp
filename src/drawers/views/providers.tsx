import { ReactNode } from "react";
import { ViewBudgetProvider } from "./budgetView/state";
import { ViewGoalProvider } from "./goalView/state";
import { ViewTransactionProvider } from "./transactionsView/state";

export function ViewProviders({ children }: { children: ReactNode }) {
    return (
        <ViewBudgetProvider>
            <ViewGoalProvider>
                <ViewTransactionProvider>{children}</ViewTransactionProvider>
            </ViewGoalProvider>
        </ViewBudgetProvider>
    );
}

import { ReactNode } from "react";
import { ViewBudgetProvider } from "./budgetView/state";
import { ViewGoalProvider } from "./goalView/state";

export function ViewProviders({ children }: { children: ReactNode }) {
    return (
        <ViewBudgetProvider>
            <ViewGoalProvider>{children}</ViewGoalProvider>
        </ViewBudgetProvider>
    );
}

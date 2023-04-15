import {
    AddMoneyDrawerProvider,
    CreateBudgetProvider,
    CreateGoalProvider,
    DoTransactionProvider,
} from "..";

export function ActionsProviders({ children }: { children: React.ReactNode }) {
    return (
        <AddMoneyDrawerProvider>
            <CreateBudgetProvider>
                <CreateGoalProvider>
                    <DoTransactionProvider>{children}</DoTransactionProvider>
                </CreateGoalProvider>
            </CreateBudgetProvider>
        </AddMoneyDrawerProvider>
    );
}

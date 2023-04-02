import { UseQuery } from "@/utils";
import { useGesture } from "@use-gesture/react";
import { useContext, createContext } from "react";
import { useNavbar } from "./navbar/state";

interface ContextType {
    currentRoute: string;
    getRouteName: () => string;
}

const dashboardContext = createContext<ContextType>({
    currentRoute: "",
    getRouteName: () => "Not found",
});

const useDashboard = () => useContext(dashboardContext);

export { useDashboard };

export function DashboardProvider({
    children,
    currentRoute,
    getRouteName,
}: {
    children: React.ReactNode;
    currentRoute: string;
    getRouteName: () => string;
}) {
    const navbar = useNavbar();
    const { matchMaxWidth } = UseQuery();

    const bind = useGesture({
        onDrag: ({ swipe: [swipeX] }) => {
            if (swipeX && matchMaxWidth("sm"))
                swipeX > 0 ? navbar.open() : navbar.close();
        },
    });

    return (
        <dashboardContext.Provider
            value={{
                currentRoute,
                getRouteName,
            }}
        >
            <div {...bind()}>{children}</div>
        </dashboardContext.Provider>
    );
}

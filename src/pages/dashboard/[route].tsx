import { useRouter } from "next/router";
import DashboardPage from "../../dashboard/dashboard";

export default function CustomRoute() {
    const router = useRouter();
    let starterRoute = 0;

    let route = router.query.route;

    if (route == "home") starterRoute = 0;
    else if (route == "budget") starterRoute = 1;
    else if (route == "goals") starterRoute = 2;
    else if (route == "transactions") starterRoute = 3;
    else starterRoute = 0;

    return <DashboardPage startingRoute={starterRoute} />;
}

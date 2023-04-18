import RootDashboard from "@/spa/dashboard";
import { useRouter } from "next/router";

export default function Dashboard() {
    const router = useRouter();
    let route = router.query.dashRoute;
    route = Array.isArray(route) ? route[0] : route;
    return <RootDashboard route={route ?? "home"} />;
}

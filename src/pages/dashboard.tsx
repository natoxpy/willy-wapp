import { useRouter } from "next/router";
import TrueDashboard from "../dashboard/dashboard";

export default function Dashboard() {
    return <TrueDashboard startingRoute={0} />;
}

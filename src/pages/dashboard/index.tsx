import { GetServerSidePropsContext } from "next";

export default function HomeDashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        redirect: {
            destination: "/dashboard/home",
            permanent: false,
        },
    };
}

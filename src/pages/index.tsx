import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div>
                This page should not be visible. Please go to the login page.
            </div>
            <Link href="/login">Go to login page</Link>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };
}

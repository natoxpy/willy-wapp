import DashBoard from "./_dashboard.404";
import { useUser } from "../providers/userAuthProvider";
import { useEffect, useState } from "react";
import { db } from "@/firebase.config";
import { getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
    let router = useRouter();

    return (
        <div>
            <Link href="/login">Login</Link>
        </div>
    );
}

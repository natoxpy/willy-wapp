import DashBoard from "./_dashboard.404";
import { useUser } from "../providers/userAuthProvider";
import { useEffect, useState } from "react";
import { db } from "@/firebase.config";
import { getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Home() {
    let router = useRouter();

    return <div> </div>;
}

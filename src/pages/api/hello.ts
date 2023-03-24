import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";

type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    console.log(parse(req.headers.cookie ?? ""));

    // const creds = await signInWithEmailAndPassword(
    //     auth,
    //     "test@gmail.com",
    //     "test123"
    // ).catch((err) => console.log(err));
    // console.log(creds);

    let serialCookie = serialize("my-cok", "my-val");

    res.setHeader("Set-Cookie", serialCookie)
        .status(200)
        .json({ name: "John Doe" });
}

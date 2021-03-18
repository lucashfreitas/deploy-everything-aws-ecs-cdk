import { IncomingMessage, ServerResponse } from "node:http";






export const index = (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json");
    res.end("Api is working");
}
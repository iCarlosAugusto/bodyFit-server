import { Response } from "express";

class HttpUtil {
    static sucesso(reply: any, response: Response) {
        return response.send({
            'sucesso': reply
        });
    }

    static error(reply: any, response: Response) {
        return response.status(500).send({
            'error': reply
        });
    }
}

export { HttpUtil };
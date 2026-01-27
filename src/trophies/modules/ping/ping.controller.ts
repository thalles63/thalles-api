import { Controller, Get } from "@nestjs/common";

@Controller("ping")
export class PingController {
    @Get("")
    async ping() {
        return true;
    }
}

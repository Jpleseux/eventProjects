import { eventOutput } from "../../http/event/httpEventGateway.local";

export interface eventGateway{
    saveEvent(input: object): Promise<eventOutput>;
}
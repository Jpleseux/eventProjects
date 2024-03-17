import { Output, eventOutput, eventOutputs } from "../../http/event/httpEventGateway.local";

export interface eventGateway{
    saveEvent(input: object): Promise<eventOutput>;
    getEvents(): Promise<eventOutputs>;
    delete(uuid: string): Promise<Output>;
}
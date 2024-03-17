import httpClient from "../../../http/httpClient";
import { eventGateway } from '../../interfaces/event/eventGateway';
export type eventOutput = {
    status: number,
    event?: object,
    message: string,
}
export type eventOutputs = {
    status: number,
    event?: object[],
    message: string,
}
export type Output = {
    status: number,
    message: string,
}
export class HttpEventGateway implements eventGateway {
    constructor(readonly httpClient: httpClient) {}
    async saveEvent(input: object): Promise<eventOutput>{
        const response = await this.httpClient.post("commitment/save/commitment", input);
        if (response && response.status < 300) {
            const event = {
                uuid: response.data.commitment.uuid,
                time: response.data.commitment.time,
                title: response.data.commitment.title,
                date: response.data.commitment.date,
                eventPlace: response.data.commitment.eventPlace,

            }
            return {
                status: response.status,
                event: event,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async getEvents(): Promise<eventOutputs> {
        const response = await this.httpClient.get("commitment");
        if (response && response.status < 300) {
            const events = [];
            for (const eventIn of response.data.commitments) {
                const event = {
                    uuid: eventIn.uuid,
                    time: eventIn.time,
                    title: eventIn.title,
                    allDay: false,
                    start: eventIn.date,
                    eventPlace: eventIn.eventPlace,
                }
                events.push(event);
            }
            return {
                status: response.status,
                event: events,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async delete(uuid: string): Promise<Output> {
        const response = await this.httpClient.delete("commitment/" + uuid);
        return {
            status: response.status ?? 200,
            message: response.message,
        }
    }
}

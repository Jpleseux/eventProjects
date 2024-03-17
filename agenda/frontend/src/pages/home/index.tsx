import React, { useState, useEffect, ChangeEvent, useContext, FormEvent } from "react";
import CookieFactory from "../../utils/cookieFactory";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GatewayContext } from "../../gateway/gatewayContext";
import Message from "../../components/visual/Message.component";
import "./index.css";

function Index() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [msg, setMsg] = useState<{ msg: string | null, status: number | null }>({ msg: null, status: null });
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const gatewayContext = useContext(GatewayContext);
    const eventGateway = gatewayContext?.eventGateway;
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [event, setEvent] = useState<{
        date: Date;
        time: string;
        title: string;
        eventPlace: string;
        uuid: string;
        user_id: string;
    }>({
        date: new Date(),
        time: "",
        title: "",
        eventPlace: "",
        uuid: "",
        user_id: "",
    });
    const factory = new CookieFactory();

    async function getCookie() {
        return await factory.getCookie("user");
    }

    async function handleOnChangeEvent(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (name === "date") {
            setSelectedDate(value);
        }
        setEvent((prevState) => ({ ...prevState, [name]: value }));
    }

    async function saveEvent(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        events.push({
            eventPlace: event.eventPlace,
            time: event.time,
            uuid: event.uuid,
            title: event.title,
            date: event.date,
        })
        event.user_id = await getCookie().uuid;
        const eventRes = await eventGateway?.saveEvent(event);
        setMsg({ msg: eventRes?.message, status: eventRes?.status })
    }

    function handleDateClick(arg: { dateStr: string }) {
        setSelectedDate(arg.dateStr);
        setEvent(prevState => ({ ...prevState, date: arg.date }));
        setForm(true);
    }

    async function getEvents() {
        const fetchedEvents = (await eventGateway?.getEvents())?.event || [];
        setEvents(fetchedEvents);
    }

    function handleEventClick(arg: { event: any }) {
        setSelectedEvent(arg.event);
        setSelectedEvent({
            eventPlace: arg.event.extendedProps.eventPlace,
            time: arg.event.extendedProps.time,
            uuid: arg.event.extendedProps.uuid,
            title: arg.event.title,
            date: arg.event.start,
        })
        setShowForm(true);
    }

    async function deleteEvent() {
        if (!selectedEvent || !selectedEvent.uuid) {
            return;
        }
        setLoading(true);
        const eventRes = await eventGateway?.delete(selectedEvent.uuid);
        setMsg({ msg: eventRes?.message, status: eventRes?.status });
        if (eventRes?.status >= 300) {
            await getEvents();
            setSelectedEvent(null);
            setShowForm(false);
        }
    }

    useEffect(() => {
        getEvents();
        getCookie();
    }, []);

    return (
        <div className="app-container">
            <Message msg={msg.msg} status={msg.status} timers={3000} />
            <h1>Agenda de Compromissos</h1>
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                />
                {showForm && selectedEvent && (
                    <div className="form-container">
                        <h2>{selectedEvent.title}</h2>
                        <p>Data: {new Date(selectedEvent.date).toLocaleString()}</p>
                        <p>Hora: {selectedEvent.time}</p>
                        <p>Local do Evento: {selectedEvent.eventPlace}</p>
                        <button onClick={deleteEvent}>Deletar Evento</button>
                        <button onClick={() => setShowForm(false)}>Fechar</button>
                    </div>
                )}
                {form && (
                    <div className="form-container">
                        <h2>Adicionar Projeto - {selectedDate}</h2>
                        <form onSubmit={saveEvent}>
                            <label>
                                Título:
                                <input type="text" name="title" onChange={handleOnChangeEvent} />
                            </label>
                            <label>
                                Local do evento:
                                <input type="text" name="eventPlace" onChange={handleOnChangeEvent} />
                            </label>
                            <label>
                                Data:
                                <input type="text" name="date" value={selectedDate || ''} readOnly onChange={handleOnChangeEvent} />
                            </label>
                            <label>
                                Hora:
                                <input type="time" name="time" onChange={handleOnChangeEvent} />
                            </label>
                            <button type="submit">Adicionar Projeto</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Index;

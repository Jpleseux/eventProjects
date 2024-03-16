import React, { useState, useEffect, ChangeEvent, useContext, FormEvent } from "react";
import CookieFactory from "../../utils/cookieFactory";
import "../../../public/style/home/index.css";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GatewayContext } from "../../gateway/gatewayContext";
import Message from "../../components/visual/Message.component";

function Index() {
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [msg, setMsg] = useState({ msg: null, status: null });
    const [loading, setLoading] = useState(false);
    const gatewayContext = useContext(GatewayContext);
    const eventGateway = gatewayContext?.eventGateway;
    const [event, setEvent] = useState<{
        date: Date;
        time: string;
        title: string;
        eventPlace: string;
        uuid: string;
    }>({
        date: new Date(),
        time: "",
        title: "",
        eventPlace: "",
        uuid: ""
    });
    const factory = new CookieFactory();

    async function getCookie() {
        console.log(await factory.getCookie("user"));
    }
    async function handleOnChangeEvent(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEvent((prevState) => ({ ...prevState, [name]: value }));
    }
    async function saveEvent(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const eventRes = await eventGateway?.saveEvent(event);
        console.log(eventRes);
        setMsg({msg: eventRes?.message, status: eventRes?.status})
    }
    function handleDateClick(arg) {
        setSelectedDate(arg.dateStr);
        setShowForm(true);
    }

    useEffect(() => {
        getCookie();
    }, []);

    return (
        <div className="App">
            <Message msg={msg.msg} status={msg.status} timers={3000}/>
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
                    events={[
                        {
                            title: 'Reunião de Equipe',
                            start: '2024-03-16T10:00:00',
                            end: '2024-03-16T11:30:00'
                        },
                        {
                            title: 'Apresentação de Projeto',
                            start: '2024-03-20T13:00:00',
                            end: '2024-03-20T15:00:00'
                        }
                    ]}
                    dateClick={handleDateClick}
                />
                {showForm && (
                    <div className="form-container">
                        <h2>Adicionar Projeto - {selectedDate}</h2>
                        <form onSubmit={saveEvent}>
                            <label>
                                Título:
                                <input type="text" name="title"  onChange={handleOnChangeEvent}/>
                            </label>
                            <label>
                                local do evento:
                                <input type="text" name="eventPlace"  onChange={handleOnChangeEvent}/>
                            </label>
                            <label>
                                Data:
                                <input type="text" name="date" value={selectedDate} readOnly  onChange={handleOnChangeEvent}/> 
                            </label>
                            <label>
                                Hora:
                                <input type="time" name="time"  onChange={handleOnChangeEvent}/>
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

import Calendar from 'components/Calendar/Calendar';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './_app';

export default function UpcomingEvents() {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      setEvents((await authContext.getEvents()) || []);
    })();
  }, [authContext]);

  function getCalendars() {
    let calendars = [];
    let date = new Date();
    for (let i = 0; i < 12; i++) {
      calendars.push(<Calendar key={i} date={new Date(date)} events={events} />);
      date.setMonth(date.getMonth() + 1);
    }
    return calendars;
  }

  return getCalendars();
}

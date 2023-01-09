import Calendar from 'components/Calendar/Calendar';
import { useRouter } from 'next/router';
import { AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';

export default function UpcomingEvents() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      if (router.asPath.includes('topluluklar')) {
        setEvents((await authContext.getCommunityEvents(router.query.id)) || []);
      } else {
        setEvents((await authContext.getEvents()) || []);
      }
    })();
  }, [authContext, router.asPath, router.query.id]);

  function getCalendars() {
    let calendars = [];
    let date = new Date();
    let lastEventMonth = -1;
    for (const e of events) {
      if (e.event[0].date.month > lastEventMonth) {
        lastEventMonth = e.event[0].date.month;
      }
    }

    for (let i = 0; i <= lastEventMonth; i++) {
      calendars.push(<Calendar key={i} date={new Date(date)} events={events} />);
      date.setMonth(date.getMonth() + 1);
    }
    return lastEventMonth !== -1 ? calendars : <p className='noEvents'>Yaklaşan etkinlik yok</p>;
  }

  return getCalendars();
}

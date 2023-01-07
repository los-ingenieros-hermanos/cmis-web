import { CommunityProfilePage } from 'components';
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
      setEvents((await authContext.getCommunityEvents(router.query.id)) || []);
    })();
  }, [authContext, router.query.id]);

  function getCalendars() {
    let calendars = [];
    let date = new Date();
    for (let i = 0; i < 12; i++) {
      calendars.push(<Calendar key={i} date={new Date(date)} events={events} />);
      date.setMonth(date.getMonth() + 1);
    }
    return calendars;
  }

  return <CommunityProfilePage>{getCalendars()}</CommunityProfilePage>;
}

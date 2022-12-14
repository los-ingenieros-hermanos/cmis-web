import clsx from 'clsx';
import Calendar from 'components/Calendar/Calendar';
import { useRouter } from 'next/router';
import { ApiContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';

export default function UpcomingEvents() {
  const router = useRouter();
  const apiContext = useContext(ApiContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (router.asPath.includes('topluluklar')) {
        setEvents((await apiContext.getCommunityEvents(router.query.id)) || []);
      } else {
        setEvents((await apiContext.getEvents()) || []);
      }
      setIsLoading(false);
    })();
  }, [apiContext, router.asPath, router.query.id]);

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
    return isLoading ? (
      <div className={clsx('eventsLoader', !router.asPath.includes('/topluluklar') && 'mainLoader')}></div>
    ) : lastEventMonth !== -1 ? (
      calendars
    ) : (
      <p className='noEvents'>Yaklaşan etkinlik yok</p>
    );
  }

  return getCalendars();
}

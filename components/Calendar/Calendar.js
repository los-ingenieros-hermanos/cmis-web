import clsx from 'clsx';
import Link from 'components/Link/Link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Calendar.module.scss';

const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function Event({ event }) {
  const router = useRouter();
  const [isDetailsShowing, setIsDetailsShowing] = useState(false);

  function withZero(time) {
    return (time < 10 ? '0' : '') + time;
  }

  return (
    <div className={styles.event}>
      <Link href={`/topluluklar/${event.community.id}/gonderiler/${event.id}?eventId=${event.event[0].id}`}>
        <img
          key={event.id}
          src={event.community?.image || event.student?.image}
          alt='event'
          onMouseOver={() => setIsDetailsShowing(true)}
          onMouseOut={() => setIsDetailsShowing(false)}
        />
      </Link>
      {isDetailsShowing && (
        <div className={styles.eventDetails}>
          {!router.asPath.includes('topluluklar') && (
            <div className={styles.title}>{event.community.user.firstName}</div>
          )}
          <div>{event.title}</div>
          <div>{withZero(event.event[0].date.hour) + ':' + withZero(event.event[0].date.minute)}</div>
        </div>
      )}
    </div>
  );
}

function Day({ className, date, allEvents }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(
      allEvents.filter((event) => {
        const { year, month, day } = event.event[0].date;
        return year === date.getFullYear() && month === date.getMonth() && day === date.getDate();
      }),
    );
  }, [allEvents, date]);

  return (
    <div className={className}>
      <span className='dayNumber'>{date.getDate()}</span>
      <div className={styles.events}>
        {events.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </div>
      <div className={styles.eventInfo}>{}</div>
    </div>
  );
}

export default function Calendar({ date, events }) {
  function getWeekElements() {
    let startDate = new Date(date.getFullYear(), date.getMonth());
    let weekElements = [[]];
    let dayIndex = startDate.getDay();
    dayIndex = dayIndex !== 0 ? dayIndex - 1 : 6; // Index based on monday being 0, normally sunday is 0
    for (let i = 0; i < dayIndex; i++) {
      weekElements[0].push(
        <div key={i} className={clsx(styles.day, styles.emptyDay, i === dayIndex - 1 && styles.rightBorder)}></div>,
      );
    }

    let month = startDate.getMonth();
    while (startDate.getMonth() === month) {
      if (startDate.getDay() === 1) {
        weekElements.push([]);
      }
      const today = new Date();
      const isDayToday =
        startDate.getFullYear() === today.getFullYear() &&
        startDate.getMonth() === today.getMonth() &&
        startDate.getDate() === today.getDate();
      weekElements[weekElements.length - 1].push(
        <Day
          key={weekElements[weekElements.length - 1].length}
          className={clsx(styles.day, styles.existingDay, isDayToday && styles.currentDay)}
          date={new Date(startDate)}
          allEvents={events}
        />,
      );
      startDate.setDate(startDate.getDate() + 1);
    }

    while (weekElements[weekElements.length - 1].length < 7) {
      weekElements[weekElements.length - 1].push(
        <div key={weekElements[weekElements.length - 1].length} className={clsx(styles.day, styles.emptyDay)}></div>,
      );
    }

    return weekElements.map((dayElements, i) => (
      <div key={i} className={styles.weekFlex}>
        {dayElements}
      </div>
    ));
  }

  return (
    <div className={styles.calendar}>
      <h2>
        {monthNames[date.getMonth()]}, {date.getFullYear()}
      </h2>
      <div className={styles.dayNames}>
        {dayNames.map((dayName) => (
          <div key={dayName} className={styles.dayName}>
            {dayName}
          </div>
        ))}
      </div>
      <div className={styles.monthFlex}>{getWeekElements()}</div>
    </div>
  );
}

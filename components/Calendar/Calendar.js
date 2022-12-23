import styles from './Calendar.module.scss';
import clsx from 'clsx';

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

export default function Calendar({ date }) {
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
        <div
          key={weekElements[weekElements.length - 1].length}
          className={clsx(styles.day, styles.existingDay, isDayToday && styles.currentDay)}
        >
          {startDate.getDate()}
        </div>,
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

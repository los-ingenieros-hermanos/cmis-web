import { CommunityProfilePage } from 'components';
import Calendar from 'components/Calendar/Calendar';

export default function UpcomingEvents() {
  // request id from backend and show 404 if id doesn't exist
  function getCalendars() {
    let calendars = [];
    let date = new Date();
    for (let i = 0; i < 12; i++) {
      calendars.push(<Calendar key={i} date={new Date(date)} />);
      date.setMonth(date.getMonth() + 1);
    }
    return calendars;
  }

  return <CommunityProfilePage>{getCalendars()}</CommunityProfilePage>;
}

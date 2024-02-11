import { Fragment, useMemo } from "react";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
  dayjsLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import dayjs from "dayjs";
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
const locales = {
    'en-US': enUS,
  }

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const events = [
  {
    title: "test",
    start: moment().add(1, "days").subtract(5, "hours").toDate(),
    end: moment().add(1, "days").subtract(4, "hours").toDate(),
    allDay: false,
  },
  {
    title: "test larger",
    start: moment().startOf("day").add(5, "hours").toDate(),
    end: moment().startOf("day").add(10, "hours").toDate(),
    allDay: false,
  },

  {
    title: "test larger",
    start: moment().startOf("day").add(15, "hours").toDate(),
    end: moment().startOf("day").add(23, "hours").toDate(),
    allDay: false,
  },
  {
    title: "test all day",
    start: moment().startOf("day").toDate(),
    end: moment().startOf("day").add(1, "day").toDate(),
    allDay: true,
  },
  {
    title: "test 2 days",
    start: moment().startOf("day").toDate(),
    end: moment().startOf("day").add(2, "days").toDate(),
    allDay: true,
  },
  {
    title: "test multi-day",
    start: moment().toDate(),
    end: moment().add(3, "days").toDate(),
    allDay: false,
  },
];
const ShiftScheduler = () => {
  const defaultDate = useMemo(() => new Date(2015, 3, 12), []);
  return (
    <div>
      <Fragment>
      <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
      </Fragment>
    </div>
  );
};

export default ShiftScheduler;

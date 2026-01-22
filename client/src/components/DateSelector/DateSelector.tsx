"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTimezoneLabel, timezones } from "@/lib/dateTimeUtils";
import { getTimezone, useStore } from "@/lib/store";
import { Calendar, Check, Globe } from "lucide-react";
import { DateTime } from "luxon";
import { CustomDateRangePicker } from "./CustomDateRangePicker";
import { Time } from "./types";

// Convert wellKnown kebab-case to display labels
// const wellKnownLabels: Record<string, string> = {
//   today: "Today",
//   yesterday: "Yesterday",
//   "last-3-days": "Last 3 Days",
//   "last-7-days": "Last 7 Days",
//   "last-14-days": "Last 14 Days",
//   "last-30-days": "Last 30 Days",
//   "last-60-days": "Last 60 Days",
//   "last-30-minutes": "Last 30 Minutes",
//   "last-1-hour": "Last 1 Hour",
//   "last-6-hours": "Last 6 Hours",
//   "last-24-hours": "Last 24 Hours",
//   "this-week": "This Week",
//   "last-week": "Last Week",
//   "this-month": "This Month",
//   "last-month": "Last Month",
//   "this-year": "This Year",
//   "all-time": "All Time",
// };
const wellKnownLabels: Record<string, string> = {
  today: "今日",
  yesterday: "昨日",
  "last-3-days": "最近三日",
  "last-7-days": "最近七日",
  "last-14-days": "最近十四日",
  "last-30-days": "最近三十日",
  "last-60-days": "最近六十日",
  "last-30-minutes": "最近三十分",
  "last-1-hour": "最近一小时",
  "last-6-hours": "最近六小时",
  "last-24-hours": "最近二十四小时",
  "this-week": "本周",
  "last-week": "上周",
  "this-month": "本月",
  "last-month": "上月",
  "this-year": "本年",
  "all-time": "全部",
};

const getLabel = (time: Time) => {
  // Check for wellKnown preset first
  if (time.wellKnown && wellKnownLabels[time.wellKnown]) {
    return wellKnownLabels[time.wellKnown];
  }

  // Use timezone-aware "now" for comparisons
  const tz = getTimezone();
  const now = DateTime.now().setZone(tz);

  if (time.mode === "range") {
    const startFormatted = DateTime.fromISO(time.startDate).toFormat("EEEE, MMM d");
    const endFormatted = DateTime.fromISO(time.endDate).toFormat("EEEE, MMM d");
    return `${startFormatted} - ${endFormatted}`;
  }

  if (time.mode === "past-minutes") {
    if (time.pastMinutesStart >= 60) {
      const hours = Math.floor(time.pastMinutesStart / 60);
      // return `Last ${hours} ${hours === 1 ? "Hour" : "Hours"}`;
      return ` 最近${hours}小时`;
    }
    // return `Last ${time.pastMinutesStart} minutes`;
    return `最近${time.pastMinutesStart}分`;
  }

  if (time.mode === "day") {
    if (time.day === now.toISODate()) {
      return "今日";
    }
    if (time.day === now.minus({ days: 1 }).toISODate()) {
      return "昨日";
    }
    return DateTime.fromISO(time.day).toFormat("EEEE, MMM d");
  }
  if (time.mode === "week") {
    if (time.week === now.startOf("week").toISODate()) {
      return "本周";
    }
    if (time.week === now.minus({ weeks: 1 }).startOf("week").toISODate()) {
      return "上周";
    }
    const startDate = DateTime.fromISO(time.week).toFormat("EEEE, MMM d");
    const endDate = DateTime.fromISO(time.week).endOf("week").toFormat("EEEE, MMM d");
    return `${startDate} - ${endDate}`;
  }
  if (time.mode === "month") {
    if (time.month === now.startOf("month").toISODate()) {
      return "本月";
    }
    if (time.month === now.minus({ months: 1 }).startOf("month").toISODate()) {
      return "上月";
    }
    return DateTime.fromISO(time.month).toFormat("MMMM yyyy");
  }
  if (time.mode === "year") {
    if (time.year === now.startOf("year").toISODate()) {
      return "本年";
    }
    return DateTime.fromISO(time.year).toFormat("yyyy");
  }
  if (time.mode === "all-time") {
    return "全部";
  }
};

export function DateSelector({
  time,
  setTime,
  pastMinutesEnabled = true,
}: {
  time: Time;
  setTime: (time: Time) => void;
  pastMinutesEnabled?: boolean;
}) {
  const { timezone, setTimezone } = useStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger size={"sm"}>
        <Calendar className="hidden sm:block w-4 h-4" />
        {getLabel(time)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "day",
              day: now.toISODate()!,
              wellKnown: "today",
            });
          }}
          className="w-48"
        >
          <div className="w-4">{time.wellKnown === "today" && <Check className="w-4 h-4" />}</div>
          {/* Today */}
          今日
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "range",
              startDate: now.minus({ days: 2 }).toISODate()!,
              endDate: now.toISODate()!,
              wellKnown: "last-3-days",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "last-3-days" && <Check className="w-4 h-4" />}</div>
          {/* Last 3 Days */}
          最近三日
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "range",
              startDate: now.minus({ days: 6 }).toISODate()!,
              endDate: now.toISODate()!,
              wellKnown: "last-7-days",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "last-7-days" && <Check className="w-4 h-4" />}</div>
          {/* Last 7 Days */}
          最近七日
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "range",
              startDate: now.minus({ days: 13 }).toISODate()!,
              endDate: now.toISODate()!,
              wellKnown: "last-14-days",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "last-14-days" && <Check className="w-4 h-4" />}</div>
          {/* Last 14 Days */}
          最近十四日
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "range",
              startDate: now.minus({ days: 29 }).toISODate()!,
              endDate: now.toISODate()!,
              wellKnown: "last-30-days",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "last-30-days" && <Check className="w-4 h-4" />}</div>
          {/* Last 30 Days */}
          最近三十日
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "range",
              startDate: now.minus({ days: 59 }).toISODate()!,
              endDate: now.toISODate()!,
              wellKnown: "last-60-days",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "last-60-days" && <Check className="w-4 h-4" />}</div>
          {/* Last 60 Days */}
          最近六十日
        </DropdownMenuItem>
        {pastMinutesEnabled && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                setTime({
                  mode: "past-minutes",
                  pastMinutesStart: 30,
                  pastMinutesEnd: 0,
                  wellKnown: "last-30-minutes",
                })
              }
            >
              <div className="w-4">{time.wellKnown === "last-30-minutes" && <Check className="w-4 h-4" />}</div>
              {/* Last 30 Minutes */}
              最近三十分
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setTime({
                  mode: "past-minutes",
                  pastMinutesStart: 60,
                  pastMinutesEnd: 0,
                  wellKnown: "last-1-hour",
                })
              }
            >
              <div className="w-4">{time.wellKnown === "last-1-hour" && <Check className="w-4 h-4" />}</div>
              {/* Last 1 Hour */}
              最近一小时
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setTime({
                  mode: "past-minutes",
                  pastMinutesStart: 360,
                  pastMinutesEnd: 0,
                  wellKnown: "last-6-hours",
                })
              }
            >
              <div className="w-4">{time.wellKnown === "last-6-hours" && <Check className="w-4 h-4" />}</div>
              {/* Last 6 Hours */}
              最近六小时
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setTime({
                  mode: "past-minutes",
                  pastMinutesStart: 1440,
                  pastMinutesEnd: 0,
                  wellKnown: "last-24-hours",
                })
              }
            >
              <div className="w-4">{time.wellKnown === "last-24-hours" && <Check className="w-4 h-4" />}</div>
              {/* Last 24 Hours */}
              最近二十四小时
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "week",
              week: now.startOf("week").toISODate()!,
              wellKnown: "this-week",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "this-week" && <Check className="w-4 h-4" />}</div>
          {/* This Week */}
          本周
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "month",
              month: now.startOf("month").toISODate()!,
              wellKnown: "this-month",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "this-month" && <Check className="w-4 h-4" />}</div>
          {/* This Month */}
          本月
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const tz = getTimezone();
            const now = DateTime.now().setZone(tz);
            setTime({
              mode: "year",
              year: now.startOf("year").toISODate()!,
              wellKnown: "this-year",
            });
          }}
        >
          <div className="w-4">{time.wellKnown === "this-year" && <Check className="w-4 h-4" />}</div>
          {/* This Year */}
          本年
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            setTime({
              mode: "all-time",
              wellKnown: "all-time",
            })
          }
        >
          <div className="w-4">{time.wellKnown === "all-time" && <Check className="w-4 h-4" />}</div>
          {/* All Time */}
          全部
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <CustomDateRangePicker setTime={setTime} time={time} />
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="w-4">
              <Globe className="w-4 h-4" />
            </div>
            {getTimezoneLabel(timezone)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {timezones.map(tz => (
              <DropdownMenuItem key={tz.value} onClick={() => setTimezone(tz.value)}>
                <div className="w-4">{timezone === tz.value && <Check className="w-4 h-4" />}</div>
                {tz.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

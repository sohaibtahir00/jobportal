"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  Event,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { "en-US": enUS },
});

interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  title: string;
  type: "available" | "busy" | "selected";
}

interface WeeklyCalendarPickerProps {
  duration: number; // in minutes
  onSlotsChange: (slots: { startTime: Date; endTime: Date }[]) => void;
  busyTimes?: { start: string; end: string; title?: string }[];
  initialSlots?: { startTime: Date; endTime: Date }[];
}

export default function WeeklyCalendarPicker({
  duration,
  onSlotsChange,
  busyTimes = [],
  initialSlots = [],
}: WeeklyCalendarPickerProps) {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(
    initialSlots.map((slot, idx) => ({
      id: `slot-${idx}`,
      start: new Date(slot.startTime),
      end: new Date(slot.endTime),
      title: "Available",
      type: "selected" as const,
    }))
  );

  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Convert busy times to events
  const busyEvents: TimeSlot[] = useMemo(() => {
    return busyTimes.map((busy, idx) => ({
      id: `busy-${idx}`,
      start: new Date(busy.start),
      end: new Date(busy.end),
      title: busy.title || "Busy",
      type: "busy" as const,
    }));
  }, [busyTimes]);

  // Combine all events
  const allEvents: TimeSlot[] = useMemo(() => {
    return [...selectedSlots, ...busyEvents];
  }, [selectedSlots, busyEvents]);

  // Handle slot selection
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      const start = slotInfo.start;
      const end = new Date(start.getTime() + duration * 60000);
      const now = new Date();

      // Check if slot is in the past
      if (start < now) {
        alert("Cannot select time slots in the past. Please choose a future date and time.");
        return;
      }

      // Check if slot overlaps with busy time
      const overlappingBusy = busyEvents.find((busy) => {
        return (
          (start >= busy.start && start < busy.end) ||
          (end > busy.start && end <= busy.end) ||
          (start <= busy.start && end >= busy.end)
        );
      });

      if (overlappingBusy) {
        // Show appropriate message based on the busy event title
        if (overlappingBusy.title?.includes("Previously Scheduled")) {
          alert("⚠️ Cannot select the previously scheduled time slot.\n\nYou are rescheduling this interview, so please choose a different time.");
        } else {
          alert("This time conflicts with your Google Calendar events.");
        }
        return;
      }

      // Check if slot already selected (toggle off)
      const existingIndex = selectedSlots.findIndex(
        (slot) => slot.start.getTime() === start.getTime()
      );

      let newSlots;
      if (existingIndex >= 0) {
        // Remove slot
        newSlots = selectedSlots.filter((_, idx) => idx !== existingIndex);
      } else {
        // Add slot
        const newSlot: TimeSlot = {
          id: `slot-${Date.now()}`,
          start,
          end,
          title: "Available",
          type: "selected",
        };
        newSlots = [...selectedSlots, newSlot];
      }

      setSelectedSlots(newSlots);

      // Notify parent
      onSlotsChange(
        newSlots.map((slot) => ({
          startTime: slot.start,
          endTime: slot.end,
        }))
      );
    },
    [duration, busyEvents, selectedSlots, onSlotsChange]
  );

  // Custom event styling
  const eventStyleGetter = (event: TimeSlot) => {
    let backgroundColor = "#3b82f6"; // blue for selected
    let borderColor = "#2563eb";

    if (event.type === "busy") {
      backgroundColor = "#ef4444"; // red for busy
      borderColor = "#dc2626";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "8px",
        opacity: 0.9,
        color: "white",
        fontSize: "12px",
        boxShadow: event.type === "selected" ? "0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2)" : "0 2px 4px -1px rgba(239, 68, 68, 0.3)",
        background: event.type === "selected" ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        transition: "all 0.2s ease-in-out",
      },
    };
  };

  // Quick action buttons
  const selectAllMornings = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
    const newSlots: TimeSlot[] = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      // Mon-Fri
      const day = addDays(start, i);
      for (let hour = 9; hour < 12; hour++) {
        // 9am-12pm
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

        // Skip if slot is in the past
        if (slotStart < now) {
          continue;
        }

        // Check if not busy
        const overlaps = busyEvents.some(
          (busy) =>
            (slotStart >= busy.start && slotStart < busy.end) ||
            (slotEnd > busy.start && slotEnd <= busy.end)
        );

        if (!overlaps) {
          newSlots.push({
            id: `slot-${Date.now()}-${i}-${hour}`,
            start: slotStart,
            end: slotEnd,
            title: "Available",
            type: "selected",
          });
        }
      }
    }

    setSelectedSlots(newSlots);
    onSlotsChange(
      newSlots.map((slot) => ({ startTime: slot.start, endTime: slot.end }))
    );
  };

  const selectAllAfternoons = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const newSlots: TimeSlot[] = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const day = addDays(start, i);
      for (let hour = 14; hour < 17; hour++) {
        // 2pm-5pm
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

        // Skip if slot is in the past
        if (slotStart < now) {
          continue;
        }

        const overlaps = busyEvents.some(
          (busy) =>
            (slotStart >= busy.start && slotStart < busy.end) ||
            (slotEnd > busy.start && slotEnd <= busy.end)
        );

        if (!overlaps) {
          newSlots.push({
            id: `slot-${Date.now()}-${i}-${hour}`,
            start: slotStart,
            end: slotEnd,
            title: "Available",
            type: "selected",
          });
        }
      }
    }

    setSelectedSlots(newSlots);
    onSlotsChange(
      newSlots.map((slot) => ({ startTime: slot.start, endTime: slot.end }))
    );
  };

  const clearAll = () => {
    setSelectedSlots([]);
    onSlotsChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={selectAllMornings}
          className="group px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-blue-200 hover:border-blue-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Mornings (9am-12pm)
        </button>
        <button
          type="button"
          onClick={selectAllAfternoons}
          className="group px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-full hover:from-indigo-100 hover:to-indigo-200 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-200 hover:border-indigo-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Afternoons (2pm-5pm)
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="group px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full hover:from-gray-100 hover:to-gray-200 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg shadow-sm bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <span className="font-medium text-gray-700">Selected <span className="text-blue-600 font-semibold">({selectedSlots.length} slots)</span></span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg shadow-sm bg-gradient-to-br from-red-400 to-red-600"></div>
          <span className="font-medium text-gray-700">Busy <span className="text-gray-500">(from Google Calendar)</span></span>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white" style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: "100%" }}
          view="week"
          views={["week"]}
          date={currentWeek}
          onNavigate={(date) => setCurrentWeek(date)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            if (event.type === "selected") {
              // Remove on click
              const newSlots = selectedSlots.filter((s) => s.id !== event.id);
              setSelectedSlots(newSlots);
              onSlotsChange(
                newSlots.map((slot) => ({
                  startTime: slot.start,
                  endTime: slot.end,
                }))
              );
            }
          }}
          selectable
          step={duration}
          timeslots={1}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8am
          max={new Date(0, 0, 0, 18, 0, 0)} // 6pm
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: "h:mm a",
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer?.format(
                start,
                "h:mm a",
                culture
              )} - ${localizer?.format(end, "h:mm a", culture)}`,
          }}
        />
      </div>

      {/* Selected Slots Summary */}
      {selectedSlots.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl border border-blue-100 shadow-md">
          <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Selected Time Slots
            <span className="ml-auto text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {selectedSlots.length} {selectedSlots.length === 1 ? 'slot' : 'slots'}
            </span>
          </h3>
          <div className="space-y-2">
            {selectedSlots
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((slot) => (
                <div
                  key={slot.id}
                  className="group text-sm flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      {format(slot.start, "EEE, MMM d")}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {format(slot.start, "h:mm a")} - {format(slot.end, "h:mm a")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlots = selectedSlots.filter(
                        (s) => s.id !== slot.id
                      );
                      setSelectedSlots(newSlots);
                      onSlotsChange(
                        newSlots.map((s) => ({
                          startTime: s.start,
                          endTime: s.end,
                        }))
                      );
                    }}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium flex items-center gap-1.5 hover:scale-105 active:scale-95 transform transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

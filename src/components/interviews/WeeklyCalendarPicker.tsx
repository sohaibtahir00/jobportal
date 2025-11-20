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

      // Check if slot overlaps with busy time
      const overlaps = busyEvents.some((busy) => {
        return (
          (start >= busy.start && start < busy.end) ||
          (end > busy.start && end <= busy.end) ||
          (start <= busy.start && end >= busy.end)
        );
      });

      if (overlaps) {
        alert("This time conflicts with your Google Calendar events.");
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
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        fontSize: "12px",
      },
    };
  };

  // Quick action buttons
  const selectAllMornings = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
    const newSlots: TimeSlot[] = [];

    for (let i = 0; i < 5; i++) {
      // Mon-Fri
      const day = addDays(start, i);
      for (let hour = 9; hour < 12; hour++) {
        // 9am-12pm
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

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

    for (let i = 0; i < 5; i++) {
      const day = addDays(start, i);
      for (let hour = 14; hour < 17; hour++) {
        // 2pm-5pm
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

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
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={selectAllMornings}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
        >
          Select All Mornings (9am-12pm)
        </button>
        <button
          type="button"
          onClick={selectAllAfternoons}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
        >
          Select All Afternoons (2pm-5pm)
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Selected ({selectedSlots.length} slots)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Busy (from Google Calendar)</span>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: 600 }}>
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">
            Selected Time Slots ({selectedSlots.length})
          </h3>
          <div className="space-y-1">
            {selectedSlots
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((slot) => (
                <div
                  key={slot.id}
                  className="text-sm flex justify-between items-center"
                >
                  <span>
                    {format(slot.start, "EEE, MMM d")} •{" "}
                    {format(slot.start, "h:mm a")} -{" "}
                    {format(slot.end, "h:mm a")}
                  </span>
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
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
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

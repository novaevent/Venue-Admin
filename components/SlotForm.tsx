"use client";

import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

interface SlotFormProps {
  slot: any;
  venues: any[];
  onSave: (formData: any) => void;
  closeModal: () => void;
}

export const SlotForm = ({
  slot,
  venues,
  onSave,
  closeModal,
}: SlotFormProps) => {
  const [formData, setFormData] = useState({
    venue_id: slot?.venue_id || "",
    label: slot?.label || "",
    start_time: slot?.start_time ? new Date(slot.start_time) : null,
    end_time: slot?.end_time ? new Date(slot.end_time) : null,
    availability: slot?.availability !== undefined ? slot.availability : true,
  });

  // Auto-set end_time if start_time changes
  useEffect(() => {
    if (formData.start_time) {
      const minEndTime = new Date(
        formData.start_time.getTime() + 15 * 60 * 1000
      ); // +15 minutes
      if (!formData.end_time || formData.end_time <= formData.start_time) {
        setFormData((prev) => ({ ...prev, end_time: minEndTime }));
      }
    } else {
      setFormData((prev) => ({ ...prev, end_time: null }));
    }
  }, [formData.start_time]);

  const handleSubmit = () => {
    if (!formData.venue_id) return alert("Please select a venue");
    if (!formData.label) return alert("Please enter slot label");
    if (!formData.start_time || !formData.end_time)
      return alert("Please select start and end time");
    if (formData.end_time <= formData.start_time)
      return alert("End time must be after start time");

    onSave({
      ...formData,
      start_time: formData.start_time.toISOString(),
      end_time: formData.end_time.toISOString(),
    });
  };

  return (
    <div className="space-y-4 text-black">
      <select
        value={formData.venue_id}
        onChange={(e) =>
          setFormData({ ...formData, venue_id: Number(e.target.value) })
        }
        className={`w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          (venues?.length || 0) === 0 ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        required
        disabled={(venues?.length || 0) === 0}
      >
        <option value="" disabled>
          {(venues?.length || 0) === 0 ? "No venues available" : "Select Venue"}
        </option>
        {(venues || []).map((venue) => (
          <option key={venue.venue_id} value={venue.venue_id}>
            {venue.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Slot Label"
        value={formData.label}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Time</label>
          <DatePicker
            selected={formData.start_time}
            onChange={(date: Date | null) => {
              if (date) setFormData({ ...formData, start_time: date });
            }}
            showTimeSelect
            timeIntervals={15}
            // dateFormat="dd/MM/yyyy hh:mm aa"
            dateFormat="Pp"
            className="p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Time</label>
          <DatePicker
            selected={formData.end_time}
            onChange={(date: Date | null) => {
              if (date) setFormData({ ...formData, end_time: date });
            }}
            showTimeSelect
            timeIntervals={15}
            // dateFormat="dd/MM/yyyy hh:mm aa"
            dateFormat="Pp"
            minDate={formData.start_time || undefined}
            maxDate={formData.start_time || undefined}
            minTime={
              formData.start_time
                ? new Date(
                    formData.start_time.getFullYear(),
                    formData.start_time.getMonth(),
                    formData.start_time.getDate(),
                    formData.start_time.getHours(),
                    formData.start_time.getMinutes() + 1
                  )
                : undefined
            }
            maxTime={
              formData.start_time
                ? new Date(
                    formData.start_time.getFullYear(),
                    formData.start_time.getMonth(),
                    formData.start_time.getDate(),
                    23,
                    59,
                    59
                  )
                : undefined
            }
            disabled={!formData.start_time}
            className="p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.availability}
          onChange={(e) =>
            setFormData({ ...formData, availability: e.target.checked })
          }
          className="w-4 h-4 text-blue-600"
        />
        <span className="font-medium text-gray-700">Available</span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save size={20} />
          Save Slot
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <X size={20} />
          Cancel
        </button>
      </div>
    </div>
  );
};

import { useAppContext } from "@/contexts/AppContext";
import { formatDateTime } from "@/utils/date-uitls";
import { formatNumber } from "@/utils/number-utils";
import { Edit, Trash2, Calendar as CalendarIcon, X } from "lucide-react"; 
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

interface SlotTableProps {
  slots: any[];
  setSlots: Dispatch<SetStateAction<any>>;
  venues: any[];
  openModal: (type: any, item: any) => void;
}

const formatDateDisplay = (date: Date | null) => {
    return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date';
}

export default function SlotTable({ slots, setSlots, venues, openModal }: SlotTableProps) {
  const { url } = useAppContext();

  const [originalSlots, setOriginalSlots] = useState<any[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<any[]>([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filterVenueInput, setFilterVenueInput] = useState("");
  const [filterVenueId, setFilterVenueId] = useState("");

  const [filterStatus, setFilterStatus] = useState<string>(""); // "" means 'All'

  const venueRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState([
    { startDate: null as Date | null, endDate: null as Date | null, key: "selection" },
  ]);
  const [selectionStarted, setSelectionStarted] = useState(false);
  const startRef = useRef<Date | null>(null); // store first click startDate

  useEffect(() => {
    if (slots.length > 0) {
      setOriginalSlots(slots);
      setFilteredSlots(slots);
    }
  }, [slots]);


  useClickOutside(venueRef, () => setShowSuggestions(false));
  useClickOutside(calendarRef, () => {
    if (showCalendar) {
        setShowCalendar(false);
        setSelectionStarted(false);
        if (!dateRange[0].endDate) { 
            setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
        }
        startRef.current = null;
    }
  });
  const deleteSlot = async (slotId: string) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const res = await fetch(`${url}/slots`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId }),
      });
      if (!res.ok) toast.error("Something went wrong while deleting Slots!");
      setSlots(prev => prev.filter(s => s.slot_id !== slotId));
      setOriginalSlots(prev => prev.filter(s => s.slot_id !== slotId));
      setFilteredSlots(prev => prev.filter(s => s.slot_id !== slotId));
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

const handleSearch = () => {
  let filtered = [...originalSlots];

  if (filterVenueId) filtered = filtered.filter(s => s.venue_id === filterVenueId);

  if (filterStatus === "available") {
    filtered = filtered.filter(s => s.availability === true);
  } else if (filterStatus === "booked") {
    filtered = filtered.filter(s => s.availability === false);
  }
  
  const selectedStartDate = dateRange[0].startDate;
  const selectedEndDate = dateRange[0].endDate;

  if (selectedStartDate && selectedEndDate) {
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    start.setHours(0, 0, 0, 0);

    const endInclusive = new Date(end);
    endInclusive.setHours(23, 59, 59, 999);
  
    
    filtered = filtered.filter(s => {
      const slotTime = new Date(s.start_time);
      return slotTime >= start && slotTime <= endInclusive;
    });

  } else if (selectedStartDate) {
    const selected = new Date(selectedStartDate).toDateString();
    filtered = filtered.filter(s => new Date(s.start_time).toDateString() === selected);
   
  }

  if (filtered.length === 0) toast.error("No slots found for selected filters");

  setFilteredSlots(filtered);
};


  const resetFilters = () => {
    setFilterVenueInput("");
    setFilterVenueId("");
    setFilterStatus(""); 
    setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
    setFilteredSlots(originalSlots);
    setShowSuggestions(false);
    setShowCalendar(false);
    setSelectionStarted(false);
    startRef.current = null;
  };
  const renderDateDisplay = () => {
    const { startDate, endDate } = dateRange[0];
    
    if (!startDate) {
        return "Select Date";
    }

    const startStr = formatDateDisplay(startDate);
    
    if (endDate && startDate.toDateString() === endDate.toDateString()) {
        return startStr; 
    }
  
    if (endDate) {
        const endStr = formatDateDisplay(endDate);
        return `${startStr} - ${endStr}`; 
    }
    return `${startStr} (Selecting...)`;
  };
  
  const handleVenueClear = () => {
    setFilterVenueInput("");
    setFilterVenueId("");
    setShowSuggestions(false);
  }

  return (
    <>
      <div className="p-4 bg-white shadow-md rounded-lg mb-4 flex gap-20 items-end relative">
        
        {/* Venue Search */}
        <div className="relative" ref={venueRef}>
          <label className="block text-sm font-medium mb-1 text-gray-900">Venue</label>
          <div className="relative w-48">
            <input
              type="text"
              value={filterVenueInput}
              onChange={e => {
                setFilterVenueInput(e.target.value);
                setFilterVenueId(""); 
                setShowSuggestions(true);
              }}
              placeholder="Search venue..."
              className="border rounded-lg px-3 py-2 w-full text-gray-800 pr-8" 
            />
            {filterVenueInput && (
                <button 
                    onClick={handleVenueClear} 
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear venue selection"
                >
                    <X size={16} />
                </button>
            )}
          </div>
          {filterVenueInput && showSuggestions && (
            <ul className="absolute bg-white border border-gray-200 rounded-lg mt-1 w-48 max-h-40 overflow-y-auto shadow-xl z-50 text-gray-800">
              {venues
                .filter(v => v.name.toLowerCase().includes(filterVenueInput.toLowerCase()))
                .map(v => (
                  <li
                    key={v.venue_id}
                    onClick={() => {
                      setFilterVenueInput(v.name);
                      setFilterVenueId(v.venue_id);
                      setShowSuggestions(false);
                    }}
                    className={`px-3 py-2 cursor-pointer transition-colors ${filterVenueId === v.venue_id ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'}`}
                  >
                    {v.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Status Dropdown (NEW FILTER) */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-900">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 w-48 text-gray-800 bg-white cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%23374151'%3e%3cpath d='M3 4.5L6 7.5L9 4.5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="relative" ref={calendarRef}>
          <label className="block text-sm font-medium mb-1 text-gray-900">Date / Range</label>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="border rounded-lg w-48 px-3 py-2 text-gray-800 flex items-center justify-between"
          >
            <span className={dateRange[0].startDate ? "font" : ""}>{renderDateDisplay()}</span>
            <CalendarIcon size={18} />
          </button>
          {showCalendar && (
            <div className="absolute mt-2 z-50 bg-white shadow-xl rounded-xl">
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                minDate={new Date()}
                onChange={item => {
                  const { startDate, endDate } = item.selection;

                  if (!selectionStarted) {
                    startRef.current = startDate;
                    setDateRange([{ startDate, endDate: null, key: "selection" }]);
                    setSelectionStarted(true);
                  } else {
                    const finalEndDate = endDate || startRef.current; 
                    setDateRange([{ startDate: startRef.current, endDate: finalEndDate, key: "selection" }]);
                    setSelectionStarted(false);
                    setShowCalendar(false); 
                    console.log("Second click - full range stored:", { start: startRef.current, end: finalEndDate });
                    startRef.current = null;
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Search
        </button>
        <button onClick={resetFilters} className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition">
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-700 text-sm font-semibold">
            <th className="py-3 px-4">Label</th>
            <th className="py-3 px-4">Venue</th>
            <th className="py-3 px-4">Start Time</th>
            <th className="py-3 px-4">End Time</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredSlots.map(slot => (
            <tr key={slot.slot_id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 font-medium text-gray-900">{slot.label}</td>
              <td className="py-4 px-4 text-gray-600">
                {venues.find(v => v.venue_id === slot.venue_id)?.name || "Unknown"}
              </td>
              <td className="py-4 px-4 text-gray-600">{formatDateTime(slot.start_time)}</td>
              <td className="py-4 px-4 text-gray-600">{formatDateTime(slot.end_time)}</td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${slot.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {slot.availability ? "Available" : "Booked"}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-600">{formatNumber(slot.price, true)}</td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <button onClick={() => openModal("slot", slot)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteSlot(slot.slot_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
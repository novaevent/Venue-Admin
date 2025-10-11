import { useAppContext } from "@/contexts/AppContext";
import { formatDateTime } from "@/utils/date-uitls";
import { formatNumber } from "@/utils/number-utils";
import { Edit, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface SlotTableProps {
  slots: any[];
  setSlots: Dispatch<SetStateAction<any>>;
  venues: any[];
  openModal: (type: any, item: any) => void;
}

export default function SlotTable({
  slots,
  setSlots,
  venues,
  openModal,
}: SlotTableProps) {
  const { url } = useAppContext();

  const deleteSlot = async (slotId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this slot?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${url}/slots`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId }),
      });

      if (!res.ok) toast.error("Something went wrong while deleting Slots!");

      setSlots((prev: any) => prev.filter((s: any) => s.slot_id !== slotId));
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  return (
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
        {slots.map((slot: any) => (
          <tr key={slot.slot_id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 font-medium text-gray-900">
              {slot.label}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {venues.find((v: any) => v.venue_id === slot.venue_id)?.name ||
                "Unknown"}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatDateTime(slot.start_time)}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatDateTime(slot.end_time)}
            </td>
            <td className="py-4 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.availability
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {slot.availability ? "Available" : "Booked"}
              </span>
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatNumber(slot.price, true)}
            </td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("slot", slot)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteSlot(slot.slot_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

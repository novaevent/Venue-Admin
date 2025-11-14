import { useAppContext } from "@/contexts/AppContext";
import { Edit, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { formatDateTime } from "@/utils/date-uitls";
import toast from "react-hot-toast";

interface BookingsTableProps {
  bookings: any[];
  setBookings: Dispatch<SetStateAction<any>>;
}
export default function BookingsTable({
  bookings,
  setBookings,
}: BookingsTableProps) {
  const { url } = useAppContext();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to change the status to "${newStatus}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${url}/booking/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          status: newStatus,
        }),
      });
      if (!res.ok) {
        toast.error("Something went wrong while updating status!");
        return;
      }

      setBookings((prev: any) =>
        prev.map((b: any) =>
          b.booking_id === bookingId ? { ...b, status: newStatus } : b
        )
      );

      toast.success("Booking status updated successfully!");
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Error updating booking status");
    }
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-50 text-left text-gray-700 uppercase text-sm font-semibold">
          <th className="py-3 px-4">Venue</th>
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Label</th>
          <th className="py-3 px-4">Price</th>
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {bookings.map((booking: any) => (
          <tr
            key={booking.booking_id}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="py-4 px-4 font-medium text-gray-900">
              {booking.name}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatDateTime(booking.start_time)}
            </td>
            <td className="py-4 px-4 text-gray-600">{booking.label}</td>
            <td className="py-4 px-4 text-gray-600">₹{booking.price}</td>
            <td className="py-4 px-4 text-gray-600">{booking.customer_name}</td>
            <td className="py-4 px-4">
              <select
                className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={booking.status}
                onChange={(e) =>
                  updateBookingStatus(booking.booking_id, e.target.value)
                }
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>
            </td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toast("Edit functionality can be added here later.")
                  }
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() =>
                    toast("Delete functionality can be added here later.")
                  }
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

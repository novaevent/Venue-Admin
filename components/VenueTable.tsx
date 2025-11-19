import { useAppContext } from "@/contexts/AppContext";
import { formatNumber } from "@/utils/number-utils";
import { Edit, Trash2, ListPlus } from "lucide-react";
import { truncateString } from "@/utils/string-utils";
import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface VenueTableProps {
  venues: any[];
  setVenues: Dispatch<SetStateAction<any>>;
  openModal: (type: any, item: any) => void;
}

export default function VenueTable({
  venues,
  setVenues,
  openModal,
}: VenueTableProps) {
  const { url } = useAppContext();

  const deleteVenue = async (venueId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${url}/venue`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venue_id: venueId }),
      });

      if (!res.ok)
        toast.error("Something went wrong while Deleteing the Venue!");

      setVenues((prev: any) => prev.filter((v: any) => v.venue_id !== venueId));
    } catch (err) {
      console.error("Error deleting venue:", err);
    }
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-50 text-left text-gray-700 uppercase text-sm font-semibold">
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Location</th>
          <th className="py-3 px-4">Description</th>
          <th className="py-3 px-4">Locality</th>
          <th className="py-3 px-4">Price</th>
          <th className="py-3 px-4">Capacity</th>
          <th className="py-3 px-4">Partnership Type</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {(venues || []).map((venue: any) => (
          <tr
            key={venue.venue_id}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="py-4 px-4 font-medium text-gray-900">
              {venue.name}
            </td>
            <td className="py-4 px-4 text-gray-600">{venue.location}</td>
            <td className="py-4 px-4 text-gray-600">
              {truncateString(venue.description, 50)}
            </td>
            <td className="py-4 px-4 text-gray-600">{venue.locality}</td>
            <td className="py-4 px-4 text-gray-600">
              {formatNumber(venue.price, true)}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatNumber(venue.seating_capacity)}
            </td>
            <td className="py-4 px-4 text-gray-600">
              {formatNumber(venue.partnership_type)}
            </td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("venue", venue)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteVenue(venue.venue_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => openModal("facilities", venue)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <ListPlus size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

"use client";

import { partnershipType } from "@/constants/screen-constants";
import { Save, X } from "lucide-react";
import { useState } from "react";

interface VenueFormProps {
  venue: any;
  onSave: (formData: any) => void;
  onClose: () => void;
}

export const VenueForm = ({ venue, onSave, onClose }: VenueFormProps) => {
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    price: venue?.price || "",
    partnership_type: venue?.partnership_type || "",
    location: venue?.location || "",
    description: venue?.description || "",
    seating_capacity: venue?.seating_capacity || "",
    parking_capacity: venue?.parking_capacity || "",
    hall_seating_capacity: venue?.hall_seating_capacity || "",
    dining_seating_capacity: venue?.dining_seating_capacity || "",
    room_capacity: venue?.room_capacity || "",
    floating_capacity: venue?.floating_capacity || "",
    thumbnail_image_url: venue?.thumbnail_image_url || "",
  });

  const handleSubmit = () => onSave(formData);

  return (
    <div className="space-y-6 text-black">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Venue Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className=" no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <select
        value={formData.partnership_type}
        onChange={(e) =>
          setFormData({ ...formData, partnership_type: e.target.value })
        }
        className={`w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        required
      >
        <option key={"Standard"} value={partnershipType.STANDARD}>
          Standard
        </option>
        <option key={"Priority"} value={partnershipType.PRIORITY}>
          Priority
        </option>
      </select>

      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />

      {/* Capacities */}
      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Seating Capacity"
          value={formData.seating_capacity}
          onChange={(e) =>
            setFormData({ ...formData, seating_capacity: e.target.value })
          }
          className=" no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Parking Capacity"
          value={formData.parking_capacity}
          onChange={(e) =>
            setFormData({ ...formData, parking_capacity: e.target.value })
          }
          className=" no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Hall Seating"
          value={formData.hall_seating_capacity}
          onChange={(e) =>
            setFormData({
              ...formData,
              hall_seating_capacity: e.target.value,
            })
          }
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Dining Seating"
          value={formData.dining_seating_capacity}
          onChange={(e) =>
            setFormData({
              ...formData,
              dining_seating_capacity: e.target.value,
            })
          }
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Room Capacity"
          value={formData.room_capacity}
          onChange={(e) =>
            setFormData({ ...formData, room_capacity: e.target.value })
          }
          className=" no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Floating Capacity"
          value={formData.floating_capacity}
          onChange={(e) =>
            setFormData({ ...formData, floating_capacity: e.target.value })
          }
          className=" no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <input
        type="url"
        placeholder="Thumbnail Image URL"
        value={formData.thumbnail_image_url}
        onChange={(e) =>
          setFormData({ ...formData, thumbnail_image_url: e.target.value })
        }
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Save size={20} /> Save Venue
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
        >
          <X size={20} /> Cancel
        </button>
      </div>
    </div>
  );
};

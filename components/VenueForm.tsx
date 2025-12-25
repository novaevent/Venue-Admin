"use client";

import { partnershipType } from "@/constants/screen-constants";
import { Save, X } from "lucide-react";
import { useState, useEffect } from "react";

interface VenueFormProps {
  venue: any;
  onSave: (formData: any) => void;
  onClose: () => void;
}

interface VenueFormData {
  name: string;
  price: string;
  partnership_type: string;
  location: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  locality: string;
  pincode: string;
  description: string;
  seating_capacity: string;
  parking_capacity: string;
  hall_seating_capacity: string;
  dining_seating_capacity: string;
  room_capacity: string;
  floating_capacity: string;
  thumbnail_image_file?: File;
  latitude?: string;
  longitude?: string;
}

export const VenueForm = ({ venue, onSave, onClose }: VenueFormProps) => {
  const [formData, setFormData] = useState<VenueFormData>({
    name: venue?.name || "",
    price: venue?.price || "",
    partnership_type: venue?.partnership_type || partnershipType.STANDARD,
    location: venue?.location || "",
    address_line_1: venue?.address_line_1 || "",
    address_line_2: venue?.address_line_2 || "",
    address_line_3: venue?.address_line_3 || "",
    locality: venue?.locality || "",
    pincode: venue?.pincode || "",
    description: venue?.description || "",
    seating_capacity: venue?.seating_capacity || "",
    parking_capacity: venue?.parking_capacity || "",
    hall_seating_capacity: venue?.hall_seating_capacity || "",
    dining_seating_capacity: venue?.dining_seating_capacity || "",
    room_capacity: venue?.room_capacity || "",
    floating_capacity: venue?.floating_capacity || "",
    thumbnail_image_file: undefined,
    latitude: venue?.latitude || "",
    longitude: venue?.longitude || "",
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid =
      formData.name.trim() !== "" &&
      formData.price !== "" &&
      !isNaN(Number(formData.price)) &&
      formData.partnership_type.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.description.trim() !== "" &&
      [
        formData.seating_capacity,
        formData.parking_capacity,
        formData.hall_seating_capacity,
        formData.dining_seating_capacity,
        formData.room_capacity,
        formData.floating_capacity,
      ].every((v) => v !== "" && !isNaN(Number(v)));
    setIsValid(valid);
  }, [formData]);

  const handleSubmit = () => onSave(formData);

  return (
    <div className="space-y-6 text-black">
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
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <select
        value={formData.partnership_type}
        onChange={(e) =>
          setFormData({ ...formData, partnership_type: e.target.value })
        }
        className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      >
        <option value={partnershipType.STANDARD}>Standard</option>
        <option value={partnershipType.PRIORITY}>Priority</option>
      </select>

      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Address Line 1"
        value={formData.address_line_1}
        onChange={(e) =>
          setFormData({ ...formData, address_line_1: e.target.value })
        }
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Address Line 2"
        value={formData.address_line_2}
        onChange={(e) =>
          setFormData({ ...formData, address_line_2: e.target.value })
        }
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Address Line 3"
        value={formData.address_line_3}
        onChange={(e) =>
          setFormData({ ...formData, address_line_3: e.target.value })
        }
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Locality"
        value={formData.locality}
        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Latitude"
        value={formData.latitude}
        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={formData.longitude}
        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
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

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Seating Capacity"
          value={formData.seating_capacity}
          onChange={(e) =>
            setFormData({ ...formData, seating_capacity: e.target.value })
          }
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Parking Capacity"
          value={formData.parking_capacity}
          onChange={(e) =>
            setFormData({ ...formData, parking_capacity: e.target.value })
          }
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
          type="number"
          placeholder="Floating Capacity"
          value={formData.floating_capacity}
          onChange={(e) =>
            setFormData({ ...formData, floating_capacity: e.target.value })
          }
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFormData({
              ...formData,
              thumbnail_image_file: e.target.files[0],
            });
          }
        }}
        className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleSubmit}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
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

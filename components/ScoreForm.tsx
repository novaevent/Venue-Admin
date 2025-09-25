"use client";

import { Save, X } from "lucide-react";
import { useState } from "react";

interface ScoreFormProps {
  score: any;
  venues: any[];
  onSave: (formData: any) => void;
  onClose: () => void;
}

export const ScoreForm = ({
  score,
  venues,
  onSave,
  onClose,
}: ScoreFormProps) => {
  const [formData, setFormData] = useState({
    venue_id: score?.venue_id || "",
    cleanliness: score?.cleanliness || "",
    location: score?.location || "",
    hygiene: score?.hygiene || "",
    check_in: score?.check_in || "",
    overall: score?.overall || "",
  });

  const handleChange = (field: string, value: string) => {
    // Ensure value is numeric and capped at 5
    let numericValue: number | null = parseFloat(value);
    if (isNaN(numericValue)) numericValue = null;
    else if (numericValue > 5) numericValue = 5;
    else if (numericValue < 0) numericValue = 0;

    setFormData({ ...formData, [field]: numericValue });
  };

  const handleSubmit = () => {
    // Check all fields are filled
    if (!formData.venue_id) {
      alert("Please select a venue");
      return;
    }

    // List of rating fields
    const ratingFields: (keyof typeof formData)[] = [
      "cleanliness",
      "location",
      "hygiene",
      "check_in",
      "overall",
    ];

    for (const field of ratingFields) {
      const value = formData[field];
      if (value === "" || value === null || value === undefined) {
        alert(`Please provide a value for ${field}`);
        return;
      }
      if (typeof value === "number" && (value < 0 || value > 5)) {
        alert(`${field} must be between 0 and 5`);
        return;
      }
    }

    onSave(formData);
  };
  return (
    <div className="space-y-4 text-black">
      <select
        value={formData.venue_id}
        onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200"
        required
      >
        <option value="">Select Venue</option>
        {(venues || []).map((venue: any) => (
          <option key={venue.venue_id} value={venue.venue_id}>
            {venue.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Cleanliness (0-5)"
          value={formData.cleanliness}
          onChange={(e) => handleChange("cleanliness", e.target.value)}
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Location (0-5)"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Hygiene (0-5)"
          value={formData.hygiene}
          onChange={(e) => handleChange("hygiene", e.target.value)}
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Check-in (0-5)"
          value={formData.check_in}
          onChange={(e) => handleChange("check_in", e.target.value)}
          className="no-spinner p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <input
        type="number"
        step="0.1"
        min="0"
        max="5"
        placeholder="Overall Rating (0-5)"
        value={formData.overall}
        onChange={(e) => handleChange("overall", e.target.value)}
        className="no-spinner w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Save size={20} />
          Save Rating
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <X size={20} />
          Cancel
        </button>
      </div>
    </div>
  );
};

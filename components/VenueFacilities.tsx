import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  venue: any;
  url: string;
  close: () => void;
}
export default function FacilitiesModal({ venue, url, close }: Props) {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all facilities + selected facility IDs for this venue
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch all facilities
        const facRes = await fetch(`${url}/facilities`);
        const facData = await facRes.json();
        setFacilities(facData.facilities || []);

        // 2. Fetch selected facility ids for this venue
        const idsRes = await fetch(
          `${url}/venues/facilities/ids/${venue.venue_id}`
        );
        const idsData = await idsRes.json();

        setSelected(idsData || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load facilities");
      }
    }

    loadData();
  }, []);

  // Toggle selected checkbox
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // Save selected facility IDs
  const saveFacilities = async () => {
    setLoading(true);

    const body = {
      venue_id: venue.venue_id,
      facility_ids: selected,
    };

    try {
      const res = await fetch(`${url}/venues/facilities/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error("Failed to update facilities");
      } else {
        toast.success("Facilities updated successfully");
        close();
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center  text-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          Manage Facilities for {venue.name}
        </h2>

        <div className="max-h-64 overflow-auto border rounded-md p-3  text-gray-900">
          {facilities.map((f) => (
            <label
              key={f.facility_id}
              className="flex items-center gap-2 py-1 cursor-pointer  text-gray-900"
            >
              <input
                type="checkbox"
                checked={selected.includes(f.facility_id)}
                onChange={() => toggleSelect(f.facility_id)}
              />
              {f.facility_label}
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-5 gap-2  text-gray-900">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-200 rounded-md  text-gray-900"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={saveFacilities}
            className="px-4 py-2 bg-green-600 text-white rounded-md  text-gray-900"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

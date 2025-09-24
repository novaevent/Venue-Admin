import { Edit, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface ScoreTableProps {
  scores: any[];
  setScores: Dispatch<SetStateAction<any>>;
  venues: any[];
  openModal: (type: any, item: any) => void;
}

export default function ScoresTable({
  scores,
  setScores,
  venues,
  openModal,
}: ScoreTableProps) {
  const deleteScore = async (ratingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this score?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating_id: ratingId }),
      });

      if (!res.ok) toast.error("Something went wrong while deleteing Review!");

      setScores((prev: any) =>
        prev.filter((s: any) => s.rating_id !== ratingId)
      );
    } catch (err) {
      console.error("Error deleting score:", err);
    }
  };

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-50 text-left text-gray-700 uppercase text-sm font-semibold">
          <th className="py-3 px-4">Venue</th>
          <th className="py-3 px-4">Cleanliness</th>
          <th className="py-3 px-4">Location</th>
          <th className="py-3 px-4">Hygiene</th>
          <th className="py-3 px-4">Check-in</th>
          <th className="py-3 px-4">Overall</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {scores.map((score: any) => (
          <tr
            key={score.rating_id}
            className="hover:bg-gray-50 transition-colors"
          >
            <td className="py-4 px-4 font-medium text-gray-900">
              {venues.find((v: any) => v.venue_id === score.venue_id)?.name ||
                "Unknown"}
            </td>
            <td className="py-4 px-4 text-gray-600">{score.cleanliness}/5</td>
            <td className="py-4 px-4 text-gray-600">{score.location}/5</td>
            <td className="py-4 px-4 text-gray-600">{score.hygiene}/5</td>
            <td className="py-4 px-4 text-gray-600">{score.check_in}/5</td>
            <td className="py-4 px-4">
              <span className="font-semibold text-yellow-600">
                {score.overall}/5
              </span>
            </td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("score", score)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteScore(score.rating_id)}
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

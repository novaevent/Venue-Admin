"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, Edit, Trash2, MapPin, Clock, Star, X } from "lucide-react";
import { formatNumber } from "@/utils/number-utils";
import { formatDateTime } from "@/utils/date-uitls";
import Modal from "@/components/Modal";
import Header from "@/components/Header";

const VenueAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"venues" | "slots" | "scores">(
    "venues"
  );
  const [venues, setVenues] = useState<any>([]);
  const [slots, setSlots] = useState<any>([]);
  const [scores, setScores] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState<"venue" | "slot" | "score">(
    "venue"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesRes, slotsRes, scoresRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/venues`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/slot`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/score`),
      ]);

      const venuesData = await venuesRes.json();
      const slotsData = await slotsRes.json();
      const scoresData = await scoresRes.json();

      setVenues(venuesData.venues);
      setSlots(slotsData.slots || []);
      setScores(scoresData.scores || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = (type: any, item = null) => {
    if (type === "score") {
      // Check if venues and scores exist
      const availableVenues = (venues || []).filter(
        (venue: any) =>
          !(scores || []).some(
            (score: any) => score.venue_id === venue.venue_id
          )
      );

      if (availableVenues.length === 0) {
        toast.error("Rating is already added for all available venues.");
        return;
      }
    }

    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Delete Venue with confirmation
  const deleteVenue = async (venueId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venue`, {
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

  // Delete Slots
  const deleteSlot = async (slotId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this slot?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slots`, {
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

  // Delete Score
  const deleteScore = async (ratingId: number) => {
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

  const tabs: {
    key: "venues" | "slots" | "scores";
    label: string;
    icon: any;
  }[] = [
    { key: "venues", label: "Venues", icon: MapPin },
    { key: "slots", label: "Time Slots", icon: Clock },
    { key: "scores", label: "Ratings", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full mb-6 shadow-inner">
          {/*
      Define the tabs array outside of JSX mapping so TypeScript
      correctly infers the key types
    */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isDisabled =
              (tab.key === "slots" || tab.key === "scores") &&
              (!venues || venues.length === 0);
            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (isDisabled) {
                    toast.error("Please add venues first!");
                    return;
                  }
                  setActiveTab(tab.key); // ✅ TS safe
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300
            ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-md scale-105"
                : "text-gray-600 hover:text-gray-900"
            }
            ${
              isDisabled
                ? "cursor-not-allowed opacity-50 hover:text-gray-600"
                : ""
            }
          `}
                disabled={isDisabled}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Box */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeTab === "venues" && "Venues"}
            {activeTab === "slots" && "Time Slots"}
            {activeTab === "scores" && "Ratings"}
          </h2>
          <button
            onClick={() => openModal(activeTab.slice(0, -1))}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add{" "}
            {activeTab === "venues"
              ? "Venue"
              : activeTab === "slots"
              ? "Slot"
              : "Rating"}
          </button>
        </div>

        {/* Tables */}
        <div className="p-6 overflow-x-auto">
          {/* Venues */}
          {activeTab === "venues" && (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-700 uppercase text-sm font-semibold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Capacity</th>
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
                    <td className="py-4 px-4 text-gray-600">
                      {venue.location}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatNumber(venue.price, true)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatNumber(venue.seating_capacity)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Slots */}
          {activeTab === "slots" && (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-700 uppercase text-sm font-semibold">
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {slots.map((slot: any) => (
                  <tr
                    key={slot.slot_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {slot.label}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {venues.find((v: any) => v.venue_id === slot.venue_id)
                        ?.name || "Unknown"}
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
          )}

          {/* Scores */}
          {activeTab === "scores" && (
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
                      {venues.find((v: any) => v.venue_id === score.venue_id)
                        ?.name || "Unknown"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {score.cleanliness}/5
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {score.location}/5
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {score.hygiene}/5
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {score.check_in}/5
                    </td>
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
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          venues={venues}
          slots={slots}
          scores={scores}
          setVenues={setVenues}
          setSlots={setSlots}
          setScores={setScores}
          onClose={closeModal}
          modalType={modalType}
          editingItem={editingItem}
        />
      )}
    </div>
  );
};

export default VenueAdminDashboard;

"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, MapPin, Clock, Star, CalendarCheck } from "lucide-react";
import Modal from "@/components/Modal";
import Header from "@/components/Header";
import VenueTable from "@/components/VenueTable";
import SlotTable from "@/components/SlotTable";
import ScoresTable from "@/components/ScoresTable";
import BookingsTable from "@/components/BookingTable";
import { useAppContext } from "@/contexts/AppContext";

const VenueAdminDashboard = () => {
  const { url } = useAppContext();

  const [activeTab, setActiveTab] = useState<
    "venues" | "slots" | "scores" | "bookings"
  >("venues");
  const [venues, setVenues] = useState<any>([]);
  const [slots, setSlots] = useState<any>([]);
  const [scores, setScores] = useState<any>([]);
  const [bookings, setBookings] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState<
    "venue" | "slot" | "score" | "bookings"
  >("venue");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesRes, slotsRes, scoresRes, bookingsRes] = await Promise.all([
        fetch(`${url}/venues`),
        fetch(`${url}/slot`),
        fetch(`${url}/score`),
        fetch(`${url}/booking/details`),
      ]);

      const venuesData = await venuesRes.json();
      const slotsData = await slotsRes.json();
      const scoresData = await scoresRes.json();
      const bookingsData = await bookingsRes.json();

      setVenues(venuesData.venues);
      setSlots(slotsData.slots || []);
      setScores(scoresData.scores || []);
      setBookings(bookingsData || []);
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

  const tabs: {
    key: "venues" | "slots" | "scores" | "bookings";
    label: string;
    icon: any;
  }[] = [
    { key: "venues", label: "Venues", icon: MapPin },
    { key: "slots", label: "Time Slots", icon: Clock },
    { key: "scores", label: "Ratings", icon: Star },
    { key: "bookings", label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full mb-6 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isDisabled =
              (tab.key === "slots" ||
                tab.key === "scores" ||
                tab.key === "bookings") &&
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

      {/* Content Box - */}
      <div className="max-w-7xl mx-auto rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeTab === "venues" && "Venues"}
            {activeTab === "slots" && "Time Slots"}
            {activeTab === "scores" && "Ratings"}
            {activeTab === "bookings" && "Bookings"}
          </h2>
          {activeTab !== "bookings" && (
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
          )}
        </div>

        {/* Tables */}
        <div className="p-6 overflow-x-auto">
          {/* Venues */}
          {activeTab === "venues" && (
            <VenueTable
              venues={venues}
              setVenues={setVenues}
              openModal={openModal}
            />
          )}
          {/* Slots */}
          {activeTab === "slots" && (
            <SlotTable
              slots={slots}
              setSlots={setSlots}
              venues={venues}
              openModal={openModal}
            />
          )}
          {/* Scores */}
          {activeTab === "scores" && (
            <ScoresTable
              scores={scores}
              setScores={setScores}
              venues={venues}
              openModal={openModal}
            />
          )}
          {/* Bookings */}
          {activeTab === "bookings" && (
            <BookingsTable bookings={bookings} setBookings={setBookings} />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          venues={venues}
          slots={slots}
          scores={scores}
          bookings={bookings}
          setVenues={setVenues}
          setSlots={setSlots}
          setScores={setScores}
          setBookings={setBookings}
          onClose={closeModal}
          modalType={modalType}
          editingItem={editingItem}
        />
      )}
    </div>
  );
};

export default VenueAdminDashboard;

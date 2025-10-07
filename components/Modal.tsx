"use client";

import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

import { X } from "lucide-react";

import { VenueForm } from "./VenueForm";
import { SlotForm } from "./SlotForm";
import { ScoreForm } from "./ScoreForm";
import { useAppContext } from "@/contexts/AppContext";

interface ModalProps {
  editingItem: any;
  modalType: "venue" | "slot" | "score";
  onClose: () => void;
  venues: any;
  setVenues: Dispatch<SetStateAction<any>>;
  slots: any;
  setSlots: Dispatch<SetStateAction<any>>;
  scores: any;
  setScores: Dispatch<SetStateAction<any>>;
}

export default function Modal({
  editingItem,
  modalType,
  onClose,
  venues,
  setVenues,
  slots,
  setSlots,
  scores,
  setScores,
}: ModalProps) {
  const { url } = useAppContext();

  const addVenue = async (formData: any) => {
    try {
      const venueData = {
        name: formData.name,
        price: Number(formData.price),
        location: formData.location,
        description: formData.description,
        partnership_type: formData?.partnership_type,
        seating_capacity: Number(formData.seating_capacity),
        parking_capacity: Number(formData.parking_capacity),
        hall_seating_capacity: Number(formData.hall_seating_capacity),
        dining_seating_capacity: Number(formData.dining_seating_capacity),
        room_capacity: Number(formData.room_capacity),
        floating_capacity: Number(formData.floating_capacity),
        facilities: [],
      };

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("location", formData.location);
      payload.append("description", formData.description);
      payload.append("partnership_type", formData.partnership_type);
      payload.append("seating_capacity", formData.seating_capacity);
      payload.append("parking_capacity", formData.parking_capacity);
      payload.append("hall_seating_capacity", formData.hall_seating_capacity);
      payload.append(
        "dining_seating_capacity",
        formData.dining_seating_capacity
      );
      payload.append("room_capacity", formData.room_capacity);
      payload.append("floating_capacity", formData.floating_capacity);

      if (formData.thumbnail_image_file) {
        payload.append("thumbnail_image", formData.thumbnail_image_file);
      }

      const res = await fetch(`${url}/venues`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) toast.error("Something went wrong while adding Venue!");

      setVenues((prev: any) => [...(prev || []), venueData]);
      onClose();
    } catch (err) {
      console.error("Error adding venue:", err);
    }
  };

  const addSlot = async (formData: any) => {
    try {
      const requestData = {
        venue_id: formData.venue_id,
        label: formData.label,
        start_time: formData.start_time,
        end_time: formData.end_time,
        availability: formData.availability,
      };

      const res = await fetch(`${url}/slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) toast.error("Something went wrong while adding Slots!");

      setSlots((prev: any) => [...prev, requestData]);
      onClose();
    } catch (err) {
      console.error("Error adding slot:", err);
    }
  };

  const addScore = async (formData: any) => {
    try {
      const requestData = {
        venue_id: formData.venue_id,
        cleanliness: Number(formData.cleanliness),
        location: Number(formData.location),
        hygiene: Number(formData.hygiene),
        check_in: Number(formData.check_in),
        overall: Number(formData.overall),
      };

      const res = await fetch(`${url}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) toast.error("Something went wrong while adding Score!");

      setScores((prev: any) => [...prev, requestData]);
      onClose();
    } catch (err) {
      console.error("Error adding score:", err);
    }
  };

  const updateVenue = async (venueId: string, formData: any) => {
    try {
      const venueData = {
        name: formData.name,
        price: Number(formData.price),
        location: formData.location,
        description: formData.description,
        partnership_type: formData?.partnership_type,
        seating_capacity: Number(formData.seating_capacity),
        parking_capacity: Number(formData.parking_capacity),
        hall_seating_capacity: Number(formData.hall_seating_capacity),
        dining_seating_capacity: Number(formData.dining_seating_capacity),
        room_capacity: Number(formData.room_capacity),
        floating_capacity: Number(formData.floating_capacity),
        facilities: [],
      };

      const payload = new FormData();

      payload.append("venue_id", venueId);
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("location", formData.location);
      payload.append("description", formData.description);
      payload.append("partnership_type", formData.partnership_type);
      payload.append("seating_capacity", formData.seating_capacity);
      payload.append("parking_capacity", formData.parking_capacity);
      payload.append("hall_seating_capacity", formData.hall_seating_capacity);
      payload.append(
        "dining_seating_capacity",
        formData.dining_seating_capacity
      );
      payload.append("room_capacity", formData.room_capacity);
      payload.append("floating_capacity", formData.floating_capacity);

      if (formData.thumbnail_image_file) {
        payload.append("thumbnail_image", formData.thumbnail_image_file);
      }

      const printFormDataAsJSON = (formData: FormData) => {
        const obj: Record<string, any> = {};
        formData.forEach((value, key) => {
          obj[key] = value;
        });
        console.log(JSON.stringify(obj, null, 2));
      };
      printFormDataAsJSON(payload);

      const res = await fetch(`${url}/venue`, {
        method: "PUT",
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to update venue");

      setVenues((prev: any) =>
        prev.map((v: any) => (v.venue_id === venueId ? venueData : v))
      );
      onClose();
    } catch (err) {
      console.error("Error updating venue:", err);
    }
  };

  const updateSlot = async (slotId: string, formData: any) => {
    try {
      const requestData = {
        slot_id: slotId,
        venue_id: formData.venue_id,
        label: formData.label,
        start_time: formData.start_time,
        end_time: formData.end_time,
        availability: formData.availability,
      };

      const res = await fetch(`${url}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) toast.error("Something went wrong while updating Slots!");

      setSlots((prev: any) =>
        prev.map((s: any) => (s.slot_id === slotId ? requestData : s))
      );
      onClose();
    } catch (err) {
      console.error("Error updating slot:", err);
    }
  };

  const updateScore = async (ratingId: string, formData: any) => {
    try {
      const requestData = {
        rating_id: ratingId,
        venue_id: formData.venue_id,
        cleanliness: Number(formData.cleanliness),
        location: Number(formData.location),
        hygiene: Number(formData.hygiene),
        check_in: Number(formData.check_in),
        overall: Number(formData.overall),
      };

      const res = await fetch(`${url}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) throw new Error("Failed to update score");

      setScores((prev: any) =>
        prev.map((s: any) => (s.rating_id === ratingId ? requestData : s))
      );
      onClose();
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingItem ? "Edit" : "Add"}{" "}
            {modalType === "venue"
              ? "Venue"
              : modalType === "slot"
              ? "Time Slot"
              : "Rating"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {modalType === "venue" && (
            <VenueForm
              venue={editingItem}
              onSave={(data) => {
                if (editingItem?.venue_id)
                  updateVenue(editingItem.venue_id, data);
                else addVenue(data);
              }}
              onClose={onClose}
            />
          )}
          {modalType === "slot" && (
            <SlotForm
              slot={editingItem}
              venues={venues}
              closeModal={onClose}
              onSave={(data) => {
                if (editingItem?.slot_id) updateSlot(editingItem.slot_id, data);
                else addSlot(data);
              }}
            />
          )}
          {modalType === "score" && (
            <ScoreForm
              score={editingItem}
              venues={venues}
              onSave={(data) => {
                if (editingItem?.rating_id)
                  updateScore(editingItem.rating_id, data);
                else addScore(data);
              }}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

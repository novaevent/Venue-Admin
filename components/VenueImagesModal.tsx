import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Upload } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

interface Props {
  venue: any;
  onClose: () => void;
}

export default function VenueImagesModal({ venue, onClose }: Props) {
  const { url } = useAppContext();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const venueId = venue.venue_id;
  console.log("Venue ID:", venueId);


  // 🔹 Fetch images
  const fetchImages = async () => {
    try {
      const res = await fetch(`${url}/venues/${venueId}/images`);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast.error("Failed to load images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 🔹 Upload images
  const uploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Select images first");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) =>
      formData.append("images", file)
    );

    setLoading(true);
    try {
      const res = await fetch(
        `${url}/venues/${venueId}/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();
      toast.success("Images uploaded");
      setSelectedFiles(null);
      fetchImages();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete images (multiple)
  const deleteImages = async (fileNames: string[]) => {
    try {
      const res = await fetch(
        `${url}/venues/${venueId}/images`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileNames }),
        }
      );

      if (!res.ok) throw new Error();
      toast.success("Image deleted");
      fetchImages();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[700px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Images – {venue.name}
          </h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Upload Section */}
        <div className="flex items-center gap-3 mb-6">
          {/* Hidden file input */}
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="hidden"
          />

          {/* Gray choose file button */}
          <label
            htmlFor="imageUpload"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer
                      hover:bg-gray-300 transition text-sm"
          >
            {selectedFiles && selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : "Choose files"}
          </label>

          {/* Upload button */}
          <button
            onClick={uploadImages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600
                      text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <p className="text-gray-500 text-sm">No images uploaded</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {images.map((img) => {
              const fileName = img.split("/").pop()!;

              return (
                <div
                  key={img}
                  className="relative group border rounded overflow-hidden"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => deleteImages([fileName])}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

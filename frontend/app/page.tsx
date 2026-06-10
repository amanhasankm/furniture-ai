"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [detectedImage, setDetectedImage] = useState("");
  const [detections, setDetections] = useState<any[]>([]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));

      setMessage("");
      setDetectedImage("");
      setDetections([]);
    }
  };

  const handleUpload = async () => {

    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8001/upload",
        formData
      );

      setMessage(response.data.message);
      setDetectedImage(response.data.detected_image);
      setDetections(response.data.detections);

    } catch (error) {

      console.error(error);
      setMessage("Upload failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] flex flex-col items-center justify-center px-6 py-16">

      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-12">

        <h1 className="text-6xl font-bold tracking-tight text-black mb-6">
          Furniture AI Matcher
        </h1>

        <p className="text-gray-600 text-xl leading-relaxed">
          Upload your interior render and discover matching furniture
          products using AI-powered visual detection.
        </p>

      </div>

      {/* Upload Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-3xl">

        {/* Upload Area */}
        <label className="border-2 border-dashed border-gray-300 rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all duration-300">

          <div className="text-center">

            <p className="text-2xl font-semibold mb-3">
              Drag & Drop Image
            </p>

            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="bg-black text-white px-5 py-3 rounded-xl inline-block">
              Select Image
            </div>

          </div>

        </label>

        {/* Original Preview */}
        {preview && (
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Original Image
            </h2>

            <img
              src={preview}
              alt="Preview"
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              {loading ? "Analyzing..." : "Analyze Furniture"}
            </button>

          </div>
        )}

        {/* AI Detection Result */}
        {detectedImage && (
          <div className="mt-12">

            <h2 className="text-3xl font-bold mb-6 text-center">
              AI Detection Result
            </h2>

            <img
              src={detectedImage}
              alt="Detected"
              className="w-full rounded-2xl shadow-2xl border"
            />

          </div>
        )}

        {/* Detected Furniture List */}
        {detections.length > 0 && (
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              Detected Furniture
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {detections.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-2xl p-5"
                >

                  <p className="text-xl font-semibold capitalize">
                    {item.class}
                  </p>

                  <p className="text-gray-600 mt-2">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </p>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mt-6 text-center">

            <p className="text-lg font-medium text-green-600">
              {message}
            </p>

          </div>
        )}

      </div>

    </main>
  );
}
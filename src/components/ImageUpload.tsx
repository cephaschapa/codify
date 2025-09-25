"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-[1.02]
          ${
            isDragActive
              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50"
              : "border-gray-300 hover:border-blue-400 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 shadow-lg hover:shadow-xl"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-6">
          {isDragActive ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-ping"></div>
                </div>
                <Upload className="relative mx-auto h-12 w-12 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-600">
                  Drop your design here
                </p>
                <p className="text-sm text-blue-500 mt-1">Release to upload</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-50"></div>
                </div>
                <ImageIcon className="relative mx-auto h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-3">
                <p className="text-xl font-semibold text-gray-900">
                  Upload your design snapshot
                </p>
                <p className="text-gray-600 max-w-md mx-auto">
                  Drag and drop your design mockup here, or click the button
                  below to browse your files
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Choose File
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 py-2">
          <span>Supports:</span>
          <div className="flex gap-2">
            {["PNG", "JPG", "JPEG", "GIF", "BMP", "WebP"].map((format) => (
              <span
                key={format}
                className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

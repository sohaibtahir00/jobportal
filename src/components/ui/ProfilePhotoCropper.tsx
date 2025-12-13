"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "./Button";
import { X, ZoomIn, ZoomOut, RotateCw, Trash2, Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePhotoCropperProps {
  currentPhotoUrl?: string | null;
  onSave: (croppedImageBlob: Blob) => Promise<void>;
  onRemove?: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** User's name for showing initials in empty state */
  userName?: string;
}

// Helper function to create cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to the crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      "image/jpeg",
      0.9
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

export function ProfilePhotoCropper({
  currentPhotoUrl,
  onSave,
  onRemove,
  disabled = false,
  size = "lg",
  userName,
}: ProfilePhotoCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-28 w-28",
    lg: "h-32 w-32",
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsModalOpen(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      });
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onSave(croppedBlob);
      setIsModalOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    setIsRemoving(true);
    try {
      await onRemove();
    } catch (error) {
      console.error("Error removing photo:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Get user initial for empty state
  const userInitial = userName?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* Photo Display with compact actions */}
      <div className="relative group">
        {/* Main photo/avatar circle */}
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="Profile"
            className={cn(
              sizeClasses[size],
              "rounded-full object-cover border-4 border-white shadow-lg"
            )}
          />
        ) : (
          <div
            className={cn(
              sizeClasses[size],
              "rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg"
            )}
          >
            {userInitial}
          </div>
        )}

        {/* Upload overlay on hover */}
        <label
          className={cn(
            "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
            disabled && "cursor-not-allowed opacity-0"
          )}
        >
          <Camera className="h-6 w-6 text-white" />
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </label>

        {/* Small camera button at bottom-right */}
        <label
          className={cn(
            "absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700 shadow-lg transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <Camera className="h-4 w-4 text-white" />
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </label>

        {/* Remove button - only show when photo exists */}
        {currentPhotoUrl && onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || isRemoving}
            className={cn(
              "absolute top-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-danger-50 transition-colors opacity-0 group-hover:opacity-100",
              "border border-secondary-200 hover:border-danger-300",
              (disabled || isRemoving) && "cursor-not-allowed opacity-50"
            )}
            title="Remove photo"
          >
            <Trash2 className="h-3.5 w-3.5 text-danger-600" />
          </button>
        )}
      </div>

      {/* Crop Modal */}
      {isModalOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                Crop Your Photo
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-secondary-500" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="relative h-80 bg-secondary-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 bg-secondary-50 space-y-4">
              {/* Zoom Control */}
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-secondary-500" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <ZoomIn className="h-4 w-4 text-secondary-500" />
              </div>

              {/* Rotation Control */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                >
                  <RotateCw className="h-4 w-4 mr-2 -scale-x-100" />
                  Rotate Left
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate Right
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Photo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

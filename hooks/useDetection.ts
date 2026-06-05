import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { createDetection, getAIRecommendation } from '@/lib/api';
import type { DetectionResult, AIRecommendation } from '@/types';

export function useDetection() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const detectImage = async (file: File) => {
    setError(null);
    setDetectionResult(null);
    setRecommendation(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      const { image_URL, cloudinary_public_id } = await uploadToCloudinary(file);
      setIsUploading(false);

      setIsDetecting(true);
      const result = await createDetection(image_URL, cloudinary_public_id);
      setDetectionResult(result);
      setIsDetecting(false);

      setIsLoadingRecommendation(true);
      const rec = await getAIRecommendation([
        { label: result.label, confidence: result.confidence },
      ]);
      setRecommendation(rec);
      setIsLoadingRecommendation(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(message);
      setIsUploading(false);
      setIsDetecting(false);
      setIsLoadingRecommendation(false);
    }
  };

  const reset = () => {
    setDetectionResult(null);
    setRecommendation(null);
    setPreviewUrl(null);
    setError(null);
  };

  return {
    isUploading,
    isDetecting,
    isLoadingRecommendation,
    detectionResult,
    recommendation,
    error,
    previewUrl,
    detectImage,
    reset,
  };
}
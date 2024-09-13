import React, { useState, useRef, useCallback, useEffect } from "react";
import { AlertType } from "../types/alert";
import { v4 as uuidv4 } from 'uuid';

interface UseMediaProps {
    addAlert: (alert: AlertType) => void;
}

interface UseMediaReturn {
    isVideoActive: boolean;
    stream: MediaStream | null;
    capturedImages: File[];
    setCapturedImages: React.Dispatch<React.SetStateAction<File[]>>;
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    startVideo: () => void;
    stopVideo: () => void;
    takePicture: () => void;
}

const useMedia = ({ addAlert }: UseMediaProps): UseMediaReturn => {
    const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImages, setCapturedImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const startVideo = useCallback(async () => {
        if (isVideoActive) return;

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
        } catch (error) {
            addAlert({ id: uuidv4(), text: 'Error accessing camera', type: 'danger', timeout: 3000 });
        }

        setIsVideoActive(true);
    }, [isVideoActive]);

    const stopVideo = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
        setIsVideoActive(false);
    }, [stream]);

    const takePicture = useCallback(() => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `image_${Date.now()}.jpg`, {
                            type: "image/jpeg",
                        });
                        setCapturedImages((prevImages) => [...prevImages, file]);
                        stopVideo();
                    }
                }, "image/jpeg");
            }
        }
    }, [stopVideo]);

    useEffect(() => {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));

        const newUrls = capturedImages.map((image) => URL.createObjectURL(image));
        setImageUrls(newUrls);

        return () => {
            newUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [capturedImages]);

    return {
        isVideoActive,
        stream,
        capturedImages,
        setCapturedImages,
        videoRef,
        canvasRef,
        startVideo,
        stopVideo,
        takePicture,
    };
};

export default useMedia;

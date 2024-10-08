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
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }

            //const videoTrack = mediaStream.getVideoTracks()[0];
            //const { width, height } = videoTrack.getSettings();
        } catch (error) {
            addAlert({ id: uuidv4(), text: 'Error accessing camera', type: 'danger', timeout: 3000 });
        }

        setIsVideoActive(true);
    }, [isVideoActive, addAlert]);

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
                const { videoWidth, videoHeight } = videoRef.current;

                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `image_${Date.now()}.jpg`, {
                            type: "image/jpeg",
                        });
                        setCapturedImages((prevImages) => [...prevImages, file]);
                        stopVideo();
                    }
                }, "image/jpeg", 1.0)
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

    useEffect(() => {
        const drawLastCapturedImage = async () => {
            if (canvasRef.current && capturedImages.length > 0) {
                const lastImage = capturedImages[capturedImages.length - 1];
                const img = new Image();
                img.src = URL.createObjectURL(lastImage);

                img.onload = () => {
                    const context = canvasRef.current?.getContext("2d");
                    if (canvasRef.current && context) {
                        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                };
            }
        };

        drawLastCapturedImage();
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
        takePicture
    };
};

export default useMedia;
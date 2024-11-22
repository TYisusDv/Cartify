export const drawImage = (file: File, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = function () {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scaleFactor) / 2;
                const y = (canvas.height - img.height * scaleFactor) / 2;

                ctx.drawImage(img, x, y, img.width * scaleFactor, img.height * scaleFactor);
            }
        };
    };

    reader.readAsDataURL(file);
};

export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};
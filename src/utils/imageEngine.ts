export interface CompressionOptions {
    quality: number;
    maxWidth?: number;
    maxHeight?: number;
}

export const compressImage = async (file: File, options: CompressionOptions): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(img.src);
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (options.maxWidth && width > options.maxWidth) {
                height = (options.maxWidth / width) * height;
                width = options.maxWidth;
            }
            if (options.maxHeight && height > options.maxHeight) {
                width = (options.maxHeight / height) * width;
                height = options.maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas toBlob failed'));
                },
                file.type,
                options.quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
    });
};

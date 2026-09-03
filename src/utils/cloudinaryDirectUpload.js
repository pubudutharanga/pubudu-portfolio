/**
 * Direct-to-Cloudinary signed upload helper.
 * Bypasses Vercel's 4.5MB serverless request body cap completely (Fixes C4).
 */
export async function uploadDirectToCloudinary(file, folder = 'portfolio/blogs', onProgress = null) {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    // 1. Request upload signature from serverless backend
    const sigRes = await fetch('/api/admin/upload-signature', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
    });

    if (!sigRes.ok) {
        const errorData = await sigRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to obtain Cloudinary upload signature');
    }

    const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = await sigRes.json();

    // 2. Prepare FormData for direct Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', targetFolder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // 3. Perform upload with XMLHttpRequest to support accurate progress tracking
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);

        if (onProgress && xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        secure_url: response.secure_url,
                        public_id: response.public_id,
                        width: response.width,
                        height: response.height,
                        format: response.format,
                        bytes: response.bytes
                    });
                } catch (e) {
                    reject(new Error('Invalid response from Cloudinary'));
                }
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    reject(new Error(err.error?.message || `Cloudinary upload failed: ${xhr.statusText}`));
                } catch {
                    reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => reject(new Error('Network error occurred during Cloudinary upload'));
        xhr.send(formData);
    });
}

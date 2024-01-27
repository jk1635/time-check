const useCloudUploader = () => {
    const uploadCloud = async (blob: Blob) => {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", `${process.env.REACT_APP_CLOUD_PRESETS}`);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.secure_url;
    };

    return { uploadCloud };
};

export default useCloudUploader;

import { useState } from "react";
import {request} from "./api"
export default function UploadFile({apiPath,fileType}) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log(apiPath);
    const response = await request(apiPath, {
      method: "POST",
      body: formData, // do NOT set Content-Type manually
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload {fileType} file
      </button>
    </div>
  );
}
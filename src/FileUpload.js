import React, { useState } from 'react';

function FileUpload({ onUpload }) {
  const [error, setError] = useState(null);

  // Function to validate the structure of the uploaded JSON
  const validateEmployeeData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error(
        'The uploaded file does not contain a valid array of employees.'
      );
    }

    data.forEach((employee, index) => {
      if (!employee.id || !employee.name) {
        throw new Error(
          `Employee at index ${index} is missing required fields (id, name, displayPicture).`
        );
      }
    });

    return data; // Return the validated data
  };

  // Handle file upload and validation
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validatedData = validateEmployeeData(data);
        onUpload(validatedData); // Pass the validated data to the next step
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message); // Display the error message
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Upload Employee List
      </h1>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}

export default FileUpload;

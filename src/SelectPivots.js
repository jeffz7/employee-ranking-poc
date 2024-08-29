import React, { useState, useEffect } from 'react';
// import employeesData from './employees.json';
import EmployeeCard from './EmployeeCard';

function SelectPivots({ employees, onProceed }) {
  // const [employees, setEmployees] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState('high');
  const [highPivot, setHighPivot] = useState(null);
  const [mediumPivot, setMediumPivot] = useState(null);
  const [lowPivot, setLowPivot] = useState(null);

  // useEffect(() => {
  //   setEmployees(employeesData);
  // }, []);

  const handleSelectPivot = (employee) => {
    if (selectedBucket === 'high') setHighPivot(employee);
    if (selectedBucket === 'medium') setMediumPivot(employee);
    if (selectedBucket === 'low') setLowPivot(employee);
  };

  const isSelected = (employee) => {
    return (
      (highPivot && highPivot.id === employee.id) ||
      (mediumPivot && mediumPivot.id === employee.id) ||
      (lowPivot && lowPivot.id === employee.id)
    );
  };

  const renderPivotDisplay = (pivot, bucketName) => (
    <div
      className={`flex flex-col items-center justify-center p-3 min-h-[100px] ${
        selectedBucket === bucketName.toLowerCase()
          ? 'border-2 border-blue-500'
          : ''
      }`}
    >
      {pivot ? (
        <div className="relative p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform scale-105">
          <EmployeeCard employee={pivot} />
        </div>
      ) : (
        <div className="relative p-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg transform scale-100">
          <p className="text-gray-500 text-md">
            Select a pivot for {bucketName}
          </p>
        </div>
      )}
    </div>
  );

  const handleProceed = () => {
    if (highPivot && mediumPivot && lowPivot) {
      onProceed({ highPivot, mediumPivot, lowPivot });
    } else {
      alert('Please select pivots for all buckets before proceeding.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Select Pivots for Each Bucket
      </h1>
      <div className="flex justify-center space-x-2 mb-6">
        <button
          className={`px-3 py-2 rounded-full font-semibold text-white text-sm ${
            selectedBucket === 'high'
              ? 'bg-blue-700'
              : 'bg-gray-400 hover:bg-blue-500'
          }`}
          onClick={() => setSelectedBucket('high')}
        >
          High Bucket
        </button>
        <button
          className={`px-3 py-2 rounded-full font-semibold text-white text-sm ${
            selectedBucket === 'medium'
              ? 'bg-blue-700'
              : 'bg-gray-400 hover:bg-blue-500'
          }`}
          onClick={() => setSelectedBucket('medium')}
        >
          Medium Bucket
        </button>
        <button
          className={`px-3 py-2 rounded-full font-semibold text-white text-sm ${
            selectedBucket === 'low'
              ? 'bg-blue-700'
              : 'bg-gray-400 hover:bg-blue-500'
          }`}
          onClick={() => setSelectedBucket('low')}
        >
          Low Bucket
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>{renderPivotDisplay(highPivot, 'High')}</div>
        <div>{renderPivotDisplay(mediumPivot, 'Medium')}</div>
        <div>{renderPivotDisplay(lowPivot, 'Low')}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto margin">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className={`transform transition-transform ${
              isSelected(employee)
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:shadow-lg'
            }`}
            onClick={() => !isSelected(employee) && handleSelectPivot(employee)}
          >
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          onClick={handleProceed}
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
}

export default SelectPivots;

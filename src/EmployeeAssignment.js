import React, { useState } from 'react';
import Bucket from './Bucket';

function EmployeeAssignment({ pivots, employees, onComplete }) {
  const totalEmployees = employees.length;
  const maxHigh = Math.round(totalEmployees * 0.25);
  const maxLow = Math.round(totalEmployees * 0.25);
  const maxMedium = totalEmployees - maxHigh - maxLow;

  const [highBucket, setHighBucket] = useState([pivots.highPivot]);
  const [mediumBucket, setMediumBucket] = useState([pivots.mediumPivot]);
  const [lowBucket, setLowBucket] = useState([pivots.lowPivot]);
  const [remainingEmployees, setRemainingEmployees] = useState(
    employees.filter(
      (emp) =>
        emp.id !== pivots.highPivot.id &&
        emp.id !== pivots.mediumPivot.id &&
        emp.id !== pivots.lowPivot.id
    )
  );
  const [selectedBucket, setSelectedBucket] = useState('high');

  const handleSelectBucket = (bucket) => {
    setSelectedBucket(bucket);
  };

  const handleAddToBucket = (employee) => {
    if (selectedBucket === 'high' && highBucket.length < maxHigh) {
      setHighBucket([...highBucket, employee]);
    } else if (selectedBucket === 'medium' && mediumBucket.length < maxMedium) {
      setMediumBucket([...mediumBucket, employee]);
    } else if (selectedBucket === 'low' && lowBucket.length < maxLow) {
      setLowBucket([...lowBucket, employee]);
    }

    setRemainingEmployees(
      remainingEmployees.filter((emp) => emp.id !== employee.id)
    );
  };

  const handleRemoveFromBucket = (employee, bucket) => {
    if (bucket === 'high') {
      setHighBucket(highBucket.filter((emp) => emp.id !== employee.id));
    } else if (bucket === 'medium') {
      setMediumBucket(mediumBucket.filter((emp) => emp.id !== employee.id));
    } else if (bucket === 'low') {
      setLowBucket(lowBucket.filter((emp) => emp.id !== employee.id));
    }

    setRemainingEmployees([...remainingEmployees, employee]);
  };

  const handleProceed = () => {
    const buckets = { high: highBucket, medium: mediumBucket, low: lowBucket };
    onComplete(buckets);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Assign Employees to Buckets
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Bucket
          title="High"
          bucket={highBucket}
          maxBucket={maxHigh}
          selectedBucket={selectedBucket}
          onRemove={handleRemoveFromBucket}
          onSelect={handleSelectBucket}
        />
        <Bucket
          title="Medium"
          bucket={mediumBucket}
          maxBucket={maxMedium}
          selectedBucket={selectedBucket}
          onRemove={handleRemoveFromBucket}
          onSelect={handleSelectBucket}
        />
        <Bucket
          title="Low"
          bucket={lowBucket}
          maxBucket={maxLow}
          selectedBucket={selectedBucket}
          onRemove={handleRemoveFromBucket}
          onSelect={handleSelectBucket}
        />
      </div>
      {remainingEmployees.length > 0 && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Remaining Employees
          </h2>
          <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
            {remainingEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`border p-2 rounded-lg cursor-pointer shadow-md transform transition-transform hover:scale-105 hover:shadow-lg ${
                  (selectedBucket === 'high' && highBucket.length >= maxHigh) ||
                  (selectedBucket === 'medium' &&
                    mediumBucket.length >= maxMedium) ||
                  (selectedBucket === 'low' && lowBucket.length >= maxLow)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() =>
                  selectedBucket === 'high' && highBucket.length < maxHigh
                    ? handleAddToBucket(employee)
                    : selectedBucket === 'medium' &&
                      mediumBucket.length < maxMedium
                    ? handleAddToBucket(employee)
                    : selectedBucket === 'low' && lowBucket.length < maxLow
                    ? handleAddToBucket(employee)
                    : null
                }
              >
                <img
                  src={employee.displayPicture}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full mx-auto mb-1"
                />
                <p className="text-center text-sm font-medium">
                  {employee.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {remainingEmployees.length === 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            onClick={handleProceed}
          >
            Save and Proceed
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployeeAssignment;

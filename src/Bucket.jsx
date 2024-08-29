import React from 'react';
import EmployeeCard from './EmployeeCard';

function Bucket({ title, bucket, maxBucket, selectedBucket, onRemove, onSelect }) {
  return (
    <div
      className={`border p-4 rounded-lg shadow-md ${
        selectedBucket === title.toLowerCase() ? 'bg-blue-100' : 'bg-white'
      }`}
      onClick={() => onSelect(title.toLowerCase())}
    >
      <h2 className="text-xl font-semibold text-center mb-2">
        {title} Bucket ({bucket.length}/{maxBucket})
      </h2>
      {bucket.map((employee) => (
        <div key={employee.id} className="mb-2">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-md justify-between">
            <div className="flex items-center">
              <img
                src={employee.displayPicture}
                alt={employee.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {employee.name}
                </p>
                <p className="text-sm text-gray-500">
                  {employee.roles ? employee.roles.join(' / ') : 'Developer'}
                </p>
              </div>
            </div>
            {employee.id !== bucket[0].id && (
              <button
                className="text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(employee, title.toLowerCase());
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Bucket;

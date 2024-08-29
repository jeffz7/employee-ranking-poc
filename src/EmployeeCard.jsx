import React from "react";

function EmployeeCard({ employee, rank }) {
  
  const { displayPicture, name, roles } = employee;

  return (
    <div  className="flex justify-between p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center ">
      <img
        src={displayPicture}
        alt={name}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">
          {roles ? roles.join(" / ") : "Developer"}
        </p>
      </div>
      </div>
      {rank ? (<div>
        #{rank+1}
      </div>): null}
    </div>
  );
}

export default EmployeeCard;

import React from 'react';
import EmployeeCard from './EmployeeCard';

function FinalRankings({ finalRanks }) {
  const { high, medium, low, rankHistory } = finalRanks;

 // Helper function to safely access averageRank with fallback
 const getAverageRank = (id) => {
  return rankHistory[id]?.averageRank ?? Number.MAX_SAFE_INTEGER;
};

// Sort each bucket by averageRank within its own category
const sortedHigh = high?.sort((a, b) => getAverageRank(a.id) - getAverageRank(b.id));
const sortedMedium = medium?.sort((a, b) => getAverageRank(a.id) - getAverageRank(b.id));
const sortedLow = low?.sort((a, b) => getAverageRank(a.id) - getAverageRank(b.id));

  // Combine the sorted employees into a final list respecting the bucket order
  const combinedRanks = [
    ...sortedHigh, // High bucket employees first
    ...sortedMedium, // Then medium bucket employees
    ...sortedLow, // Finally, low bucket employees
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Final Employee Rankings
      </h1>
      <ul className="list-none">
        {combinedRanks.map((employee, index) => (
 <div
 className="mb-4"
>
 <EmployeeCard employee={employee} rank={index}/>
</div>
        ))}
      </ul>
    </div>
  );
}

export default FinalRankings;

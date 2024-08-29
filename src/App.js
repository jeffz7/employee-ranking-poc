import React, { useState } from 'react';
import FileUpload from './FileUpload';
import SelectPivots from './SelectPivots';
import EmployeeAssignment from './EmployeeAssignment';
import RankEmployees from './RankEmployees';
import FinalRankings from './FinalRankings';

function App() {
  const [employees, setEmployees] = useState(null);
  const [pivots, setPivots] = useState(null);
  const [buckets, setBuckets] = useState(null);
  const [finalRanks, setFinalRanks] = useState(null);

  const handleFileUpload = (validatedData) => {
    setEmployees(validatedData); // Set the validated employee data
  };

  const handleProceed = (selectedPivots) => {
    setPivots(selectedPivots);
  };

  const handleBucketAssignmentComplete = (assignedBuckets) => {
    setBuckets(assignedBuckets);
  };

  const handleRankingComplete = (finalRanks) => {
    setFinalRanks(finalRanks);
  };

  return (
    <div className="App">
      {finalRanks ? (
        <FinalRankings finalRanks={finalRanks} />
      ) : buckets ? (
        <RankEmployees buckets={buckets} onComplete={handleRankingComplete} />
      ) : pivots ? (
        <EmployeeAssignment
          pivots={pivots}
          employees={employees}
          onComplete={handleBucketAssignmentComplete}
        />
      ) : employees ? (
        <SelectPivots employees={employees} onProceed={handleProceed} />
      ) : (
        <FileUpload onUpload={handleFileUpload} />
      )}
    </div>
  );
}

export default App;

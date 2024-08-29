import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import EmployeeCard from './EmployeeCard';

function RankEmployees({ buckets, onComplete }) {
  const [currentBucket, setCurrentBucket] = useState(null);
  const [currentBatch, setCurrentBatch] = useState([]);
  const [rankHistory, setRankHistory] = useState({});
  const [progressData, setProgressData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (buckets) {
      selectRandomBucket();
    }
  }, [buckets]);

  useEffect(() => {
    if (buckets && currentBucket) {
      selectNextBatch(currentBucket);
    }
  }, [currentBucket, buckets]);

  useEffect(() => {
    updateProgressChart();
  }, [rankHistory]);

  const updateProgressChart = () => {
    let fullyConfident = 0;
    let needingMoreRanks = 0;
    let needingRefinement = 0;

    Object.values(rankHistory).forEach((entry) => {
      if (entry.count < 2) {
        needingMoreRanks++;
      } else if (entry.confidenceInterval <= 0.5) {
        fullyConfident++;
      } else {
        needingRefinement++;
      }
    });

    setProgressData({
      labels: ['Fully Confident', 'Needing More Ranks', 'Needing Refinement'],
      datasets: [
        {
          label: 'Employee Count',
          data: [fullyConfident, needingMoreRanks, needingRefinement],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          borderWidth: 1,
        },
      ],
    });
  };

  const selectRandomBucket = () => {
    const bucketNames = Object.keys(buckets);
    const randomBucket =
      bucketNames[Math.floor(Math.random() * bucketNames.length)];
    setCurrentBucket(randomBucket);
    console.log('Randomly selected bucket:', randomBucket);
  };

  const selectNextBatch = (bucket) => {
    const bucketList = buckets[bucket] || [];
    const unrankedEmployees = bucketList.filter(
      (employee) =>
        !rankHistory[employee.id] ||
        rankHistory[employee.id].count < 2 ||
        rankHistory[employee.id].confidenceInterval > 0.5
    );

    if (unrankedEmployees.length > 0) {
      const batchSize = Math.min(6, unrankedEmployees.length);
      const selectedBatch = unrankedEmployees
        .sort(() => 0.5 - Math.random())
        .slice(0, batchSize);
      setCurrentBatch(selectedBatch);
      console.log('Selected batch:', selectedBatch);
    } else {
      console.warn('No unranked employees found in this bucket.');
      refineRankings();
    }
  };

  const refineRankings = () => {
    console.log('Refining rankings based on collected rank history...');
    let focusPairs = [];

    Object.keys(buckets).forEach((bucket) => {
      const bucketEmployees = buckets[bucket];
      bucketEmployees.forEach((employee) => {
        const empData = rankHistory[employee.id];
        if (!empData) return;

        bucketEmployees.forEach((otherEmployee) => {
          if (employee.id !== otherEmployee.id) {
            const otherEmpData = rankHistory[otherEmployee.id];
            if (!otherEmpData) return;

            if (
              Math.abs(empData.averageRank - otherEmpData.averageRank) < 0.5
            ) {
              focusPairs.push([empData.employee, otherEmpData.employee]);
            }
          }
        });
      });
    });

    if (focusPairs.length > 0) {
      const focusBatch = [...new Set(focusPairs.flat())];
      setCurrentBatch(focusBatch);
    } else {
      finalizeRankings();
    }
  };

  const finalizeRankings = () => {
    const finalRanks = {
      high: buckets.high,
      medium: buckets.medium,
      low: buckets.low,
      rankHistory: rankHistory,
    };

    onComplete(finalRanks);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(currentBatch);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCurrentBatch(items);
  };

  const handleSaveRank = () => {
    if (currentBatch.length === 0) return;

    const updatedRankHistory = { ...rankHistory };

    currentBatch.forEach((employee, index) => {
      if (!updatedRankHistory[employee.id]) {
        updatedRankHistory[employee.id] = {
          employee,
          count: 0,
          totalRank: 0,
          averageRank: 0,
          confidenceInterval: Infinity,
        };
      }
      updatedRankHistory[employee.id].count += 1;
      updatedRankHistory[employee.id].totalRank += index + 1;
      updatedRankHistory[employee.id].averageRank =
        updatedRankHistory[employee.id].totalRank /
        updatedRankHistory[employee.id].count;

      const deviationSum = currentBatch.reduce((sum, emp, idx) => {
        return (
          sum + Math.pow(idx + 1 - updatedRankHistory[emp.id]?.averageRank??0, 2)
        );
      }, 0);
      const standardDeviation = Math.sqrt(deviationSum / currentBatch.length);
      updatedRankHistory[employee.id].confidenceInterval = standardDeviation;
    });

    setRankHistory(updatedRankHistory);
    console.log('Updated rank history:', updatedRankHistory);

    selectRandomBucket();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Rank Employees in{' '}
          {currentBucket
            ? currentBucket.charAt(0).toUpperCase() + currentBucket.slice(1)
            : '...'}{' '}
          Bucket
        </h1>

        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3 mb-4 lg:mb-0 p-2">
            {currentBatch.length > 0 && currentBucket && (
              <Droppable
                droppableId={`droppable-${currentBucket}`}
                key={`droppable-${currentBucket}`}
              >
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {currentBatch.map((employee, index) => (
                      <Draggable
                        key={employee.id}
                        draggableId={employee.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4"
                          >
                            <EmployeeCard employee={employee} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleSaveRank}
              disabled={currentBatch.length === 0}
            >
              Save Rank
            </button>
          </div>

          {/* Progress Chart */}
          <div className="w-full lg:w-1/3 p-2">
            <div className="h-48">
              <h2 className="text-xl font-semibold mb-4">Ranking Progress</h2>
              <Bar data={progressData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default RankEmployees;

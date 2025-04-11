'use client';

import { useState } from 'react';
import WorkoutFilter, { WorkoutFilterState } from './WorkoutFilter';
import WeeklyWorkoutSection from './WeeklyWorkoutSection';

type WorkoutFilterWrapperProps = {
    groupedByWeek: Record<string, any[]>;
    currentWeekLabel: string;
    userName: string;
};

export default function WorkoutFilterWrapper({
    groupedByWeek,
    currentWeekLabel,
    userName,
}: WorkoutFilterWrapperProps) {
    const [filters, setFilters] = useState<WorkoutFilterState>({
        category: '',
        keyword: '',
    });

    return (
        <>
            <WorkoutFilter filters={filters} setFilters={setFilters} />
            <WeeklyWorkoutSection
                groupedByWeek={groupedByWeek}
                currentWeekLabel={currentWeekLabel}
                userName={userName}
                filters={filters}
            />
        </>
    );
}

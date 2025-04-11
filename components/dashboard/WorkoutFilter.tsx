'use client';

import { Dispatch, SetStateAction } from 'react';

export type WorkoutFilterState = {
    category: string;
    keyword: string;
};

export interface WorkoutFilterProps {
    filters: WorkoutFilterState;
    setFilters: Dispatch<SetStateAction<WorkoutFilterState>>;
}

export default function WorkoutFilter({ filters, setFilters }: WorkoutFilterProps) {
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev) => ({ ...prev, category: e.target.value }));
    };

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, keyword: e.target.value }));
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-4">
            <div className="form-control w-full sm:w-48">
                <label htmlFor="category-select" className="label label-text">Filter by Category</label>
                <select
                    id="category-select"
                    className="select select-bordered"
                    value={filters.category}
                    onChange={handleCategoryChange}
                >
                    <option value="">All</option>
                    <option value="weight_training">Weight Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="calisthenics">Calisthenics</option>
                </select>
            </div>

            <div className="form-control flex-grow">
                <label className="label label-text">Search Exercises</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. Bench Press"
                    value={filters.keyword}
                    onChange={handleKeywordChange}
                />
            </div>
        </div>
    );
}

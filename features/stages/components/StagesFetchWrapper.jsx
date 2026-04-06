"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStageDetails, fetchSSRBlockAmount, fetchCARStatus, clearStages } from "../storage/stagesSlice";

export default function StagesFetchWrapper({ ssrId, children }) {
    const dispatch = useDispatch();
    const { stagesData, blockAmount, carStatus, loading, error } = useSelector((state) => state.stages);

    useEffect(() => {
        if (ssrId) {
            dispatch(fetchStageDetails({ ssr: ssrId }));
            dispatch(fetchSSRBlockAmount({ ssr: ssrId }));
            dispatch(fetchCARStatus({ ssr: ssrId }));
        }

        return () => {
            dispatch(clearStages());
        };
    }, [dispatch, ssrId]);

    if (loading) {
        return (
            <div className="flex animate-pulse justify-center py-8">
                <span className="text-sm font-medium text-gray-500">Loading Stages...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center py-8">
                <span className="text-sm font-medium text-red-500">{error}</span>
            </div>
        );
    }

    // Allow render prop pattern or standard React children cloning
    if (typeof children === "function") {
        return children({ stagesData, blockAmount, carStatus });
    }

    return (
        <div className="stages-data-container">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // Automatically pass down the stagesData to child components
                    return React.cloneElement(child, { stagesData, blockAmount, carStatus });
                }
                return child;
            })}
        </div>
    );
}

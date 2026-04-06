"use client";
import Stepper from "@/features/stages/components/Stepper";
import StagesFetchWrapper from "@/features/stages/components/StagesFetchWrapper";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchIntimateDischarge, fetchDifferenceAmountBlockingLink, downloadHospitalBill, downloadRequestAcceptanceLetter } from "@/features/stages/storage/stagesSlice";

export default function StagesPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Dynamically retrieve SSR from state (e.g., set when navigating to the details/stages page)
    const ssrId = useSelector((state) => state.dashboard?.selectedSSRName);
    const verifiedSSRs = useSelector((state) => state.verify?.verifiedSSRs || {});
    const globalIsVerified = useSelector((state) => state.verify?.isVerified);

    const {
        intimateDischargeLoading,
        intimateDischargeStatus,
        diffAmountLoading,
        diffAmountStatus,
        hospitalBillLoading,
        acceptanceLetterLoading
    } = useSelector((state) => state.stages || {});

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-md">
                {/* heading */}
                <div className="relative mb-8 flex items-center justify-center">
                    <button className="absolute left-0 top-0 mb-8 text-center text-xl font-extrabold" onClick={handleBack}>
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900">Stages</h1>
                </div>

                {/* Dynamic Stepper */}
                {!ssrId ? (
                    <div className="text-center py-8 text-gray-500 font-medium">
                        No SSR Selected. Please go back to select one.
                    </div>
                ) : (
                    <StagesFetchWrapper ssrId={ssrId}>
                        {({ stagesData, blockAmount, carStatus }) => {
                            const isVerified = verifiedSSRs[ssrId] === true;

                            if (!stagesData || stagesData.length === 0) {
                                return (
                                    <div className="text-center py-8 text-gray-500 font-medium">
                                        No stages history found.
                                    </div>
                                );
                            }

                            // Map stages via linked-list traversal with fallback for gaps
                            const nodeMap = {};
                            const allNexts = new Set();

                            stagesData.forEach((item) => {
                                nodeMap[item.current_stage] = item;
                                if (item.next_stage) {
                                    allNexts.add(item.next_stage);
                                }
                            });

                            const chronologicalHistory = [];
                            const visited = new Set();

                            // Get all nodes sorted by creation time
                            const sortedNodes = [...stagesData].sort((a, b) => new Date(a.creation) - new Date(b.creation));

                            let currentIndex = 0;
                            while (visited.size < sortedNodes.length) {
                                // Find the first unvisited node to start/continue a chain
                                let currentNode = null;
                                for (let i = 0; i < sortedNodes.length; i++) {
                                    if (!visited.has(sortedNodes[i].current_stage)) {
                                        currentNode = sortedNodes[i];
                                        break;
                                    }
                                }

                                if (!currentNode) break;

                                // Follow the chain from this node
                                while (currentNode && !visited.has(currentNode.current_stage)) {
                                    chronologicalHistory.push(currentNode);
                                    visited.add(currentNode.current_stage);

                                    if (currentNode.next_stage && nodeMap[currentNode.next_stage]) {
                                        currentNode = nodeMap[currentNode.next_stage];
                                    } else {
                                        // Chain broken, break to find the next unvisited node by creation date
                                        break;
                                    }
                                }
                            }

                            // Stages to hide from the UI
                            const hiddenStages = ["CAR"];

                            // Determine completion status and which stage should be active
                            const lastEntry = chronologicalHistory[chronologicalHistory.length - 1];
                            const isLastHidden = hiddenStages.includes(lastEntry?.current_stage);
                            const lastEntryCompleted = lastEntry?.ssr_completed ? true : false;

                            // If the last entry in the full history is completed, the "active" stage should be the next one
                            let shouldActivateNext = lastEntryCompleted || isLastHidden;

                            // Filter out hidden stages from display
                            const visibleHistory = chronologicalHistory.filter(
                                (item) => !hiddenStages.includes(item.current_stage)
                            );

                            // 1. Core Sequence of all possible stages in order
                            const standardSequence = [
                                "Start New Request",
                                "SSR Created",
                                "Hospital Info Pending",
                                "OTP Verification",
                                "In Progress",
                                "Calculation of amount to be blocked",
                                "Select Fintech Partner to proceed",
                                "Request Acceptance Letter",
                                "Intimate Discharge",
                                "Hospital Bill",
                                "Difference Amount Blocking",
                            ];

                            // 2. Map API history to UI format
                            const apiStagesMapped = visibleHistory.map((item, idx) => {
                                const isLastVisible = idx === visibleHistory.length - 1;
                                let label = item.current_stage || "Stage Upgrade";
                                if (item.current_stage === "Medical Info Updated") label = "OTP Verification";
                                if (item.current_stage === "InProgress") label = "In Progress";
                                if (item.current_stage === "Blocked Amount") label = "Calculation of amount to be blocked";
                                if (item.current_stage === "Fintech Partner to proceed") label = "Select Fintech Partner to proceed";
                                if (item.current_stage === "Hospital Discharge") label = "Intimate Discharge";

                                const status = isLastVisible ? "active" : "completed";

                                let description = item.additional_information || "";
                                if (!description) {
                                    if (["SSR Created", "Hospital Info Pending"].includes(item.current_stage)) {
                                        description = `Created on ${new Date(item.creation).toLocaleDateString()}`;
                                    } else if (item.ssr_completed) {
                                        description = `Completed on ${new Date(item.ssr_completed).toLocaleDateString()}`;
                                    }
                                }

                                const stage = {
                                    label,
                                    status,
                                    description,
                                };

                                if (label === "Calculation of amount to be blocked") {
                                    stage.description = `Blocked Amount: ₹${blockAmount || 0}`;
                                } else if (status === "active" && label === "Select Fintech Partner to proceed") {
                                    stage.description = "Please securely select a fintech partner to proceed with your payment.";
                                    stage.actionLabel = "Proceed to Payment";
                                    stage.actionHref = "/payment";
                                } else if (status === "active" && label === "Hospital Info Pending") {
                                    stage.description = "Please verify and submit hospital details to proceed to the next stage.";
                                } else if (status === "active" && label === "OTP Verification") {
                                    if (isVerified) {
                                        stage.description = "OTP Verification is completed.";
                                        stage.actionLabel = "Completed";
                                        stage.actionDisabled = true;
                                        stage.onAction = () => { }; // Dummy to satisfy hasAction
                                    } else {
                                        stage.description = "Please complete OTP verification to proceed to the next stage.";
                                        stage.actionLabel = "Verify Details";
                                        stage.actionHref = "/verifydetails";
                                    }
                                } else if (status === "active" && label === "Intimate Discharge") {
                                    if (intimateDischargeStatus) {
                                        stage.description = intimateDischargeStatus;
                                    } else {
                                        stage.description = "Your discharge is ready to be intimated securely via our API.";
                                        stage.actionLabel = intimateDischargeLoading ? "Processing..." : "Intimate Discharge";
                                        stage.actionDisabled = intimateDischargeLoading;
                                        stage.onAction = () => dispatch(fetchIntimateDischarge({ ssr: ssrId }));
                                    }
                                } else if (status === "active" && label === "Request Acceptance Letter") {
                                    stage.description = "Your Request Acceptance Letter (DCN Doc) is ready for download.";
                                    stage.actionLabel = acceptanceLetterLoading ? "Downloading..." : "Download Acceptance Letter";
                                    stage.actionDisabled = acceptanceLetterLoading;
                                    stage.onAction = () => dispatch(downloadRequestAcceptanceLetter({ ssr: ssrId }));
                                }

                                return stage;
                            });

                            // 3. Construct the full list by following standardSequence
                            const apiLabelsSet = new Set(apiStagesMapped.map(s => s.label));
                            
                            // Find the index of the furthest stage reached in the API history
                            let furthestApiIndex = -1;
                            standardSequence.forEach((label, idx) => {
                                if (apiLabelsSet.has(label)) {
                                    furthestApiIndex = idx;
                                }
                            });

                            const nextStageTechnicalName = lastEntry?.next_stage;
                            let nextStageUILabel = null;
                            if (nextStageTechnicalName === "Hospital Info Pending") nextStageUILabel = "Hospital Info Pending";
                            if (nextStageTechnicalName === "Medical Info Updated") nextStageUILabel = "OTP Verification";
                            if (nextStageTechnicalName === "InProgress") nextStageUILabel = "In Progress";
                            if (nextStageTechnicalName === "Blocked Amount") nextStageUILabel = "Calculation of amount to be blocked";

                            let activatedTrailing = false;
                            const finalStages = [];

                            standardSequence.forEach((label, idx) => {
                                // 1. If stage is in API history, use the mapped API stage
                                if (apiLabelsSet.has(label)) {
                                    const apiStage = apiStagesMapped.find(s => s.label === label);
                                    finalStages.push({
                                        ...apiStage,
                                        id: finalStages.length + 1
                                    });
                                } else {
                                    // 2. Handle stages NOT in API history
                                    
                                    // By default trailing stages are pending
                                    let status = "pending";

                                    // If this stage is BEFORE the furthest API stage, mark it as completed
                                    if (idx < furthestApiIndex) {
                                        status = "completed";
                                    } 
                                    // Special case: "Start New Request" is always completed
                                    else if (label === "Start New Request") {
                                        status = "completed";
                                    }
                                    // Handle trailing/active stages
                                    else if (shouldActivateNext && !activatedTrailing) {
                                        if (nextStageUILabel) {
                                            if (label === nextStageUILabel) {
                                                status = "active";
                                                activatedTrailing = true;
                                            }
                                        } else {
                                            status = "active";
                                            activatedTrailing = true;
                                        }
                                    }

                                    // Special logic for "In Progress" (completed if carStatus is true)
                                    if (label === "In Progress" && status === "active" && carStatus) {
                                        status = "completed";
                                        activatedTrailing = false; // Allow activating the next trailing stage
                                    }

                                    const trailingStage = {
                                        id: finalStages.length + 1,
                                        label,
                                        status,
                                        description: label === "Start New Request" ? "Request initiated successfully" : ""
                                    };

                                    // Add descriptions/actions for trailing stages if active
                                    if (status === "active") {
                                        if (label === "Select Fintech Partner to proceed") {
                                            trailingStage.description = "Please securely select a fintech partner to proceed with your payment.";
                                            trailingStage.actionLabel = "Proceed to Payment";
                                            trailingStage.actionHref = "/payment";
                                        } else if (label === "Intimate Discharge") {
                                            if (intimateDischargeStatus) {
                                                trailingStage.description = intimateDischargeStatus;
                                            } else {
                                                trailingStage.description = "Your discharge is ready to be intimated securely via our API.";
                                                trailingStage.actionLabel = intimateDischargeLoading ? "Processing..." : "Intimate Discharge";
                                                trailingStage.actionDisabled = intimateDischargeLoading;
                                                trailingStage.onAction = () => dispatch(fetchIntimateDischarge({ ssr: ssrId }));
                                            }
                                        } else if (label === "Request Acceptance Letter") {
                                            trailingStage.description = "Your Request Acceptance Letter (DCN Doc) is ready for download.";
                                            trailingStage.actionLabel = acceptanceLetterLoading ? "Downloading..." : "Download Acceptance Letter";
                                            trailingStage.actionDisabled = acceptanceLetterLoading;
                                            trailingStage.onAction = () => dispatch(downloadRequestAcceptanceLetter({ ssr: ssrId }));
                                        } else if (label === "Difference Amount Blocking") {
                                            if (diffAmountStatus) {
                                                if (typeof diffAmountStatus === "string" && diffAmountStatus.startsWith("http")) {
                                                    trailingStage.description = "Your payment link has been generated.";
                                                    trailingStage.actionLabel = "Open Payment Link";
                                                    trailingStage.actionHref = diffAmountStatus;
                                                } else {
                                                    trailingStage.description = diffAmountStatus;
                                                }
                                            } else {
                                                trailingStage.description = "Please generate the block link to pay the difference amount safely.";
                                                trailingStage.actionLabel = diffAmountLoading ? "Processing..." : "Generate Payment Link";
                                                trailingStage.actionDisabled = diffAmountLoading;
                                                trailingStage.onAction = () => dispatch(fetchDifferenceAmountBlockingLink({ ssr: ssrId }));
                                            }
                                        } else if (label === "Hospital Bill") {
                                            trailingStage.description = "Your preliminary hospital bill is available for download and review.";
                                            trailingStage.actionLabel = hospitalBillLoading ? "Downloading..." : "Download Hospital Bill";
                                            trailingStage.actionDisabled = hospitalBillLoading;
                                            trailingStage.onAction = () => dispatch(downloadHospitalBill({ ssr: ssrId }));
                                        } else if (label === "Hospital Info Pending") {
                                            trailingStage.description = "Please verify and submit hospital details to proceed to the next stage.";
                                        } else if (label === "OTP Verification") {
                                            if (isVerified) {
                                                trailingStage.description = "OTP Verification is completed.";
                                                trailingStage.actionLabel = "Completed";
                                                trailingStage.actionDisabled = true;
                                                trailingStage.onAction = () => { }; // Dummy to satisfy hasAction
                                            } else {
                                                trailingStage.description = "Please complete OTP verification to proceed to the next stage.";
                                                trailingStage.actionLabel = "Verify Details";
                                                trailingStage.actionHref = "/verifydetails";
                                            }
                                        }
                                    }

                                    if (label === "Calculation of amount to be blocked") {
                                        trailingStage.description = `Blocked Amount: ₹${blockAmount || 0}`;
                                    }

                                    finalStages.push(trailingStage);
                                }
                            });

                            return <Stepper stages={finalStages} />;
                        }}
                    </StagesFetchWrapper>
                )}
            </div>
        </main>
    );
}
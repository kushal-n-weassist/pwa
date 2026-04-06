// This renders the individual row and the connecting vertical line.
import StatusIcon from "./StatusIcon"
import Link from "next/link"

export default function StepItem({ step, isLast }) {
    const isActive = step.status === "active";
    const isCompleted = step.status === "completed";
    const hasAction = isActive && (step.actionHref || step.onAction);

    return (
        <div className="relative flex gap-4 pb-8">
            {/* Vertical line */}
            {!isLast && (
                <div className={`absolute left-4 top-8 h-full w-0.5 -translate-z-1/2
                    ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
            {/* Status Icon */}
            <StatusIcon status={step.status} />

            <div className="flex-1 flex flex-col gap-2 pt-1">
                <h3 className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {step.label}
                </h3>

                {hasAction && (
                    <div className="mt-2 rounded-2xl border border-blue-100 bg-white p-5 flex flex-col gap-4 shadow-md ring-1 ring-blue-100">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {step.description}
                        </p>
                        {step.actionHref ? (
                            <Link
                                href={step.actionHref}
                                className="w-full text-center rounded-full bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
                            >
                                {step.actionLabel}
                            </Link>
                        ) : (
                            <button
                                onClick={step.onAction}
                                disabled={step.actionDisabled}
                                className="w-full text-center rounded-full bg-blue-500 disabled:bg-blue-300 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
                            >
                                {step.actionLabel}
                            </button>
                        )}
                    </div>
                )}

                {isActive && !hasAction && step.description && (
                    <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-6 gap-y-2 flex flex-col shadow-sm ring-1 ring-gray-900/5">
                        <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import StepItem from "./StepItem";

export default function Stepper({ stages }) {
    return (
        <div>
            {stages.map((step, index) => (
                <StepItem
                    key={step.id}
                    step={step}
                    //we pass isLast to tell the CSS not to draw a line after te last item
                    isLast={index === stages.length - 1}
                />
            ))}
        </div>
    )
}
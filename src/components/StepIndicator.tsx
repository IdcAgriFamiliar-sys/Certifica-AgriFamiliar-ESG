import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface Step {
    id: number;
    label: string;
}

interface Props {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
}

const StepIndicator: React.FC<Props> = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between mx-auto max-w-4xl relative">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center gap-3 relative z-10">
                                <div
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative bg-white
                                        ${isActive ? 'border-green-500 shadow-lg shadow-green-500/20 scale-110' : ''}
                                        ${isCompleted ? 'border-green-500 bg-green-500' : 'border-stone-200'}
                                        ${!isActive && !isCompleted ? 'text-stone-300' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6 text-white animate-scale-in" />
                                    ) : (
                                        <span className={`text-base font-bold ${isActive ? 'text-green-600' : 'text-stone-400'}`}>
                                            {step.id}
                                        </span>
                                    )}

                                    {isActive && (
                                        <span className="absolute inset-0 rounded-full animate-ping bg-green-400/20"></span>
                                    )}
                                </div>
                                <span
                                    className={`
                                        text-xs font-bold uppercase tracking-wider transition-colors duration-300 absolute -bottom-8 w-32 text-center
                                        ${isActive ? 'text-green-700' : 'text-stone-400'}
                                    `}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Arrow */}
                            {!isLast && (
                                <div className="flex-1 px-2 flex items-center justify-center relative">
                                    <div className="w-full h-[2px] bg-stone-200 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-green-500 transition-transform duration-500 ease-out origin-left
                                                ${currentStep > step.id ? 'scale-x-100' : 'scale-x-0'}
                                            `}
                                        ></div>
                                    </div>
                                    {/* Arrow Icon centered or at end */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 transition-colors duration-300 ${currentStep > step.id ? 'text-green-500' : 'text-stone-300'}`}>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;

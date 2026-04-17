"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import Image from "next/image";

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Your Liquidity Score",
    description: "Every wallet gets a unique score based on transaction history. Higher scores mean better financial behavior.",
  },
  {
    title: "Risk Assessment",
    description: "Quickly understand risk levels at a glance — Low, Medium, or High — to make informed decisions.",
  },
  {
    title: "Flow Analytics",
    description: "Visualize money movement with clear inflow vs outflow charts to spot patterns instantly.",
  },
];

export default function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="w-full max-w-lg rounded-2xl p-6 relative"
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} style={{ color: "var(--foreground-muted)" }} />
          </button>

          <div className="flex justify-center mb-6">
            <Image 
              src="/navigation.png" 
              alt="Navigation Preview" 
              width={320} 
              height={180}
              className="rounded-xl"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="text-center mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentStep ? 24 : 8,
                    background: i <= currentStep ? "var(--primary)" : "var(--border)",
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
            <h2 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 24 }}>
              {steps[currentStep].title}
            </h2>
          </div>

          <p style={{ color: "var(--foreground-muted)", fontSize: 16, lineHeight: 1.6 }} className="text-center mb-8">
            {steps[currentStep].description}
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              style={{ color: "var(--foreground-muted)", fontSize: 14 }}
              className="text-sm"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="btn btn-primary flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? "Got it" : "Next"}
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

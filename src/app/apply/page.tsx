"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import ProtectedRoute from "../components/ProtectedRoute";
import ProgressBar from "../components/apply/ProgressBar";
import StepApplicationSetup from "../components/apply/StepApplicationSetup";
import StepBusinessInfo from "../components/apply/StepBusinessInfo";
import StepOwnerInfo from "../components/apply/StepOwnerInfo";
import StepPropertyTax from "../components/apply/StepPropertyTax";
import StepDocumentChecklist from "../components/apply/StepDocumentChecklist";
import StepReviewSubmit from "../components/apply/StepReviewSubmit";
import { WizardFormData, defaultFormData } from "../components/apply/types";

function WizardContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(defaultFormData);

  function handleChange(field: keyof WizardFormData, value: unknown) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveExit() {
    try {
      localStorage.setItem("bl_wizard_draft", JSON.stringify(formData));
    } catch {
      // ignore
    }
    router.push("/dashboard");
  }

  function handleSubmit() {
    const refNumber = `MOB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const application = {
      refNumber,
      businessName: formData.businessLegalName || formData.tradeName || "Unnamed Business",
      submittedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("bl_applications") || "[]");
      localStorage.setItem("bl_applications", JSON.stringify([...existing, application]));
      localStorage.setItem("bl_last_ref", refNumber);
    } catch {
      // ignore
    }
    router.push("/apply/confirmation");
  }

  const stepProps = {
    data: formData,
    onChange: handleChange,
    onNext: step < 6 ? handleNext : handleSubmit,
    onBack: handleBack,
    onSaveExit: handleSaveExit,
    goToStep: (n: number) => { setStep(n); window.scrollTo({ top: 0, behavior: "smooth" }); },
  };

  return (
    <div className="interior-page">
      <AppHeader />
      <div style={{ flex: 1, padding: "1.75rem 1rem 3rem", background: "var(--page-bg)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <ProgressBar step={step} />
          {step === 1 && <StepApplicationSetup {...stepProps} />}
          {step === 2 && <StepBusinessInfo {...stepProps} />}
          {step === 3 && <StepOwnerInfo {...stepProps} />}
          {step === 4 && <StepPropertyTax {...stepProps} />}
          {step === 5 && <StepDocumentChecklist {...stepProps} />}
          {step === 6 && <StepReviewSubmit {...stepProps} />}
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <ProtectedRoute>
      <WizardContent />
    </ProtectedRoute>
  );
}

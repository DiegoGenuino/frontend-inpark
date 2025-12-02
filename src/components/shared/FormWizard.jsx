import React, { useState } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';
import './FormWizard.css';

const FormWizard = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  steps, 
  onComplete,
  initialData = {} 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    const currentStepObj = steps[currentStep];
    
    // Validate current step if validation function exists
    if (currentStepObj.validate) {
      const isValid = await currentStepObj.validate(formData);
      if (!isValid) return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting wizard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="form-wizard-overlay">
      <div className="form-wizard-container">
        {/* Header */}
        <div className="form-wizard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 className="form-wizard-title">{title}</h2>
              {subtitle && <p className="form-wizard-subtitle">{subtitle}</p>}
            </div>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="wizard-progress-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', color: '#6b7280' }}>
              <span>Passo {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="wizard-progress-bar">
              <div 
                className="wizard-progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="form-wizard-content">
          <h3 className="wizard-step-title">{steps[currentStep].title}</h3>
          <CurrentComponent 
            data={formData} 
            updateData={updateFormData} 
          />
        </div>

        {/* Footer */}
        <div className="form-wizard-footer">
          <button 
            className="btn-wizard btn-wizard-secondary"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            {currentStep === 0 ? 'Cancelar' : 'Voltar'}
          </button>
          
          <button 
            className="btn-wizard btn-wizard-primary"
            onClick={handleNext}
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? 'Salvando...' : (currentStep === totalSteps - 1 ? 'Concluir' : 'Continuar')}
            {currentStep === totalSteps - 1 && !isSubmitting && <MdCheck size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;

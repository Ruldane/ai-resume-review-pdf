"use client";

import { useState, useCallback, useMemo } from "react";

export interface ResumeFormState {
  file: File | null;
  resumeText: string;
  selectedRole: string;
  companyName: string;
}

export interface ResumeFormValidation {
  isValid: boolean;
  errors: {
    file?: string;
    role?: string;
  };
}

export interface UseResumeFormReturn {
  state: ResumeFormState;
  validation: ResumeFormValidation;
  setFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setSelectedRole: (role: string) => void;
  setCompanyName: (company: string) => void;
  reset: () => void;
}

const initialState: ResumeFormState = {
  file: null,
  resumeText: "",
  selectedRole: "",
  companyName: "",
};

export function useResumeForm(): UseResumeFormReturn {
  const [state, setState] = useState<ResumeFormState>(initialState);

  const setFile = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, file }));
  }, []);

  const setResumeText = useCallback((resumeText: string) => {
    setState((prev) => ({ ...prev, resumeText }));
  }, []);

  const setSelectedRole = useCallback((selectedRole: string) => {
    setState((prev) => ({ ...prev, selectedRole }));
  }, []);

  const setCompanyName = useCallback((companyName: string) => {
    setState((prev) => ({ ...prev, companyName }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const validation = useMemo<ResumeFormValidation>(() => {
    const errors: ResumeFormValidation["errors"] = {};

    if (!state.resumeText.trim()) {
      errors.file = "Please upload a resume PDF";
    }

    if (!state.selectedRole.trim()) {
      errors.role = "Please select a target role";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [state.resumeText, state.selectedRole]);

  return {
    state,
    validation,
    setFile,
    setResumeText,
    setSelectedRole,
    setCompanyName,
    reset,
  };
}

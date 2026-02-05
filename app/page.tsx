"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { DropZone } from "@/components/upload/DropZone";
import { FilePreview } from "@/components/upload/FilePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { TextPreview } from "@/components/upload/TextPreview";
import { RoleSelector } from "@/components/upload/RoleSelector";
import { CompanyInput } from "@/components/upload/CompanyInput";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const { addToast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsParsing(true);
    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setParsedText(data.text);
        addToast({ type: "success", message: "Resume parsed successfully!" });
      } else {
        addToast({
          type: "error",
          message: data.error || "Failed to parse resume",
        });
        setSelectedFile(null);
      }
    } catch {
      addToast({
        type: "error",
        message: "Failed to parse resume. Please try again.",
      });
      setSelectedFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParsedText(null);
  };

  const handleAnalyze = () => {
    if (!parsedText || !selectedRole) return;
    addToast({ type: "info", message: "Analysis coming soon!" });
  };

  const canAnalyze = parsedText && selectedRole;

  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="flex min-h-screen flex-col items-center px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Fire emoji accent */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent/10"
          >
            <Flame className="w-8 h-8 text-accent" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4"
          >
            Get Your Resume <span className="text-accent">Roasted</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary mb-8"
          >
            Brutal AI feedback. Beautiful results.
          </motion.p>

          {/* Fire emojis decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-2xl mb-8"
          >
            <span className="opacity-50">🔥</span>
            <span className="opacity-75">🔥</span>
            <span>🔥</span>
            <span className="opacity-75">🔥</span>
            <span className="opacity-50">🔥</span>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xl mx-auto space-y-6"
        >
          {/* Drop Zone / File Preview / Text Preview */}
          {isParsing ? (
            <UploadProgress message="Parsing your resume..." />
          ) : parsedText ? (
            <div className="space-y-4">
              <FilePreview file={selectedFile!} onRemove={handleRemoveFile} />
              <TextPreview
                text={parsedText}
                onConfirm={() => {}}
                onTryAnother={handleRemoveFile}
              />
            </div>
          ) : selectedFile ? (
            <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
          ) : (
            <DropZone
              onFileSelect={handleFileSelect}
              onValidationError={(error) =>
                addToast({ type: "error", message: error })
              }
            />
          )}

          {/* Role Selection */}
          {parsedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <RoleSelector
                value={selectedRole || undefined}
                onChange={(role) => setSelectedRole(role)}
              />

              <CompanyInput value={company} onChange={setCompany} />

              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                <Upload className="w-5 h-5" />
                Roast My Resume
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center"
        >
          <div className="p-6">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-text-primary mb-1">
              Role-Specific
            </h3>
            <p className="text-sm text-text-secondary">
              Tailored feedback for your target position
            </p>
          </div>
          <div className="p-6">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-text-primary mb-1">
              Instant Analysis
            </h3>
            <p className="text-sm text-text-secondary">
              Get detailed feedback in seconds
            </p>
          </div>
          <div className="p-6">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-text-primary mb-1">
              AI Rewrites
            </h3>
            <p className="text-sm text-text-secondary">
              Copy-paste ready improvements
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

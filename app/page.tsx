"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { DropZone } from "@/components/upload/DropZone";
import { FilePreview } from "@/components/upload/FilePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { TextPreview } from "@/components/upload/TextPreview";
import { RoleSelector } from "@/components/upload/RoleSelector";
import { CompanyInput } from "@/components/upload/CompanyInput";
import { SamplePreview } from "@/components/landing/SamplePreview";

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
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-danger/5" />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-3xl"
        />
      </div>

      <main className="relative flex min-h-screen flex-col items-center px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Fire emoji with glow effect */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative inline-block mb-6"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px rgba(239, 68, 68, 0.3)",
                  "0 0 60px rgba(239, 68, 68, 0.5)",
                  "0 0 40px rgba(239, 68, 68, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full"
            />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-danger/20 to-warning/20 backdrop-blur-sm border border-danger/20">
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-4xl"
              >
                🔥
              </motion.span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 tracking-tight"
          >
            Get Your Resume{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-danger via-warning to-danger bg-clip-text text-transparent">
                Roasted
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-danger via-warning to-danger rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-text-secondary mb-8"
          >
            Brutal AI feedback.{" "}
            <span className="text-text-primary font-medium">Beautiful results.</span>
          </motion.p>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {["AI-Powered Analysis", "Instant Rewrites", "ATS Optimization"].map(
              (feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card/80 border border-border text-sm text-text-secondary"
                >
                  <Flame className="w-4 h-4 text-danger" />
                  {feature}
                </motion.div>
              )
            )}
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
                className="w-full group"
                disabled={!canAnalyze}
                onClick={handleAnalyze}
              >
                <span className="flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5" />
                  Roast My Resume
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-text-secondary/60 text-sm">
            Your resume is processed securely and never stored
          </p>
        </motion.div>

        {/* Sample Analysis Preview */}
        <SamplePreview className="mt-8" />
      </main>
    </div>
  );
}

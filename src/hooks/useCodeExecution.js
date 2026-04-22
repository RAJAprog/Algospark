// src/hooks/useCodeExecution.js
import { useState } from "react";
import { executeCode } from "../api/compilerService";

export function useCodeExecution() {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("testcase");

  const handleRunCode = async (language, code, stdin = "") => {
    if (!code.trim()) {
      setOutput("// Please write some code before running.");
      setActiveTab("result");
      return;
    }

    setIsRunning(true);
    setActiveTab("result");
    setOutput("Running...");

    try {
      const result = await executeCode(language, code, stdin);

      if (result.compile_output) {
        setOutput(`Compilation Error:\n${result.compile_output}`);
      } else if (result.stderr) {
        setOutput(`Runtime Error:\n${result.stderr}`);
      } else {
        setOutput(result.stdout || "// No output");
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setActiveTab("testcase");
  };

  return {
    output,
    isRunning,
    activeTab,
    setActiveTab,
    handleRunCode,
    clearOutput,
  };
}
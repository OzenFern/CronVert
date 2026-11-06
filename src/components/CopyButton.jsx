import Button from "./Button.jsx";
import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

const CopyButton = ({ text, toCopy }) => {
  const [isCopied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000); // Reset Copy feedback
    } catch (e) {
      console.error("Failed to copy: " + e);
    }
  };

  return (
    <Button
      click={handleCopy}
      icon={isCopied ? <CheckCheck /> : <Copy />}
      text={isCopied ? "Copied to Clipboard!" : `Copy ${text}`}
    />
  );
};

export default CopyButton;

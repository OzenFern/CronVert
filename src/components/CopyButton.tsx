import Button from "./Button.tsx";
import { useEffect, useRef, useState } from "react";
import { CheckCheck, Copy } from "lucide-react";

type CopyButtonProps = {
  text: string;
  toCopy: string;
  isDisabled?: boolean;
};

const CopyButton = ({ text, toCopy, isDisabled }: CopyButtonProps) => {
  const [isCopied, setCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    if (isDisabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy: ", e);
    }
  };

  return (
    <Button
      click={handleCopy}
      isDisabled={isDisabled}
      bgColor={isDisabled ? "bg-text-muted" : null}
      icon={isCopied ? CheckCheck : Copy}
      text={isCopied ? "Copied to Clipboard!" : `Copy ${text}`}
    />
  );
};

export default CopyButton;

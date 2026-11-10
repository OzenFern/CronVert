import formatSentence from "../lib/utils/formatSentence.ts";
import type { LucideIcon } from "lucide-react";

type ResultBlockProps = {
  text: string;
  description?: string | null;
  icon: LucideIcon;
};

const ResultBlock = ({ icon: Icon, text, description }: ResultBlockProps) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="flex flex-col items-center justify-center gap-3 @sm:flex-row">
      <Icon />
      <p className="text-center text-xl font-semibold @sm:text-2xl">{formatSentence(text)}</p>
    </div>
    {description && <p className="text-center text-lg sm:text-xl">{formatSentence(description)}</p>}
  </div>
);

export default ResultBlock;

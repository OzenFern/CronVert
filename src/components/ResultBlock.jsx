import formatSentence from "../lib/utils/formatSentence.js";

const ResultBlock = ({ icon, text, description }) => (
  <div className="flex flex-col items-center justify-center gap-3 @sm:flex-row">
    {icon}
    <p className="text-center text-xl font-semibold @sm:text-2xl">{text}</p>
    {description && <p>{formatSentence(description)}</p>}
  </div>
);

export default ResultBlock;

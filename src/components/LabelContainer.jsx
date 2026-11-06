import { createContext, useId } from "react";

const LabelContext = createContext(null);

const LabelContainer = ({ textColor, label, children }) => {
  const id = useId();
  return (
    <div
      className={`@container mx-3 my-5 flex flex-col gap-2 rounded-lg border-2 border-border bg-surface p-3 text-center ${textColor ?? "text-accent-active"}`}
    >
      <label
        htmlFor={id}
        className="text-base font-medium text-accent-hover uppercase sm:text-lg md:text-2xl"
      >
        {label ?? "Enter Input"}
      </label>
      <LabelContext value={id}>{children}</LabelContext>
    </div>
  );
};

export default LabelContainer;
export { LabelContext };

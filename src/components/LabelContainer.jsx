const LabelContainer = ({ bgColor, label, children }) => (
  <div
    className={`@container mx-3 my-5 flex flex-col gap-2 rounded-lg border-2 border-border ${bgColor ?? `bg-surface`} p-3 text-center text-accent-active`}
  >
    <label
      htmlFor={inputId}
      className="text-md font-medium text-accent-hover uppercase sm:text-lg md:text-2xl"
    >
      {label ?? "Enter Input"}
    </label>
    {children}
  </div>
);

export default LabelContainer;

import { useId } from "react";

const Input = ({ baseValue, label, fn, helperMessage }) => {
  const inputId = useId();

  return (
    <div className="@container mx-3 my-5 flex flex-col gap-2 rounded-lg border-2 border-border bg-surface p-3 text-center text-accent-active">
      <label
        htmlFor={inputId}
        className="text-md font-medium text-accent-hover uppercase sm:text-lg md:text-2xl"
      >
        {label ?? "Enter Input"}
      </label>
      <div className="@container flex flex-col rounded-lg p-2 outline-accent focus-within:outline-3">
        <input
          id={inputId}
          type="text"
          onChange={fn}
          autoFocus={true}
          defaultValue={baseValue}
          placeholder={"Type here..."}
          className="peer mt-1 mb-0.5 rounded-md px-1.5 text-center font-mono text-base font-semibold wrap-anywhere focus:outline-none @sm:text-lg @md:rounded-lg @md:text-xl"
        />
        {helperMessage && (
          // Use grid-rows to make drop down animation
          <div className="grid grid-rows-[0fr] opacity-0 transition-all delay-300 ease-in-out peer-focus:grid-rows-[1fr] peer-focus:opacity-100">
            {/* Use overflow: hidden in span for proper animation of text while being hidden */}
            <span className="ml-1 overflow-hidden text-sm font-light text-accent-hover/50">
              {helperMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;

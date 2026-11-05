import { useContext } from "react";
import { LabelContext } from "./LabelContainer.jsx";

const Input = ({ baseValue, fn, helperMessage }) => (
  <div className="@container flex flex-col rounded-lg p-2 outline-1 outline-accent-hover focus-within:outline-3 focus-within:outline-accent">
    <input
      id={useContext(LabelContext)}
      type="text"
      onChange={fn}
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
);

export default Input;

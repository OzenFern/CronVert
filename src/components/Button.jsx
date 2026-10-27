const Button = (props) => (
  <button
    onClick={props.click}
    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-accent p-4 font-medium text-surface shadow-accent/20 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-shadow/40 active:translate-y-0 active:scale-95 active:shadow-sm"
  >
    {/* Children are button icons */}
    {props.children}
    {props.text && <span className="text-md text-lg font-normal">{props.text}</span>}
  </button>
);

export default Button;

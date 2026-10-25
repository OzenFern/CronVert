import { CalendarClock } from "lucide-react";

const Logo = (props) => (
  <div className="rounded-lg border-2 border-border bg-surface p-2 shadow-sm shadow-accent hover:bg-surface-hover">
    <CalendarClock size={props.size + 12} />
  </div>
);

export default Logo;

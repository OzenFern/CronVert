import { CalendarClock } from "lucide-react";

const Logo = (props) => (
  <div className="rounded-lg bg-surface p-2 hover:bg-surface-hover">
    <CalendarClock size={props.size + 12} />
  </div>
);

export default Logo;

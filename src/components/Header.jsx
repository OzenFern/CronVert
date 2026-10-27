import Logo from "./Logo.jsx";
import TitleGroup from "./TitleGroup.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Brand = () => (
  <div className="flex cursor-pointer items-center gap-4 p-4 font-bold text-accent transition-colors duration-250 ease-in-out hover:text-accent/85">
    <Logo size={30} />
    <TitleGroup subTitle="CRON EXPRESSION WORKBENCH" />
  </div>
);

const Header = () => (
  <header className="flex items-center justify-between border-b-2 border-border pr-10 pl-5 shadow-lg shadow-shadow/15 dark:shadow-shadow/50">
    <Brand />
    <ThemeToggle />
  </header>
);

export default Header;

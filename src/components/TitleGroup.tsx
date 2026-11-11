type TitleGroupProps = {
  title?: string | null;
  subTitle?: string | null;
};

const TitleGroup = ({ title, subTitle }: TitleGroupProps) => (
  <div className="flex flex-col">
    <h1 className="text-2xl sm:text-3xl">{title ?? "CronVert"}</h1>
    {subTitle && <p className="text-xs font-normal text-accent-hover/75 sm:text-lg">{subTitle}</p>}
  </div>
);

export default TitleGroup;

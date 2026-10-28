const TitleGroup = (props) => (
  <div className="flex flex-col">
    <h1 className="text-2xl sm:text-3xl">{props.title ?? "CronVert"}</h1>
    {props.subTitle && (
      <p className="text-xs font-normal text-accent-hover/75 sm:text-lg">{props.subTitle}</p>
    )}
  </div>
);

export default TitleGroup;

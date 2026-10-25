const TitleGroup = (props) => (
  <div className="flex flex-col">
    <h1 className="text-3xl">{props.title ?? "CronVert"}</h1>
    {props.subTitle && <p className="text-lg font-normal text-accent-hover/75">{props.subTitle}</p>}
  </div>
);

export default TitleGroup;

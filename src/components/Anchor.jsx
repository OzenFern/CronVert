const Anchor = ({ url, children, ariaLabel, linkColour }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 text-sm ${linkColour} transition-colors hover:text-accent-hover`}
    aria-label={ariaLabel}
  >
    {children}
  </a>
);

export default Anchor;

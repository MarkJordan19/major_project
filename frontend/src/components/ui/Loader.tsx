const Loader = ({ className = "", label = "Loading the latest studio data..." }: { className?: string; label?: string }) => {
  return (
    <div className={["loader", className].filter(Boolean).join(" ")}>
      <div className="loader__orb">
        <div className="loader__ring" />
      </div>
      <p className="loader__label">{label}</p>
    </div>
  );
};

export default Loader;

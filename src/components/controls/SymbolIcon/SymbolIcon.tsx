import styles from "../controls.module.css";

type SymbolIconProps = {
  name: string;
  fallback?: string;
  className?: string;
};

export default function SymbolIcon({
  name,
  fallback,
  className,
}: SymbolIconProps) {
  return (
    <img
      className={className ?? styles.symbolIcon}
      src={`/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      onError={(event) => {
        if (fallback) {
          event.currentTarget.replaceWith(document.createTextNode(fallback));
        }
      }}
    />
  );
}

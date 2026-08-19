import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import NavigationSheet from "@/components/sheets/NavigationSheet/NavigationSheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function NavigationRow({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <SheetTrigger
      className={styles.rowButton}
      ariaLabel={`Open ${title}`}
      content={
        <NavigationSheet
          title={title}
          description={description}
          href={href}
          icon={icon}
        />
      }
    >
      <div className={styles.row}>
        <SymbolIcon name={icon} />
        <span className={styles.label}>{title}</span>
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
      </div>
    </SheetTrigger>
  );
}

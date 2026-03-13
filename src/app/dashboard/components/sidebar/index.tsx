import { logoutAction } from "../../../login/actions";
import { LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./sidebar.styles.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Package className={styles.brandIcon} />
        <span>NextStore</span>
      </div>

      <nav className={styles.sidebarNav}>
        <a href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
          <LayoutDashboard size={18} />
          <span>Главная</span>
        </a>
      </nav>

      <div className={styles.sidebarFooter}>
        <form action={logoutAction}>
          <Button type="submit" variant="danger" fullWidth>
            <LogOut size={18} />
            <span>Выйти</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}

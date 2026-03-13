import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import styles from "./header.styles.module.css";
import { User } from "@/types";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerTitle}>
        <h2>Добро пожаловать, {user.firstName}!</h2>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.userProfile}>
          <span className={styles.userName}>
            {user.firstName} {user.lastName}
          </span>
          <div className={styles.userAvatar}>
            {user.image ? (
              <Image src={user.image} alt="User" width={36} height={36} />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

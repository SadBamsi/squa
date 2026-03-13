import { ReactNode } from "react";
import { getUser } from "@/lib/api";
import styles from "./dashboard.module.css";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQUA - Test Task Dashboard",
  description: "Test Task for SQUA Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <Header user={user} />
      <main className={styles.dashboardMain}>{children}</main>
    </div>
  );
}

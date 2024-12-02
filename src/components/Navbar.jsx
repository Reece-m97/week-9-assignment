"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Villain Hub</div>
      <ul className={styles.navbar_links}>
        <li className={styles.navLinks}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        {/* <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li> */}
        <li>
          <Link href="/deeds">Deed Log</Link>
        </li>
      </ul>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}

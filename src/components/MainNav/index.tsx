import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

export const MainNav = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-luxury-dark/80 backdrop-blur supports-[backdrop-filter]:bg-luxury-dark/60">
      <div className="container flex h-16 items-center gap-4">
        <Logo />
        <NavLinks />
        <div className="flex-1">
          <SearchBar />
        </div>
        <UserMenu />
      </div>
    </header>
  );
};
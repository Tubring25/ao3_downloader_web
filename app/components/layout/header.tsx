"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu } from 'lucide-react';
import { useAtom } from 'jotai';
import { isMobileNavbarOpenAtom } from '@/app/state/modalState';
import MobileNavbarModal from "./MobileNavbarModal";
import { Button } from "../ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "../ui/navigation-menu";
import { cn } from "@/app/lib/utils";

export default function Header() {
  const [, setIsMobileNavbarOpen] = useAtom(isMobileNavbarOpenAtom);

  return (
    <header className="fixed top-0 z-50 w-full bg-purple-900/20 backdrop-blur-md">
      <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo_kiramman.png"
            alt="Caitvi Archive Logo"
            width={32}
            height={32}
            className="dark:invert hover:scale-110 transition-transform duration-300"
          />
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Caitvi Archive
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/browser" legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  "text-gray-300 hover:text-purple-300 transition-colors duration-300",
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                )}>
                  Browser
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  "text-gray-300 hover:text-purple-300 transition-colors duration-300",
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                )}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  "text-gray-300 hover:text-purple-300 transition-colors duration-300",
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                )}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden text-purple-200 hover:text-purple-100 hover:bg-purple-800/30"
          onClick={() => setIsMobileNavbarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile Navigation Modal */}
        <MobileNavbarModal />
      </div>
    </header>
  );
}
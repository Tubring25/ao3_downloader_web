"use client";
import { useEffect } from "react";
import { X } from 'lucide-react';
import Link from "next/link";
import { useAtom } from 'jotai';
import { isMobileNavbarOpenAtom } from '@/app/state/modalState';
import { Dialog } from "@/components//ui/dialog";
import { Button } from "@/components//ui/button";
import { motion } from "framer-motion";

export default function MobileNavbarModal() {
  const [isOpen, setIsOpen] = useAtom(isMobileNavbarOpenAtom);
  const onClose = () => setIsOpen(false);

  // 处理 ESC 键关闭导航
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 
        使用自定义实现而不是 DialogContent，因为 DialogContent 有强制的居中定位和固定大小
        这会导致在移动端菜单中产生样式问题
      */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-purple-900/95 backdrop-blur-xl border-l border-purple-300/10 shadow-2xl z-50">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-end p-6 border-b border-purple-300/10">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-purple-800/30 transition-colors duration-300"
                >
                  <X className="h-6 w-6 text-purple-200" />
                </Button>
              </div>

              {/* Centered Mobile Navigation */}
              <div className="flex-1 flex items-center justify-center p-4">
                <motion.ul 
                  className="flex flex-col gap-8 text-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {[
                    { href: "/", label: "Home" },
                    { href: "/browser", label: "Browser" },
                    { href: "/about", label: "About" },
                    { href: "/contact", label: "Contact" }
                  ].map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <Link
                        href={item.href}
                        className="block w-full px-4 py-3 text-2xl font-medium text-purple-100 hover:text-purple-300 hover:bg-purple-800/20 rounded-md transition-all duration-300"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
              
              {/* Footer section */}
              <div className="p-6 border-t border-purple-300/10 text-center">
                <p className="text-purple-300/70 text-sm">
                  Caitvi Archive &copy; {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
} 
"use client";
import { ArrowUpFromLine } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > window.innerHeight / 2) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <Button onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUpFromLine />
    </Button>
  )
};

export default ScrollToTopButton;

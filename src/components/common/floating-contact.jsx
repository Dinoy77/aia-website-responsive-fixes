
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const FloatingContactRight = () => {
  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(null);
  const containerRef = useRef(null);
  const dragConstraintsRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", (e) => setIsMobile(e.matches));
    return () =>
      mq.removeEventListener("change", (e) => setIsMobile(e.matches));
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile]);

  const items = [
    {
      icon: <Mail size={18} />,
      bg: "bg-[#0F3652]",
      link: "mailto:support@aia.in.net",
      label: "Email Us",
      glow: "shadow-[#0F3652]/40",
    },
    {
      icon: <Phone size={18} />,
      bg: "bg-[#F3831C]",
      link: "tel:+919311320114",
      label: "Call Us",
      glow: "shadow-[#F3831C]/40",
    },
    {
      icon: <FaWhatsapp size={20} />,
      bg: "bg-[#25D366]",
      link: "https://wa.me/919311320114?text=Hello,%20I%20am%20looking%20for%20Academy%20of%20Internal%20Audit",
      label: "WhatsApp",
      glow: "shadow-[#25D366]/40",
    },
  ];

  const handleMouseEnter = () => {
    if (!isMobile) setOpen(true);
  };
  const handleMouseLeave = () => {
    if (!isMobile) setOpen(false);
  };
  const handleClick = () => {
    if (isMobile) setOpen((prev) => !prev);
  };


  if (isMobile === null) return null;

  return (
  <>
    {/* Full screeen drag boundary */}
    <div
      ref={dragConstraintsRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
    />

    <motion.div
      drag
      dragConstraints={dragConstraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      className="fixed bottom-40 right-4 z-[9999] cursor-grab active:cursor-grabbing"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ✅ Content is INSIDE motion.div */}
      <div className="relative flex flex-row-reverse items-center gap-2.5">
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={open ? "Close contact options" : "Open contact options"}
          aria-expanded={open}
          className="relative h-14 w-14 rounded-xl overflow-hidden cursor-pointer
            shadow-lg transition-shadow duration-300 hover:shadow-xl shrink-0"
        >
          <div className="absolute inset-0 bg-[#F3831C]" />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-xl border-2 border-white/40"
          />
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 h-full flex items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01M12 10h.01M16 10h.01" />
                </>
              )}
            </svg>
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <div className="flex flex-row-reverse items-center gap-2.5">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 60, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 60, opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: (items.length - 1 - index) * 0.06,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="relative group"
                >
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                      px-2.5 py-1 bg-slate-800 text-white text-xs font-medium
                      rounded-md whitespace-nowrap pointer-events-none
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    role="tooltip"
                  >
                    {item.label}
                  </div>
                  <motion.a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative h-12 w-12 rounded-xl
                      ${item.bg}
                      flex items-center justify-center
                      text-white shadow-md ${item.glow}
                      transition-all duration-200
                      hover:shadow-lg cursor-pointer
                    `}
                    aria-label={item.label}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>  {/* ✅ Properly closed here */}
  </>
);
};

export default FloatingContactRight;

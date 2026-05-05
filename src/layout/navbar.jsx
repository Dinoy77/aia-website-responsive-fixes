import { ENROLL_URL, IMAGE_PATH } from "@/api/base-url";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/optmized-image";

// FIX: Replace react-icons (large bundle) with inline SVGs for social icons
// react-icons/fa adds ~40KB to the navbar chunk — these are tiny SVGs
const SocialIcons = {
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Pinterest: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  ),
};

const routePrefetch = {
  "/": () => import("../pages/Home/Home"),
  "/about-aia": () => import("../pages/About/About"),
  "/cfe-curriculum": () => import("../pages/Courses/CFECurriculam"),
  "/cia-curriculum": () => import("../pages/Courses/CIACurriculam"),
  "/cia-challenge-curriculum": () => import("../pages/Courses/CIAChallenge"),
  "/cams": () => import("../pages/Courses/CAMS"),
  "/cfe-free-resources": () => import("../pages/free-resources/cfe-free-resources"),
  "/blogs": () => import("../pages/Blog/Blog"),
  "/our-passouts": () => import("../pages/OurPassout/OurPassout"),
  "/corporate-training": () => import("../pages/corporate-training/corporate-training"),
  "/contact": () => import("../pages/contact/contact"),
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const links = [
    { icon: <Mail size={16} />, text: "support@aia.in.net", href: "mailto:support@aia.in.net", color: "text-[#F3831C]", underline: true },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.893 0C5.325 0 0 5.326 0 11.895c0 2.098.547 4.09 1.505 5.83L.057 24l6.304-1.654a11.882 11.882 0 005.532 1.369h.005C18.561 23.715 24 18.388 24 11.819 24 5.326 18.56 0 11.893 0z"/></svg>, text: "", href: "https://wa.me/+919311320114", color: "text-[#F3831C]", underline: false },
    { icon: <Phone size={16} />, text: "+91 93113 20114", href: "tel:+919311320114", color: "text-[#F3831C]", underline: true },
    { icon: <Phone size={16} />, text: "1800-1200-2555", href: "tel:18001200255", color: "text-white", underline: true },
  ];

  const socialLinks = [
    { Icon: SocialIcons.Facebook, url: "https://www.facebook.com/@academyofinternalaudit", label: "Facebook" },
    { Icon: SocialIcons.Twitter, url: "https://twitter.com/AcademyAudit", label: "Twitter" },
    { Icon: SocialIcons.Instagram, url: "https://www.instagram.com/academyofia/", label: "Instagram" },
    { Icon: SocialIcons.LinkedIn, url: "https://www.linkedin.com/company/academy-of-internal-audit", label: "LinkedIn" },
    { Icon: SocialIcons.Pinterest, url: "https://in.pinterest.com/academyofia/", label: "Pinterest" },
    { Icon: SocialIcons.YouTube, url: "https://www.youtube.com/@academyofia", label: "YouTube" },
  ];

  const menuItems = [
    { title: "Home", link: "/" },
    { title: "About", link: "/about-aia" },
    {
      title: "Courses",
      link: "#",
      submenu: [
        { name: "CFE Curriculum", link: "/cfe-curriculum" },
        { name: "CIA Curriculum", link: "/cia-curriculum" },
        { name: "CIA Challenge Exam Curriculum", link: "/cia-challenge-curriculum" },
        { name: "CAMS", link: "/cams" },
      ],
    },
    {
      title: "Free Resources",
      link: "#",
      submenu: [
        { name: "CFE Free Resources", link: "/cfe-free-resources" },
        { name: "CIA Free Resources", link: "/cia-free-resources" },
        { name: "CAMS Free Resources", link: "/cams-free-resources" },
      ],
    },
    { title: "Blogs", link: "/blogs" },
    { title: "Our Passouts", link: "/our-passouts" },
    { title: "Corporate Training", link: "/corporate-training" },
    { title: "Contact", link: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const prefetchRoute = (path) => {
    if (routePrefetch[path]) routePrefetch[path]();
  };

  return (
    <div className="w-full sticky top-0 z-[9999]">
      {/* TOP BLUE BAR */}
      <div className="flex justify-center md:justify-between bg-[#0F3652]">
        <div className="hidden md:block text-white py-2.5">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-6 text-sm">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-2 relative ${link.color} ${
                    link.underline
                      ? `transition-colors duration-300
                         after:content-[''] after:absolute after:left-0 after:bottom-0
                         after:h-[1px] after:w-full after:bg-current
                         after:scale-x-0 after:origin-right after:transition-transform
                         after:duration-500 after:ease-out
                         hover:after:scale-x-100 hover:after:origin-left`
                      : ""
                  }`}
                >
                  {link.icon}
                  {link.text && <span>{link.text}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-white py-2.5">
          <div className="px-4 flex justify-center items-center gap-4">
            {socialLinks.map(({ Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white hover:text-[#F3831C] transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <OptimizedImage
                  src={`${IMAGE_PATH}/new_logo.webp`}
                  alt="Academy of Internal Audit"
                  className="h-8 md:h-10 w-auto"
                  width={160}
                  height={40}
                  priority={true}
                />
              </Link>
            </div>

            {/* Desktop menu */}
            <ul className="hidden lg:flex items-center gap-6">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="relative group"
                  onMouseEnter={() => item.submenu && setActiveDropdown(index)}
                  onMouseLeave={() => item.submenu && setActiveDropdown(null)}
                >
                  <Link
                    onMouseEnter={() => prefetchRoute(item.link)}
                    to={item.link}
                    className="flex items-center gap-1 text-[#0F3652] font-medium hover:text-[#F3831C] transition-colors py-2 text-[15px]"
                  >
                    {item.title}
                    {item.submenu && <ChevronDown size={14} />}
                  </Link>

                  {item.submenu && (
                    <ul className={`absolute top-full left-0 mt-2 px-6 bg-white rounded-lg shadow-xl min-w-[220px] py-2 transition-all duration-300 ${
                      activeDropdown === index ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
                    }`}>
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.link}
                            className="relative inline-block py-2.5 text-sm text-[#0F3652] hover:text-[#F3831C] transition-colors duration-300
                              after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[1px] after:w-full after:bg-[#F3831C]
                              after:scale-x-0 after:origin-right after:transition-transform after:duration-500 after:ease-out
                              hover:after:scale-x-100 hover:after:origin-left"
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              <li>
                <Link
                  to={ENROLL_URL}
                  className="bg-[#F3831C] text-white px-6 py-2.5 rounded-none font-semibold hover:bg-[#F3831C]/90 transition-all"
                >
                  Enroll Now
                </Link>
              </li>
            </ul>

            {/* Hamburger */}
            <div className="lg:hidden">
              <button onClick={toggleMobileMenu} className="text-[#0F3652] focus:outline-none">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`lg:hidden fixed top-0 left-0 w-80 h-screen bg-white shadow-2xl transition-transform duration-300 overflow-y-auto z-[60] ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          <button onClick={toggleMobileMenu} className="absolute top-7 right-6 text-[#0F3652]">
            <X size={28} />
          </button>

          <div className="mb-8">
            <img
              src={`${IMAGE_PATH}/new_logo.webp`}
              alt="Academy of Internal Audit"
              className="h-8 md:h-10 w-auto"
              width={160}
              height={40}
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="mt-8">
            {menuItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center justify-between w-full py-4 text-[#0F3652] font-medium"
                    >
                      {item.title}
                      <ChevronDown size={16} className={`transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === index && (
                      <ul className="rounded-md mb-4">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.link}
                              onClick={handleMobileLinkClick}
                              className="relative inline-block px-4 py-2.5 text-sm text-[#0F3652] hover:text-[#F3831C] transition-colors duration-300
                                after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[1px] after:w-full after:bg-[#F3831C]
                                after:scale-x-0 after:origin-right after:transition-transform after:duration-500 after:ease-out
                                hover:after:scale-x-100 hover:after:origin-left"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a href={item.link} className="block py-4 text-[#0F3652] font-medium hover:text-[#F3831C] transition-colors">
                    {item.title}
                  </a>
                )}
              </div>
            ))}

            <div className="mt-6">
              <Link to={ENROLL_URL} className="block w-full bg-[#F3831C] text-white text-center px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-all">
                Enroll Now
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <a href="mailto:support@aia.in.net" className="flex items-center gap-2 text-sm text-[#0F3652] hover:text-[#F3831C]">
                <Mail size={16} /> support@aia.in.net
              </a>
              <a href="tel:+919311320114" className="flex items-center gap-2 text-sm text-[#0F3652] hover:text-[#F3831C]">
                <Phone size={16} /> +91 93113 20114
              </a>
              <a href="tel:+180012002555" className="flex items-center gap-2 text-sm text-[#0F3652] hover:text-[#F3831C]">
                <Phone size={16} /> 1800-1200-2555
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-[50] ${
          isMobileMenuOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      />
    </div>
  );
};

export default Navbar;
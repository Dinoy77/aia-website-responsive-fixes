import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout";

// Page-level code splitting (already good)
const CAMS = lazy(() => import("./pages/Courses/CAMS"));
const CFECurriculam = lazy(() => import("./pages/Courses/CFECurriculam"));
const CIAChallenge = lazy(() => import("./pages/Courses/CIAChallenge"));
const CIACurriculam = lazy(() => import("./pages/Courses/CIACurriculam"));
const FreeResources = lazy(() => import("./pages/free-resources/cfe-free-resources"));
const CAMSFreeResources = lazy(() => import("./pages/free-resources/cams-free-resources/cams-free-resources"));
const CIAFreeResources = lazy(() => import("./pages/free-resources/cia-free-resources/cia-free-resources"));
const Home = lazy(() => import("./pages/Home/Home"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const OurPassout = lazy(() => import("./pages/OurPassout/OurPassout"));
const Enrool = lazy(() => import("./pages/Enroll/Enroll"));
const Contact = lazy(() => import("./pages/contact/contact"));
const BlogDetails = lazy(() => import("./pages/Blog/blog-details"));
const AboutPage = lazy(() => import("./pages/About/About"));
const CorporateTraining = lazy(() => import("./pages/corporate-training/corporate-training"));
const Policies = lazy(() => import("./pages/policies/policies"));
const TermsAndConditions = lazy(() => import("./pages/terms-and-conditions/terms-and-conditions"));
const BlogCourse = lazy(() => import("./pages/Blog/blog-course"));
const CfePracticeQuestion = lazy(() => import("./pages/free-resources/cfe-practice-question"));
const PassoutStoriesSlug = lazy(() => import("./components/passout/passout-stories-slug"));
const NotFound = lazy(() => import("./components/common/not-found"));

// FIX: Lazy-load non-critical UI widgets — keeps them off the main bundle
// These are deferred internally (mount after 'load') but lazy import ensures
// their JS is not included in the initial chunk at all.
const NotificationPopup = lazy(() => import("./components/notification/notification-popup"));
const FloatingContact = lazy(() => import("./components/common/floating-contact"));
const GoogleAnalytics = lazy(() => import("./components/google-analytics/google-analytics"));

// These are lightweight — keep as static imports
import ScrollToTop from "./components/common/scroll-to-top";
import Meta from "./components/seo/meta";
import { Toaster } from "sonner";
import blogRedirects from "./routes/blog-redirects";
import SuspenseLoader from "./components/common/suspense-loader";

export default function App() {
  const location = useLocation();

  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col relative">
      <Meta />
      <ScrollToTop />

      {/* FIX: Wrap non-critical singletons in Suspense with null fallback
          so they don't block the page render at all */}
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>

      {!location.pathname.startsWith("/blogs/") && (
        <Suspense fallback={null}>
          <NotificationPopup />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <FloatingContact />
      </Suspense>

      <Toaster position="top-right" richColors />

      <Layout>
        <Suspense fallback={<SuspenseLoader />}>
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-aia" element={<AboutPage />} />
              <Route path="/about-us" element={<Navigate to="/about-aia" replace />} />
              <Route path="/cfe-curriculum" element={<CFECurriculam />} />
              <Route path="/cia-curriculum" element={<CIACurriculam />} />
              <Route path="/cia-challenge-curriculum" element={<CIAChallenge />} />
              <Route path="/cams" element={<CAMS />} />
              <Route path="/cia-free-resources" element={<CIAFreeResources />} />
              <Route path="/cams-free-resources" element={<CAMSFreeResources />} />
              <Route path="/cfe-free-resources" element={<FreeResources />} />
              <Route path="/cfe-free-resource/:questions_module" element={<CfePracticeQuestion />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/blogs/course/:courseName" element={<BlogCourse />} />
              <Route path="/our-passouts" element={<OurPassout />} />
              <Route path="/passed-out" element={<OurPassout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/passout-stories/:slug" element={<PassoutStoriesSlug />} />
              <Route path="/corporate-training" element={<CorporateTraining />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="*" element={<NotFound />} />
              {Object.entries(blogRedirects).map(([oldPath, newPath]) => (
                <Route key={oldPath} path={oldPath} element={<Navigate to={newPath} replace />} />
              ))}
            </Routes>
          </main>
        </Suspense>
      </Layout>
    </div>
  );
}
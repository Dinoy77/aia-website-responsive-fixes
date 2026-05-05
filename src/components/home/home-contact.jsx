import { BASE_URL } from "@/api/base-url";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TextCaptcha from "../custom-captcha/text-captcha";

let referralCache = null;
let referralFetchPromise = null;

const HomeContact = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    userLocation: "",
    userCourse: "",
    referred_from: "",
    userType: "Home",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
  });
  const [referral, setReferral] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("utm_source")) {
      localStorage.setItem("utm_source", params.get("utm_source"));
    }
    if (params.get("utm_medium")) {
      localStorage.setItem("utm_medium", params.get("utm_medium"));
    }
    if (params.get("utm_campaign")) {
      localStorage.setItem("utm_campaign", params.get("utm_campaign"));
    }
    setFormData({
      ...formData,
      utm_source: localStorage.getItem("utm_source") || "",
      utm_medium: localStorage.getItem("utm_medium") || "",
      utm_campaign: localStorage.getItem("utm_campaign") || "",
    });
  }, []);

  useEffect(() => {
    const loadReferral = async () => {
      if (referralCache) {
        setReferral(referralCache);
        return;
      }
      if (referralFetchPromise) {
        const data = await referralFetchPromise;
        setReferral(data);
        return;
      }

      referralFetchPromise = axios
        .get(`${BASE_URL}/api/fetch-webreffer`)
        .then((res) => {
          const data = res.data.data || [];
          referralCache = data;
          setReferral(data);
          return data;
        })
        .catch((error) => {
          referralFetchPromise = null;
          console.error("Error fetching referral:", error);
          return [];
        });
    };

    loadReferral();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (submitSuccess || submitError) {
      setSubmitSuccess(false);
      setSubmitError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError("");

    const requiredFields = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      userCourse: formData.userCourse.trim(),
    };

    if (!Object.values(requiredFields).every((f) => f !== "")) {
      setSubmitError("Please fill all required fields");
      return;
    }

    if (formData.phone.trim().length !== 10) {
      setSubmitError("Phone number must be exactly 10 digits");
      return;
    }

    if (!captchaVerified) {
      setCaptchaRequired(true);
      return;
    }

    const apiData = {
      userName: formData.name.trim(),
      userEmail: formData.email.trim(),
      userMobile: formData.phone.trim(),
      userMessage: formData.message.trim(),
      userCourse: formData.userCourse.trim(),
      userLocation: formData.userLocation.trim(),
      referred_from: formData.referred_from.trim(),
      userType: formData.userType.trim(),

      utm_source: formData.utm_source,
      utm_medium: formData.utm_medium,
      utm_campaign: formData.utm_campaign,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${BASE_URL}/api/create-webenquiry`,
        apiData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          ...formData,
          name: "",
          phone: "",
          email: "",
          userCourse: "",
          referred_from: "",
          message: "",
        });
        setCaptchaVerified(false);
        setCaptchaFailed(false);
        setCaptchaRequired(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerified = (isVerified) => {
    setCaptchaVerified(isVerified);
    setCaptchaFailed(!isVerified);
    if (isVerified) setCaptchaRequired(false);
  };

  return (
    <div className="space-y-2 md:mb-8">
      <div className="w-full bg-[#0F3652]/10">
        <div className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* ── Left column ── */}
            <div className="space-y-4">
              <div>
                <span className="text-xs md:text-sm font-medium text-[#F3831C] uppercase tracking-wider block">
                  Add Global Certifications for a brighter Career Path
                </span>
                <h2 className="text-[#0F3652] text-xl md:text-3xl mt-2 font-medium">
                  <span className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#0F3652] via-[#F3831C] to-[#F3831C] italic block mt-2">
                    Prepare. Certify. Succeed
                  </span>
                </h2>
                <p className="mt-2 text-[#0F3652] text-sm md:text-base">
                  Connect with experienced professionals and get clear, honest
                  guidance on choosing the right international certification for
                  your career goals.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 col-span-1 lg:col-span-2">
                {[
                  {
                    stat: "10k+ hours",
                    label: "Expert-Led Training Delivered",
                  },
                  {
                    stat: "2,000+ Professionals",
                    label: "Trained & Certified",
                  },
                  { stat: "22+ Years", label: "Industry Experience" },
                ].map(({ stat, label }) => (
                  <div
                    key={stat}
                    className="border-b-4 border-[#F3831C] pb-3 text-center"
                  >
                    <div className="text-lg font-bold text-[#0F3652]">
                      {stat}
                    </div>
                    <div className="text-xs md:text-sm text-[#0F3652] mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column — form ── */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone No*"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <textarea
                    name="message"
                    placeholder="Type Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm resize-none"
                    disabled={isSubmitting}
                  />
                  <select
                    name="userCourse"
                    value={formData.userCourse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm"
                  >
                    <option value="">Service Interested In *</option>
                    <option value="Certified Fraud Examiner">
                      Certified Fraud Examiner
                    </option>
                    <option value="Certified Internal Auditor">
                      Certified Internal Auditor
                    </option>
                    <option value="Certified Anti Money Laundering Specialist">
                      Certified Anti Money Laundering Specialist
                    </option>
                    <option value="CIA Challenge Exam">
                      CIA Challenge Exam
                    </option>
                  </select>
                  <select
                    name="referred_from"
                    value={formData.referred_from}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#0F3652] rounded focus:outline-none focus:ring-2 focus:ring-[#F3831C] text-sm"
                  >
                    <option value="">How You Know About AIA?</option>
                    {referral.map((item, index) => (
                      <option key={index} value={item.referred_from}>
                        {item.referred_from}
                      </option>
                    ))}
                  </select>
                </div>

                {/*
                  ── FIX 1: Reserve fixed height for the captcha/verified row.
                  Both states (captcha widget & verified badge) are rendered at
                  all times; only visibility is toggled via opacity + pointer-events.
                  This keeps the row height constant → zero layout shift.
                ── */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative grow">
                    {/* Captcha widget — always in DOM, hidden when verified */}
                    <div
                      ref={captchaRef}
                      className="w-full transition-opacity duration-200"
                      style={{
                        opacity: captchaVerified ? 0 : 1,
                        pointerEvents: captchaVerified ? "none" : "auto",
                        position: captchaVerified ? "absolute" : "relative",
                        inset: 0,
                      }}
                    >
                      <TextCaptcha
                        onVerify={handleCaptchaVerified}
                        onRefresh={() => {
                          setCaptchaVerified(false);
                          setCaptchaFailed(false);
                          setCaptchaRequired(false);
                        }}
                        showVerifyButton={false}
                        autoVerify={true}
                      />
                      {captchaFailed && (
                        <p className="text-red-500 text-xs mt-2">
                          CAPTCHA verification failed. Please try again.
                        </p>
                      )}
                    </div>

                    {/* Verified badges — always in DOM, hidden until verified */}
                    <div
                      className="flex items-center p-2 bg-green-50 border border-green-200 rounded-md transition-opacity duration-200"
                      style={{
                        opacity: captchaVerified ? 1 : 0,
                        pointerEvents: captchaVerified ? "auto" : "none",
                        position: captchaVerified ? "relative" : "absolute",
                        inset: captchaVerified ? undefined : 0,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600 mr-2 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-green-700 text-sm font-medium">
                        Verified successfully! You can now submit the form.
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="px-4 py-2 text-xs bg-[#F3831C] text-white rounded-none hover:bg-[#0F3652] transition-colors duration-300 cursor-pointer w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      variant="ghost"
                      disabled={!captchaVerified || isSubmitting}
                      aria-label="Submit Form"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="text-white">Submit</span>
                      )}
                    </Button>
                  </div>
                </div>

                <div
                  className="grid"
                  style={{
                    gridTemplateRows:
                      submitSuccess || submitError || captchaRequired
                        ? "1fr"
                        : "0fr",
                    transition: "grid-template-rows 250ms ease",
                  }}
                >
                  <div className="overflow-hidden space-y-2">
                    {submitSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-700 text-sm">
                          Thank you! Your message has been submitted
                          successfully.
                        </p>
                      </div>
                    )}

                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{submitError}</p>
                      </div>
                    )}

                    {captchaRequired && (
                      <p className="text-red-500 text-xs">
                        Please verify that you&apos;re not a robot before
                        submitting.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContact;

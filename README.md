
# AIA Website – Responsive Fixes

## Files Changed

### 1. Navbar.jsx
- Moved mobile sidebar and overlay **outside `<nav>`** tag (nav's `sticky` was trapping fixed elements)
- Fixed z-index conflict: sidebar `z-[60]`, overlay `z-[50]`
- Replaced conditional overlay render with always-rendered + `opacity-0` to prevent black flash on open
- Added smooth `transition-opacity` fade on overlay

### 2. `floating-contact.jsx`
- Converted the contact section into a **floating draggable button**
- Users can now drag and reposition the contact button anywhere on the screen
- Added Email, Phone, and WhatsApp quick contact options
- Button stays within screen boundaries using `dragConstraints`

### 3. `HomeContact.jsx`

Added phone number validation to the contact form
Restricted input to digits only — letters and special characters are automatically stripped as the user types
Enforced exactly 10 digits — user cannot type beyond 10 digits
Added inputMode="numeric" on the phone input to show the number keypad on mobile devices
Added maxLength={10} as an additional HTML-level guard
Form submission is blocked if phone number is less than 10 digits, with a clear error message: "Phone number must be exactly 10 digits"
Fixed a duplicate phone input field bug — the Name field was missing and phone field appeared twice in the form grid; restored correct field order: Name → Phone → Email → Message.
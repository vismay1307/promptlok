/**
 * scroll-to-section.ts
 * Smooth-scroll utility for in-page anchor links.
 * - Respects prefers-reduced-motion (uses "auto" when motion is reduced).
 * - Updates the hash via history.replaceState (no page jump).
 * - Moves focus to the section element for keyboard users.
 */

export function scrollToSection(
  event: React.MouseEvent<HTMLAnchorElement>,
  sectionId: string
): void {
  event.preventDefault();

  const target = document.getElementById(sectionId);
  if (!target) return;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  // Update hash without causing a jump
  history.replaceState(null, "", `#${sectionId}`);

  // Move focus to the section for keyboard/screen-reader users
  const prevTabIndex = target.getAttribute("tabindex");
  if (!prevTabIndex) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
  if (!prevTabIndex) {
    // Remove tabindex after blur so it doesn't remain in tab order
    target.addEventListener(
      "blur",
      () => target.removeAttribute("tabindex"),
      { once: true }
    );
  }
}

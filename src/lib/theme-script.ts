/**
 * Source for an inline boot script rendered as the first thing in <body>.
 * Runs synchronously before React hydrates, so the theme class is already
 * correct on first paint — no flash of the wrong theme. Kept as a plain
 * string (not JSX) so it can go straight into dangerouslySetInnerHTML.
 *
 * Default is dark (the brand's native mode) unless she's explicitly chosen
 * light before.
 */
export const THEME_STORAGE_KEY = "ofy-theme";

export const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

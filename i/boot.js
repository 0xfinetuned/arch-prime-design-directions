// Theme and motion flags before first paint: ?theme forces, else the saved choice, else dark.
(function () {
  var q = new URLSearchParams(location.search);
  var t = q.get("theme");
  if (t !== "light" && t !== "dark") { try { t = localStorage.getItem("lumen-theme"); } catch (e) {} }
  if (t !== "light" && t !== "dark") t = "dark";
  var d = document.documentElement;
  d.dataset.theme = t;
  d.classList.add(q.has("still") ? "still" : "motion");
})();

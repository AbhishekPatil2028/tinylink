// Copy buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    navigator.clipboard.writeText(e.target.dataset.url);
    alert("Copied!");
  }
});

// Delete buttons
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const code = e.target.dataset.code;

    if (!confirm("Delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });

    location.reload();
  }
});

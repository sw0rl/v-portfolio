const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navLinks = navigation.querySelectorAll("a");

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: "0px 0px -8%", threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.querySelector("[data-year]").textContent = new Date().getFullYear();

document.querySelectorAll(".carousel-shell").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");

  const updateControls = () => {
    const end = track.scrollWidth - track.clientWidth - 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= end;
  };

  const move = (direction) => {
    const card = track.querySelector(":scope > *");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
});

document.querySelectorAll(".video-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const id = trigger.dataset.video;
    const title = trigger.dataset.title;

    if (window.location.protocol === "file:") {
      window.open(`https://www.youtube.com/watch?v=${id}`, "_blank", "noopener,noreferrer");
      return;
    }

    const playerUrl = new URL(`https://www.youtube.com/embed/${id}`);
    playerUrl.searchParams.set("autoplay", "1");
    playerUrl.searchParams.set("playsinline", "1");
    playerUrl.searchParams.set("rel", "0");
    playerUrl.searchParams.set("origin", window.location.origin);
    playerUrl.searchParams.set("widget_referrer", window.location.href);

    const iframe = document.createElement("iframe");
    iframe.src = playerUrl.toString();
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "origin-when-cross-origin";
    iframe.allowFullscreen = true;
    trigger.replaceWith(iframe);
  });
});

const audioPlayers = document.querySelectorAll("audio");
audioPlayers.forEach((player) => {
  player.addEventListener("play", () => {
    audioPlayers.forEach((otherPlayer) => {
      if (otherPlayer !== player) otherPlayer.pause();
    });
  });
});

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animate account cards on scroll
gsap.from(".account-card", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".account-card",
        start: "top 80%",
    },
});

// Animate header text
gsap.from("header h1", {
    opacity: 0,
    y: -50,
    duration: 1,
    delay: 0.5,
});

gsap.from("header p", {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 1,
});
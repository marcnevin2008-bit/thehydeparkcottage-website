export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ivory: "#FAF7F2",
        moss: "#2F4F3A",
        sage: "#7A8F77",
        clay: "#C76B50",
        coal: "#1C1B1A",
        linen: "#F4EFE8",
      },
      boxShadow: { soft: "0 10px 24px -12px rgba(0,0,0,0.15)" },
      borderRadius: { "3xl": "1.5rem" },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 600px at 20% 10%, rgba(199,107,80,0.08), transparent 50%), radial-gradient(800px 400px at 90% 0%, rgba(47,79,58,0.08), transparent 50%)",
      },
    },
  },
  plugins: [],
}

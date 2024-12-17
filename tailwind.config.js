const typography = require('@tailwindcss/typography');

module.exports = {
	content: ['./hugo_stats.json'],
	plugins: [typography],
	theme: {
    extend: {
      fontFamily: {
        Neucha: ["Neucha"],
        Nunito: ["Nunito"],
        Pacifico: ["Pacifico"],
        PatrickHand: ["Patrick Hand"],
        PermanentMarker: ["Permanent Marker"],
        BebasNeue: ["Bebas Neue"],
        RockSalt: ["Rock Salt"],
        UbuntuMono: ["Ubuntu Mono"],
        VT323: ["VT323"],
        Fira: ["Fira Mono"],
      },
    },
  },
};

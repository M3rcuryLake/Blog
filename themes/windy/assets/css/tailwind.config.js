module.exports = {
  content: [
    "./themes/**/layouts/**/*.html",
    "./content/**/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily :{
        DancingScript :['Dancing Script'],
        Montserrat :['Montserrat'],
        Neucha :['Neucha'],
        Nunito :['Nunito'],
        Pacifico :['Pacifico'],
        PatrickHand :['Patrick Hand'],
        PermanentMarker :['Permanent Marker'],
        BebasNeue :['Bebas Neue'],
        FredokaOne :['Fredoka One'],
        RockSalt : ['Rock Salt']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ]
}

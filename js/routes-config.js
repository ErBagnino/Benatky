// Route metadata: password gate, visual accent, and card teaser text per language.
// Passwords are intentionally simple, playful "secret words" for the treasure-hunt game,
// not real security — anyone organizing the hunt can hand them out to players on paper.
window.ROUTES_CONFIG = [
  {
    id: "trasa1",
    number: 1,
    password: "gondola1",
    accent: "#8c1c2b",
    accent2: "#b23a4e",
    stops: 43,
    name: {
      cz: "Od Schiavoni k Arsenálu",
      it: "Da Schiavoni all'Arsenale",
      en: "From Schiavoni to the Arsenale"
    },
    teaser: {
      cz: "Od Riva degli Schiavoni přes Arsenale až k Rialtu — nejdelší a nejbohatší ze všech tras.",
      it: "Da Riva degli Schiavoni, attraverso l'Arsenale, fino a Rialto — il percorso più lungo e ricco di tutti.",
      en: "From Riva degli Schiavoni, past the Arsenale, all the way to Rialto — the longest and richest of all routes."
    }
  },
  {
    id: "trasa2",
    number: 2,
    password: "rialto2",
    accent: "#1c5d8c",
    accent2: "#2f86bf",
    stops: 45,
    name: {
      cz: "Skryté uličky k San Marku",
      it: "Calli nascoste verso San Marco",
      en: "Hidden Backstreets to St Mark's"
    },
    teaser: {
      cz: "Kolem kostela Della Pietà, skrytými uličkami až na náměstí Svatého Marka.",
      it: "Intorno alla Chiesa della Pietà, tra calli nascoste, fino a Piazza San Marco.",
      en: "Around the Chiesa della Pietà, through hidden backstreets, all the way to St Mark's Square."
    }
  },
  {
    id: "trasa3",
    number: 3,
    password: "vivaldi3",
    accent: "#2a7a5b",
    accent2: "#3fae82",
    stops: 34,
    name: {
      cz: "Rodinná zkrácená trasa",
      it: "Il percorso breve per famiglie",
      en: "The Short Family Route"
    },
    teaser: {
      cz: "Kratší dobrodružství pro rodiny s dětmi — stejné kouzlo Benátek, méně kroků.",
      it: "Un'avventura più breve per famiglie con bambini — la stessa magia di Venezia, meno passi.",
      en: "A shorter adventure for families with kids — all the magic of Venice, fewer steps."
    }
  },
  {
    id: "trasa4",
    number: 4,
    password: "laguna4",
    accent: "#6a4c93",
    accent2: "#8f6fc4",
    stops: 30,
    name: {
      cz: "Rychlá výprava",
      it: "La spedizione veloce",
      en: "The Quick Expedition"
    },
    teaser: {
      cz: "Nejrychlejší výprava — ideální, když vám loďka na návrat pluje už brzy.",
      it: "La spedizione più rapida — perfetta se il vostro vaporetto di ritorno parte presto.",
      en: "The quickest expedition — perfect when your boat back is leaving soon."
    }
  },
  {
    id: "trasa5",
    number: 5,
    password: "carnevale5",
    accent: "#c07a1e",
    accent2: "#e0a23e",
    stops: 39,
    name: {
      cz: "Až na vrchol zvonice",
      it: "Fino in cima al Campanile",
      en: "All the Way to the Campanile"
    },
    teaser: {
      cz: "Cesta, která končí až na vrcholu zvonice Svatého Marka s výhledem na celé Benátky.",
      it: "Un percorso che si conclude in cima al Campanile di San Marco, con vista su tutta Venezia.",
      en: "A route that finishes atop St Mark's Campanile, with a view over all of Venice."
    }
  }
];

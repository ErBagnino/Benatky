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
  },
  {
    id: "trasa6",
    number: 6,
    password: "maschera6",
    accent: "#1a8a8a",
    accent2: "#2fb3b3",
    stops: 33,
    name: {
      cz: "Za lvíčky u Baziliky",
      it: "Fino ai leoncini della Basilica",
      en: "To the Lion Cubs at the Basilica"
    },
    teaser: {
      cz: "Od Riva degli Schiavoni přes benátská zákoutí až ke lvíčkům u Baziliky svatého Marka.",
      it: "Da Riva degli Schiavoni, tra i vicoli veneziani, fino ai leoncini della Basilica di San Marco.",
      en: "From Riva degli Schiavoni, through Venetian back alleys, all the way to the lion cubs at St Mark's Basilica."
    }
  },
  {
    id: "trasa7",
    number: 7,
    password: "traghetto7",
    accent: "#a8275c",
    accent2: "#d1487f",
    stops: 40,
    name: {
      cz: "Přes Rialto na Campo San Bortolomio",
      it: "Fino a Rialto e Campo San Bortolomio",
      en: "Across the Rialto to Campo San Bortolomio"
    },
    teaser: {
      cz: "Od Schiavoni přes Rialto až na Campo San Bortolomio — nejdelší z nových tras.",
      it: "Da Schiavoni, attraverso Rialto, fino a Campo San Bortolomio — il più lungo dei nuovi percorsi.",
      en: "From Schiavoni, across the Rialto, all the way to Campo San Bortolomio — the longest of the new routes."
    }
  },
  {
    id: "trasa8",
    number: 8,
    password: "leoncini8",
    accent: "#2c3e7a",
    accent2: "#4a5fa8",
    stops: 35,
    name: {
      cz: "Dóžecím palácem k Bazilice",
      it: "Dal Palazzo Ducale alla Basilica",
      en: "Through the Doge's Palace to the Basilica"
    },
    teaser: {
      cz: "Cesta plná paláců a mozaik — od Dóžecího paláce až ke lvíčkům u Baziliky svatého Marka.",
      it: "Un percorso ricco di palazzi e mosaici — dal Palazzo Ducale ai leoncini della Basilica di San Marco.",
      en: "A route full of palaces and mosaics — from the Doge's Palace to the lion cubs at St Mark's Basilica."
    }
  }
];

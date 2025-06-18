// Función para obtener logos de equipos basados en su nombre
export function getTeamLogo(teamName: string): string {
  const logos: Record<string, string> = {
    // Equipos europeos
    "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    "Chelsea" : "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    "Juventus": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Juventus_FC_-_logo_black_%28Italy%2C_2017%29.svg",
    "Borussia Dortmund": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
    "Inter Milan": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
    "PSG": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
    "Atlético Madrid": "https://upload.wikimedia.org/wikipedia/fr/9/93/Logo_Atl%C3%A9tico_Madrid_2017.svg",
    "Benfica": "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg",
    "Porto": "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg",
    "RB Salzburg": "https://upload.wikimedia.org/wikipedia/en/7/77/FC_Red_Bull_Salzburg_logo.svg",

    // Equipos sudamericanos
    "Flamengo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg",
    "Boca Juniors": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Boca_Juniors_logo18.svg",
    "River Plate": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg",
    Fluminense: "https://upload.wikimedia.org/wikipedia/commons/1/1d/FFC_crest.svg",
    Palmeiras: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
    Botafogo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",

    // Equipos norteamericanos
    "Pachuca": "https://upload.wikimedia.org/wikipedia/it/9/95/Pachuca_CF_Logo.svg",
    Monterrey: "https://upload.wikimedia.org/wikipedia/commons/3/35/Club_de_F%C3%BAtbol_Monterrey_2019_Logo.svg",
    "LA Football Club": "https://upload.wikimedia.org/wikipedia/commons/8/86/Los_Angeles_Football_Club.svg",
    "Inter Miami": "https://upload.wikimedia.org/wikipedia/en/5/5c/Inter_Miami_CF_logo.svg",
    "Seattle Sounders": "https://upload.wikimedia.org/wikipedia/en/2/27/Seattle_Sounders_FC.svg",

    // Equipos asiáticos
    "Al Hilal": "https://upload.wikimedia.org/wikipedia/commons/5/55/Al_Hilal_SFC_Logo.svg",
    "Urawa Red Diamonds": "https://upload.wikimedia.org/wikipedia/fr/b/b2/Urawa_Red_Diamonds_%28logo%29.svg",
    "Al Ain": "https://upload.wikimedia.org/wikipedia/fr/4/49/Al_Ain_FC_logo.png",
    "Ulsan HD": "https://upload.wikimedia.org/wikipedia/en/b/b5/Ulsan_Hyundai_FC.svg",

    // Equipos africanos
    "Wydad AC": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Wydad_Athletic_Club_logo.svg",
    "Espérance de Tunis": "https://upload.wikimedia.org/wikipedia/el/3/3d/Esp%C3%A9rance_Sportive_de_Tunis_%28logo%29.svg",
    "Al Ahly": "https://upload.wikimedia.org/wikipedia/ar/2/21/Al_Ahly_SC_logo_23.svg",
    "Mamelodi Sundowns": "https://upload.wikimedia.org/wikipedia/pt/9/93/Mamelodi_Sundowns_FC.png",

    // Equipos de Oceanía
    "Auckland City": "https://upload.wikimedia.org/wikipedia/ar/9/9f/Auckland_City_FC_logo.svg",
  }

  // Devolver el logo si existe, o un placeholder si no
  return (
    logos[teamName] ||
    `https://via.placeholder.com/50x50/FFD700/000000?text=${encodeURIComponent(teamName.substring(0, 3))}`
  )
}

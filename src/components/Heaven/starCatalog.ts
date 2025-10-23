export interface StarData {
    name: string;
    ra: number;
    dec: number;
    magnitude: number;
    constellation?: string;
}

export const brightStars: StarData[] = [
    { name: 'Polaris', ra: 2.53, dec: 89.264, magnitude: 2.0, constellation: 'Ursa Minor' },
    { name: 'Sirius', ra: 6.752, dec: -16.716, magnitude: -1.46, constellation: 'Canis Major' },
    { name: 'Canopus', ra: 6.399, dec: -52.696, magnitude: -0.74, constellation: 'Carina' },
    { name: 'Arcturus', ra: 14.261, dec: 19.182, magnitude: -0.05, constellation: 'Boötes' },
    { name: 'Vega', ra: 18.615, dec: 38.783, magnitude: 0.03, constellation: 'Lyra' },
    { name: 'Capella', ra: 5.278, dec: 45.998, magnitude: 0.08, constellation: 'Auriga' },
    { name: 'Rigel', ra: 5.242, dec: -8.202, magnitude: 0.13, constellation: 'Orion' },
    { name: 'Procyon', ra: 7.655, dec: 5.225, magnitude: 0.34, constellation: 'Canis Minor' },
    { name: 'Betelgeuse', ra: 5.919, dec: 7.407, magnitude: 0.5, constellation: 'Orion' },
    { name: 'Altair', ra: 19.846, dec: 8.868, magnitude: 0.76, constellation: 'Aquila' },

    { name: 'Aldebaran', ra: 4.599, dec: 16.509, magnitude: 0.85, constellation: 'Taurus' },
    { name: 'Spica', ra: 13.42, dec: -11.161, magnitude: 0.97, constellation: 'Virgo' },
    { name: 'Antares', ra: 16.49, dec: -26.432, magnitude: 1.06, constellation: 'Scorpius' },
    { name: 'Pollux', ra: 7.755, dec: 28.026, magnitude: 1.14, constellation: 'Gemini' },
    { name: 'Fomalhaut', ra: 22.961, dec: -29.622, magnitude: 1.16, constellation: 'Piscis Austrinus' },
    { name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25, constellation: 'Cygnus' },
    { name: 'Regulus', ra: 10.14, dec: 11.967, magnitude: 1.35, constellation: 'Leo' },
    { name: 'Castor', ra: 7.577, dec: 31.888, magnitude: 1.58, constellation: 'Gemini' },

    { name: 'Alioth', ra: 12.9, dec: 55.96, magnitude: 1.77, constellation: 'Ursa Major' },
    { name: 'Dubhe', ra: 11.062, dec: 61.751, magnitude: 1.79, constellation: 'Ursa Major' },
    { name: 'Alkaid', ra: 13.792, dec: 49.313, magnitude: 1.86, constellation: 'Ursa Major' },
    { name: 'Mizar', ra: 13.399, dec: 54.925, magnitude: 2.04, constellation: 'Ursa Major' },
    { name: 'Merak', ra: 11.031, dec: 56.382, magnitude: 2.37, constellation: 'Ursa Major' },
    { name: 'Phecda', ra: 11.897, dec: 53.695, magnitude: 2.44, constellation: 'Ursa Major' },
    { name: 'Megrez', ra: 12.257, dec: 57.032, magnitude: 3.31, constellation: 'Ursa Major' },

    { name: 'Schedar', ra: 0.675, dec: 56.537, magnitude: 2.23, constellation: 'Cassiopeia' },
    { name: 'Caph', ra: 0.153, dec: 59.15, magnitude: 2.27, constellation: 'Cassiopeia' },
    { name: 'Ruchbah', ra: 1.43, dec: 60.235, magnitude: 2.68, constellation: 'Cassiopeia' },
    { name: 'Segin', ra: 1.901, dec: 63.67, magnitude: 3.37, constellation: 'Cassiopeia' },
    { name: 'Cih', ra: 0.945, dec: 60.717, magnitude: 2.47, constellation: 'Cassiopeia' },

    { name: 'Bellatrix', ra: 5.419, dec: 6.35, magnitude: 1.64, constellation: 'Orion' },
    { name: 'Alnilam', ra: 5.603, dec: -1.202, magnitude: 1.69, constellation: 'Orion' },
    { name: 'Alnitak', ra: 5.679, dec: -1.943, magnitude: 1.77, constellation: 'Orion' },
    { name: 'Saiph', ra: 5.796, dec: -9.67, magnitude: 2.06, constellation: 'Orion' },
    { name: 'Mintaka', ra: 5.533, dec: -0.299, magnitude: 2.23, constellation: 'Orion' },

    { name: 'Kochab', ra: 14.845, dec: 74.155, magnitude: 2.08, constellation: 'Ursa Minor' },
    { name: 'Pherkad', ra: 15.345, dec: 71.834, magnitude: 3.0, constellation: 'Ursa Minor' },

    { name: 'Algol', ra: 3.136, dec: 40.956, magnitude: 2.12, constellation: 'Perseus' },
    { name: 'Mirfak', ra: 3.405, dec: 49.861, magnitude: 1.79, constellation: 'Perseus' },

    { name: 'Alhena', ra: 6.628, dec: 16.399, magnitude: 1.93, constellation: 'Gemini' },
    { name: 'Elnath', ra: 5.438, dec: 28.608, magnitude: 1.65, constellation: 'Taurus' },

    { name: 'Hamal', ra: 2.119, dec: 23.463, magnitude: 2.0, constellation: 'Aries' },
    { name: 'Alpheratz', ra: 0.14, dec: 29.091, magnitude: 2.06, constellation: 'Andromeda' },
    { name: 'Mirach', ra: 1.162, dec: 35.621, magnitude: 2.06, constellation: 'Andromeda' },

    { name: 'Algedi', ra: 20.297, dec: -12.508, magnitude: 3.58, constellation: 'Capricornus' },
    { name: 'Deneb Algedi', ra: 21.784, dec: -16.127, magnitude: 2.87, constellation: 'Capricornus' },

    { name: 'Rasalhague', ra: 17.582, dec: 12.56, magnitude: 2.08, constellation: 'Ophiuchus' },
    { name: 'Alderamin', ra: 21.31, dec: 62.585, magnitude: 2.44, constellation: 'Cepheus' },
];

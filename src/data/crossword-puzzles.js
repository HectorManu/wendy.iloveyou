export const crosswordPuzzles = [
  {
    id: 'cw-001',
    name: 'CRUCIGRAMA DEL AMOR',
    gridSize: 7,
    solution: [
      ['A','M','O','R','#','#','#'],
      ['#','#','#','O','#','#','#'],
      ['B','E','S','S','#','#','#'],
      ['#','#','#','A','B','R','A'],
      ['L','U','N','A','#','#','#'],
      ['#','#','#','#','#','#','#'],
      ['C','I','T','A','#','#','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 0, length: 4, clue: 'Lo que siento por ti', answer: 'AMOR', hint: 'Empieza con A, 4 letras' },
        { number: 3, row: 2, col: 0, length: 3, clue: 'Lo que te doy cada dia en los labios', answer: 'BES', hint: 'Empieza con B, rima con "tres"' },
        { number: 4, row: 3, col: 3, length: 4, clue: 'Te envuelvo con mis brazos', answer: 'ABRA', hint: 'Empieza con A, es parte de ABRAZO' },
        { number: 5, row: 4, col: 0, length: 4, clue: 'Nos ilumina en las noches romanticas', answer: 'LUNA', hint: 'Empieza con L, esta en el cielo' },
        { number: 6, row: 6, col: 0, length: 4, clue: 'Una salida romantica entre dos', answer: 'CITA', hint: 'Empieza con C, 4 letras' }
      ],
      down: [
        { number: 2, row: 0, col: 3, length: 4, clue: 'Flor roja con espinas', answer: 'ROSA', hint: 'Empieza con R, es una flor' }
      ]
    }
  },
  {
    id: 'cw-002',
    name: 'PALABRAS DULCES',
    gridSize: 7,
    solution: [
      ['F','L','O','R','#','#','#'],
      ['#','#','#','I','#','#','#'],
      ['A','L','M','A','#','#','#'],
      ['#','#','I','#','#','#','#'],
      ['#','#','E','#','S','O','L'],
      ['#','#','L','U','N','A','#'],
      ['P','A','Z','#','#','#','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 0, length: 4, clue: 'Se regala con amor, crece en el jardin', answer: 'FLOR', hint: 'Empieza con F, tiene petalos' },
        { number: 3, row: 2, col: 0, length: 4, clue: 'La mia es tuya para siempre', answer: 'ALMA', hint: 'Empieza con A, es espiritual' },
        { number: 5, row: 4, col: 4, length: 3, clue: 'Nos da calor y brilla de dia', answer: 'SOL', hint: 'Empieza con S, esta en el cielo' },
        { number: 6, row: 5, col: 2, length: 4, clue: 'Sale de noche y es redonda', answer: 'LUNA', hint: 'Empieza con L, ilumina la noche' },
        { number: 7, row: 6, col: 0, length: 3, clue: 'Tranquilidad que siento contigo', answer: 'PAZ', hint: 'Empieza con P, 3 letras' }
      ],
      down: [
        { number: 2, row: 0, col: 3, length: 2, clue: 'Tu sonido favorito, muestra alegria', answer: 'RI', hint: 'Empieza con R, de RISA' },
        { number: 4, row: 2, col: 2, length: 5, clue: 'Dulce como tu, la ponen las abejas', answer: 'MIEL', hint: 'Empieza con M, es dorada y dulce' }
      ]
    }
  },
  {
    id: 'cw-003',
    name: 'NUESTRO MUNDO',
    gridSize: 7,
    solution: [
      ['#','C','A','S','A','#','#'],
      ['#','A','#','#','#','#','#'],
      ['#','R','E','I','R','#','#'],
      ['#','I','#','#','#','#','#'],
      ['#','N','O','V','I','A','#'],
      ['#','O','#','#','#','#','#'],
      ['#','#','O','J','O','S','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 1, length: 4, clue: 'Nuestro hogar, donde vivimos juntos', answer: 'CASA', hint: 'Empieza con C, tiene techo y paredes' },
        { number: 3, row: 2, col: 1, length: 4, clue: 'Lo que hacemos juntos cuando estamos felices', answer: 'REIR', hint: 'Empieza con R, muestra alegria' },
        { number: 4, row: 4, col: 1, length: 5, clue: 'Tu titulo oficial, mi princesa', answer: 'NOVIA', hint: 'Empieza con N, 5 letras' },
        { number: 5, row: 6, col: 2, length: 4, clue: 'Los tuyos son los mas hermosos que he visto', answer: 'OJOS', hint: 'Empieza con O, sirven para ver' }
      ],
      down: [
        { number: 2, row: 0, col: 1, length: 6, clue: 'Afecto y ternura que te tengo', answer: 'CARINO', hint: 'Empieza con C, sinonimo de amor' }
      ]
    }
  }
];

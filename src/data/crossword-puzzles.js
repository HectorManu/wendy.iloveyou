export const crosswordPuzzles = [
  {
    id: 'cw-001',
    name: 'CRUCIGRAMA DEL AMOR',
    gridSize: 8,
    // '#' = black cell
    solution: [
      ['A','M','O','R','#','#','#','#'],
      ['#','#','#','O','#','B','#','#'],
      ['#','#','#','S','U','E','N','O'],
      ['#','#','#','A','#','S','#','#'],
      ['#','L','U','N','A','O','#','#'],
      ['#','#','#','#','#','#','#','#'],
      ['C','I','T','A','#','V','I','D'],
      ['#','#','#','#','#','I','#','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 0, length: 4, clue: 'Lo que siento por ti', answer: 'AMOR' },
        { number: 3, row: 2, col: 3, length: 5, clue: 'Contigo se cumplen todos', answer: 'SUENO' },
        { number: 5, row: 4, col: 1, length: 4, clue: 'Nos ilumina en las noches', answer: 'LUNA' },
        { number: 6, row: 6, col: 0, length: 4, clue: 'Una salida romantica', answer: 'CITA' },
        { number: 7, row: 6, col: 5, length: 3, clue: 'La comparto contigo', answer: 'VID' }
      ],
      down: [
        { number: 2, row: 0, col: 3, length: 4, clue: 'Flor con espinas', answer: 'ROSA' },
        { number: 4, row: 1, col: 5, length: 4, clue: 'Lo que te doy cada dia', answer: 'BESO' },
        { number: 8, row: 6, col: 5, length: 2, clue: 'Verbo: Mire', answer: 'VI' }
      ]
    }
  },
  {
    id: 'cw-002',
    name: 'PALABRAS DE CARIÑO',
    gridSize: 8,
    solution: [
      ['#','#','F','L','O','R','#','#'],
      ['#','#','#','#','#','I','#','#'],
      ['A','L','M','A','#','S','#','#'],
      ['#','#','I','#','#','A','#','#'],
      ['#','#','E','S','T','R','E','L'],
      ['#','#','L','#','#','#','#','U'],
      ['P','A','Z','#','D','O','N','Z'],
      ['#','#','#','#','#','#','#','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 2, length: 4, clue: 'Se regala con amor', answer: 'FLOR' },
        { number: 3, row: 2, col: 0, length: 4, clue: 'La mia es tuya', answer: 'ALMA' },
        { number: 5, row: 4, col: 2, length: 6, clue: 'Brilla en el cielo nocturno', answer: 'ESTREL' },
        { number: 6, row: 6, col: 0, length: 3, clue: 'Tranquilidad interior', answer: 'PAZ' },
        { number: 7, row: 6, col: 4, length: 3, clue: 'Regalo o presente', answer: 'DON' }
      ],
      down: [
        { number: 2, row: 0, col: 5, length: 5, clue: 'Tu sonido favorito', answer: 'RISA' },
        { number: 4, row: 2, col: 2, length: 4, clue: 'Dulce como tu', answer: 'MIEL' },
        { number: 8, row: 4, col: 7, length: 3, clue: 'Claridad brillante', answer: 'LUZ' }
      ]
    }
  },
  {
    id: 'cw-003',
    name: 'NUESTRO MUNDO',
    gridSize: 8,
    solution: [
      ['#','#','#','C','A','S','A','#'],
      ['#','B','#','A','#','#','B','#'],
      ['#','R','E','R','I','R','#','#'],
      ['#','I','#','I','#','#','#','#'],
      ['#','L','#','N','O','V','I','A'],
      ['#','L','#','O','#','#','#','#'],
      ['#','O','J','O','S','#','#','#'],
      ['#','#','#','#','#','#','#','#']
    ],
    clues: {
      across: [
        { number: 1, row: 0, col: 3, length: 4, clue: 'Nuestro hogar juntos', answer: 'CASA' },
        { number: 3, row: 2, col: 1, length: 4, clue: 'Lo que hacemos juntos', answer: 'REIR' },
        { number: 5, row: 4, col: 3, length: 5, clue: 'Tu titulo oficial', answer: 'NOVIA' },
        { number: 6, row: 6, col: 1, length: 4, clue: 'Los tuyos son hermosos', answer: 'OJOS' }
      ],
      down: [
        { number: 2, row: 0, col: 3, length: 5, clue: 'Afecto y ternura', answer: 'CARIN' },
        { number: 4, row: 1, col: 1, length: 6, clue: 'Luz que resplandece', answer: 'BRILLO' },
        { number: 7, row: 0, col: 6, length: 2, clue: 'Saludo informal', answer: 'AB' }
      ]
    }
  }
];

import { _mock } from 'src/shared/_mock/_mock';
import { _tags, _fileNames } from 'src/shared/_mock/assets';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

const FOLDERS = ['Documents', 'Projets', 'Travail', 'Formation', 'Sport', 'Aliments'];

const URLS = [
  _mock.image.cover(1),
  'https://www.cloud.com/s/c218bo6kjuqyv66/design_suriname_2015.mp3',
  'https://www.cloud.com/s/c218bo6kjuqyv66/expertise_2015_conakry_sao-tome-and-principe_gender.mp4',
  'https://www.cloud.com/s/c218bo6kjuqyv66/money-popup-crack.pdf',
  _mock.image.cover(3),
  _mock.image.cover(5),
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_news.txt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/nauru-6015-small-fighter-left-gender.psd',
  'https://www.cloud.com/s/c218bo6kjuqyv66/tv-xs.doc',
  'https://www.cloud.com/s/c218bo6kjuqyv66/gustavia-entertainment-productivity.docx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/vintage_bahrain_saipan.xls',
  'https://www.cloud.com/s/c218bo6kjuqyv66/indonesia-quito-nancy-grace-left-glad.xlsx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/legislation-grain.zip',
  'https://www.cloud.com/s/c218bo6kjuqyv66/large_energy_dry_philippines.rar',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-243-ecuador.iso',
  'https://www.cloud.com/s/c218bo6kjuqyv66/kyrgyzstan-04795009-picabo-street-guide-style.ai',
  'https://www.cloud.com/s/c218bo6kjuqyv66/india-data-large-gk-chesterton-mother.esp',
  'https://www.cloud.com/s/c218bo6kjuqyv66/footer-barbados-celine-dion.ppt',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_respectively_366996.pptx',
  'https://www.cloud.com/s/c218bo6kjuqyv66/socio_ahead_531437_sweden_popup.wav',
  'https://www.cloud.com/s/c218bo6kjuqyv66/trinidad_samuel-morse_bring.m4v',
  _mock.image.cover(11),
  _mock.image.cover(17),
  'https://www.cloud.com/s/c218bo6kjuqyv66/xl_david-blaine_component_tanzania_books.pdf',
];

const SHARED_PERSONS = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  avatarUrl: _mock.image.avatar(index),
  permission: index % 2 ? 'view' : 'edit',
}));

export const FILE_TYPE_OPTIONS = [
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
];

// ----------------------------------------------------------------------

// Hierarchical data for the items
const hierarchy = [
  {
    niveau: 'Niveau 1',
    matieres: [
      {
        matiere: 'Matière 1',
        chapitres: [
          { chapitre: 'Chapitre 1', exercices: ['Exercice 1', 'Exercice 2'] },
          { chapitre: 'Chapitre 2', exercices: ['Exercice 3', 'Exercice 4'] },
        ],
      },
      {
        matiere: 'Matière 2',
        chapitres: [
          { chapitre: 'Chapitre 3', exercices: ['Exercice 5', 'Exercice 6'] },
          { chapitre: 'Chapitre 4', exercices: ['Exercice 7', 'Exercice 8'] },
        ],
      },
    ],
  },
  {
    niveau: 'Niveau 2',
    matieres: [
      {
        matiere: 'Matière 3',
        chapitres: [
          { chapitre: 'Chapitre 5', exercices: ['Exercice 9', 'Exercice 10'] },
          { chapitre: 'Chapitre 6', exercices: ['Exercice 11', 'Exercice 12'] },
        ],
      },
      {
        matiere: 'Matière 4',
        chapitres: [
          { chapitre: 'Chapitre 7', exercices: ['Exercice 13', 'Exercice 14'] },
          { chapitre: 'Chapitre 8', exercices: ['Exercice 15', 'Exercice 16'] },
        ],
      },
    ],
  },
];


const shared = (index: number) =>
  (index === 0 && SHARED_PERSONS.slice(0, 5)) ||
  (index === 1 && SHARED_PERSONS.slice(5, 9)) ||
  (index === 2 && SHARED_PERSONS.slice(9, 11)) ||
  (index === 3 && SHARED_PERSONS.slice(11, 12)) ||
  [];

// Helper function to generate random hierarchical data
function getRandomHierarchy(index: number) {
  const randomNiveauIndex = Math.floor(Math.random() * hierarchy.length);
  const niveauData = hierarchy[randomNiveauIndex];
  const { niveau } = niveauData;

  const randomMatiereIndex = Math.floor(Math.random() * niveauData.matieres.length);
  const matiereData = niveauData.matieres[randomMatiereIndex];
  const { matiere } = matiereData;

  const randomChapitreIndex = Math.floor(Math.random() * matiereData.chapitres.length);
  const chapitreData = matiereData.chapitres[randomChapitreIndex];
  const { chapitre } = chapitreData;

  const randomExerciceIndex = Math.floor(Math.random() * chapitreData.exercices.length);
  const exercice = chapitreData.exercices[randomExerciceIndex];

  return {
    niveau,
    matiere,
    chapitre,
    exercice,
    description: _mock.description(index), // e.g. a short text
  };
}

// Generate files
export const _files = _fileNames.map((name, index) => {
  const { niveau, matiere, chapitre, exercice, description } = getRandomHierarchy(index);

  return {
    id: `${_mock.id(index)}_file`,
    name,
    url: URLS[index],
    shared: shared(index),
    tags: _tags.slice(0, 5),
    size: GB / ((index + 1) * 500),
    createdAt: _mock.time(index),
    modifiedAt: _mock.time(index),
    type: name.split('.').pop() || 'txt',
    description,
    niveau,
    matiere,
    chapitre,
    exercice,
    isFavorited: _mock.boolean(index + 1),
  };
});

// Generate folders with the same fields
export const _folders = FOLDERS.map((name, index) => {
  const { niveau, matiere, chapitre, exercice, description } = getRandomHierarchy(index);

  return {
    id: `${_mock.id(index)}_folder`,
    name,
    type: 'dossier',
    url: URLS[index],
    shared: shared(index),
    tags: _tags.slice(0, 5),
    size: GB / ((index + 1) * 10),
    totalFiles: (index + 1) * 100,
    createdAt: _mock.time(index),
    modifiedAt: _mock.time(index),
    isFavorited: _mock.boolean(index + 1),

    // Add hierarchical fields so folders have them, too
    description,
    niveau,
    matiere,
    chapitre,
    exercice,
  };
});

export const _allFiles = [..._files];

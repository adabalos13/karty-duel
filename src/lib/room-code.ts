// Vyslovitelný kód ve formátu souhláska-samohláska-souhláska-samohláska
// (např. "hoka", "kico"), ať se dá snadno nadiktovat druhému hráči.
const CONSONANTS = "bcdfghjklmnprstvz".split("");
const VOWELS = "aeiou".split("");

function pick(letters: string[]): string {
  return letters[Math.floor(Math.random() * letters.length)];
}

export function generateRoomCode(): string {
  return pick(CONSONANTS) + pick(VOWELS) + pick(CONSONANTS) + pick(VOWELS);
}

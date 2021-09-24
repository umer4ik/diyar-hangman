export default class Letter {
  letter: string

  constructor(letter?: string) {
    if (letter) {
      this.letter = letter
    }
  }

  toString() {
    return this.letter
  }

  inWord(word: string) {
    return word.includes(this.letter)
  }
}

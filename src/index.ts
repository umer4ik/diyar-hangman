import * as PIXI from 'pixi.js'
import LETTERS from './constants/letters'
import './index.scss'
import Letter from './models/letter'

const FontFaceObserver = require('fontfaceobserver')

const root = document.getElementById('root')

const app = new PIXI.Application({ width: 640, height: 360, backgroundColor: 0xffffff })

root.appendChild(app.view)

const roboto = new FontFaceObserver('Roboto')

let row = 0

const offsetX = 25
const offsetY = 25

class GraphicsLetter extends PIXI.Graphics {
  letter: Letter
}

const createLetterCells = () => {
  LETTERS.forEach((l, index) => {
    const letter = new PIXI.Text(l.toUpperCase(), {
      lineHeight: 30,
      fontSize: 30,
      fontFamily: 'Roboto',
      fill: 0x000000,
    })
    if (index && Math.round(index / 8) === index / 8) {
      row += 1
    }
    letter.x = (index % 8) * 70 + offsetX
    letter.y = row * 70 + offsetY
    const rect = new GraphicsLetter()
    rect.letter = new Letter(l)
    rect.beginFill(0xff0000, 0.1)
    rect.lineStyle({ color: 0x000000, width: 2 })
    rect.drawRoundedRect(letter.x - 15, letter.y - 8, 50, 50, 4)
    rect.endFill()
    // w.filters = [new PIXI.filters.FXAAFilter()]
    // s.width = w.width
    // s.height = w.height
    // s.x = w.x
    // s.y = w.y
    rect.interactive = true
    rect.addChild(letter)
    rect.buttonMode = true
    rect.on('mouseover', () => {
      rect.filters = [new PIXI.filters.AlphaFilter(0.5)]
    })
    rect.on('mouseout', () => {
      rect.filters = []
    })
    rect.on('click', () => {
      console.log(rect.letter.toString())
    })
    app.stage.addChild(rect)
  })
}

const load = async () => {
  await roboto.load()
}

const init = async () => {
  await load()
  createLetterCells()
}

init()

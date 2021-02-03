"use strict"
export default function(sheet, type) {
    return new Promise((resolve, reject) => {
        let ctx = new AudioContext()
        const tunes = {
            "C.": 3,
            "C#": 4,
            "Db": 4,
            "D.": 5,
            "D#": 6,
            "Eb": 6,
            "E.": 7,
            "F.": 8,
            "F#": 9,
            "Gb": 9,
            "G.": 10,
            "G#": 11,
            "Ab": 11,
            "A.": 12,
            "A#": 13,
            "Bb": 13,
            "B.": 14,
        }
        const getFrequency = (tune) => {
            return 440 * Math.pow(2, tunes[tune.substr(0, 2)] / 12) * Math.pow(2, tune[2]-4)
        }
        let speed = sheet.bpm / 60
        let len = 0
        let nodes = []
        sheet.notes.forEach(note => {
            let oscillator = ctx.createOscillator()
            let gain = ctx.createGain()
            oscillator.frequency.value = getFrequency(note.key)
            oscillator.type = type
            oscillator.start(speed * (note.msr * sheet.signature * 4 + note.pos))
            oscillator.stop(speed * (note.msr * sheet.signature * 4 + note.pos) + 0.5)
            oscillator.connect(gain)
            gain.gain.setValueCurveAtTime([note.pwr / 25, 0], speed * (note.msr * sheet.signature * 4 + note.pos), 0.5)
            gain.connect(ctx.destination)
            nodes.push(oscillator, gain)
            len = Math.max(len, speed * (note.msr * sheet.signature * 4 + note.pos) + 1)
        });
        setTimeout(() => {
            while(nodes.length) {
                nodes.pop().disconnect()
            }
            ctx.close()
            resolve()
        }, len * 1000)
    })
}
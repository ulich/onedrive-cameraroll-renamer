import { handleFilename } from "./RenameService";

describe('RenameService', () => {
  describe('handleFilename', () => {
    it('only moves files to the target folder that already match the naming scheme', () => {
      expect(handleFilename('20190519_205940.jpg')).toEqual({ move: true })
      expect(handleFilename('20190519_205940.jpeg')).toEqual({ move: true })
      expect(handleFilename('20190519_205940.mp4')).toEqual({ move: true })

      expect(handleFilename('20190519_205940_11212.jpg')).toEqual({ move: true })
      expect(handleFilename('20190519_205940_11212.jpeg')).toEqual({ move: true })
      expect(handleFilename('20190519_205940_11212.mp4')).toEqual({ move: true })

      expect(handleFilename('20190519_000000_11212_WA.jpg')).toEqual({ move: true })
      expect(handleFilename('20190519_000000_11212_WA.jpeg')).toEqual({ move: true })
      expect(handleFilename('20190519_000000_11212_WA.mp4')).toEqual({ move: true })
    })

    describe('renames and moves files', () => {
      it('with upper case extension', () => {
        expect(handleFilename('20190519_205940.JPG')).toEqual({ move: true, newName: '20190519_205940.jpg' })
        expect(handleFilename('20190519_205940.JPEG')).toEqual({ move: true, newName: '20190519_205940.jpeg' })
        expect(handleFilename('20190519_205940.MP4')).toEqual({ move: true, newName: '20190519_205940.mp4' })

        expect(handleFilename('20190519_205940_11212.JPG')).toEqual({ move: true, newName: '20190519_205940_11212.jpg' })
        expect(handleFilename('20190519_205940_11212.JPEG')).toEqual({ move: true, newName: '20190519_205940_11212.jpeg' })
        expect(handleFilename('20190519_205940_11212.MP4')).toEqual({ move: true, newName: '20190519_205940_11212.mp4' })
      })

      it('with (\d)', () => {
        expect(handleFilename('20190519_205940(0).jpg')).toEqual({ move: true, newName: '20190519_205940_1.jpg' })
        expect(handleFilename('20190519_205940(0).jpeg')).toEqual({ move: true, newName: '20190519_205940_1.jpeg' })
        expect(handleFilename('20190519_205940(0).mp4')).toEqual({ move: true, newName: '20190519_205940_1.mp4' })

        expect(handleFilename('20190519_205940(2).jpg')).toEqual({ move: true, newName: '20190519_205940_1.jpg' })
      })

      it('with IMG_ prefix', () => {
        expect(handleFilename('IMG_20190519_205940.jpg')).toEqual({ move: true, newName: '20190519_205940.jpg' })
        expect(handleFilename('IMG_20190519_205940.jpeg')).toEqual({ move: true, newName: '20190519_205940.jpeg' })
      })

      it('with IMG_ prefix and timestamp', () => {
        expect(handleFilename('IMG_1558292380001_12345.jpg')).toEqual({ move: true, newName: '20190519_205940.jpg' })
        expect(handleFilename('IMG_1558292380001_12345.jpeg')).toEqual({ move: true, newName: '20190519_205940.jpg' })
      })

      it('with IMG- prefix and -WA suffix', () => {
        expect(handleFilename('IMG-20190519-WA1234.jpg')).toEqual({ move: true, newName: '20190519_1234_WA.jpg' })
        expect(handleFilename('IMG-20190519-WA1234.jpeg')).toEqual({ move: true, newName: '20190519_1234_WA.jpeg' })
      })

      it('with VID_ prefix', () => {
        expect(handleFilename('VID_20190519_205940.mp4')).toEqual({ move: true, newName: '20190519_205940.mp4' })
      })

      it('with VID- prefix and -WA suffix', () => {
        expect(handleFilename('VID-20190519-WA1234.mp4')).toEqual({ move: true, newName: '20190519_1234_WA.mp4' })
      })
    })

    it('ignores all other filenames', () => {
      expect(handleFilename('foo')).toEqual({ move: false })
    })
  })
})

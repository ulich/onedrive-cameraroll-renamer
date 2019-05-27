import dayjs from 'dayjs';
import { moveFile } from './utils/onedrive-client';

export function determineAction(filename) {
  if (/^20\d{6}_\d{6}\.(jpg|jpeg|mp4)$/.test(filename)
   || /^20\d{6}_\d{6}_\d+\.(jpg|jpeg|mp4)$/.test(filename)
   || /^20\d{6}_000000_\d+_WA\.(jpg|jpeg|mp4)$/.test(filename)) {
    return { move: true }
  }

  if (/^20\d{6}_\d{6}\.(JPG|JPEG|MP4)$/.test(filename)
   || /^20\d{6}_\d{6}_\d+\.(JPG|JPEG|MP4)$/.test(filename)) {
    const newName = filename.toLowerCase()
    return { move: true, newName }
  }

  if (/^20\d{6}_\d{6}\(\d\)\.(jpg|jpeg|mp4)$/.test(filename)) {
    const newName = filename.replace(/\(\d\)/, '_1')
    return { move: true, newName }
  }

  if (/^IMG_20\d{6}_\d{6}\.(jpg|jpeg)/.test(filename)) {
    const newName = filename.replace('IMG_', '')
    return { move: true, newName }
  }

  if (/^IMG_\d{13}_\d{5}\.(jpg|jpeg)$/.test(filename)) {
    const timestamp = Number(filename.replace('IMG_', '').substr(0, 13))
    const newName = dayjs(timestamp).format('YYYYMMDD_HHmmss') + '.jpg'
    return { move: true, newName }
  }

  if (/^IMG-20\d{6}-WA\d{4}\.(jpg|jpeg)$/.test(filename)) {
    const newName = filename
      .replace('IMG-', '')
      .replace('WA', '')
      .replace('-','_')
      .replace('.', '_WA.')
    return { move: true, newName }
  }

  if (/^VID_20\d{6}_\d{6}\.mp4$/.test(filename)) {
    const newName = filename.replace('VID_', '')
    return { move: true, newName }
  }

  if (/^VID-20\d{6}-WA\d{4}\.mp4$/.test(filename)) {
    const newName = filename
      .replace('VID-', '')
      .replace('WA', '')
      .replace('-','_')
      .replace('.', '_WA.')
    return { move: true, newName }
  }

  console.log(`Dunno what to do with "${filename}"`)
  return { move: false }
}

export async function executeAction(file, action, processedFolder) {
  const { move, newName } = action
  if (move) {
    console.log(`Moving "${file.name}"` + (newName ? ` and renaming to "${newName}"` : ''))
    await moveFile(file, processedFolder, newName)
    return true
  }
  
  return false
}

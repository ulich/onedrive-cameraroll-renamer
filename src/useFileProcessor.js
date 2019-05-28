import { useEffect, useState, useReducer } from 'react';
import { determineAction, executeAction } from './RenameService';
import { getDriveItemInfo, listFiles } from './utils/onedrive-client';

export default function useFileProcessor() {
    const [allFilesCount, setAllFilesCount] = useState(0)
    const [processedFiles, dispatch] = useReducer(processedFilesReducer, [])
    const [done, setDone] = useState(false)
  
    useEffect(() => {
      async function processFiles() {
        const processedFolder = await getDriveItemInfo('/Bilder/Camera Roll/umbenannt')
        
        const response = await listFiles('/Bilder/Camera Roll')
        const files = response.value.filter(f => f.id !== processedFolder.id)
        setAllFilesCount(files.length)
  
        for (let file of files) {
          const fileAction = determineAction(file.name)
          dispatch({ type: 'add-file-to-process', file, fileAction })
  
          const successful = await executeAction(file, fileAction, processedFolder)
          dispatch({ type: 'update-file-processed-status', file, successful })
        }
  
        setDone(true)
      }
  
      processFiles()
    }, [])
  
    return { allFilesCount, processedFiles, done }
  }
  
  function processedFilesReducer(processedFiles, action) {
    switch (action.type) {
      case 'add-file-to-process':
        return [
          {
            file: action.file,
            action: action.fileAction,
            processed: false,
          },
          ...processedFiles,
        ]
      case 'update-file-processed-status':
        return processedFiles.map(item => {
          if (item.file.id !== action.file.id) {
            return item
          }
  
          return {
            ...item,
            processed: true,
            successful: action.successful,
          }
        })
      default:
        throw new Error('unknown action type ' + action.type)
    }
  }
  
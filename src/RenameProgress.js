import React, { useEffect, useState } from 'react';
import { handleFile } from './RenameService';
import { getDriveItemInfo, listFiles } from './utils/onedrive-client';
import Alert from 'antd/lib/alert';
import Spin from 'antd/lib/spin';
import Progress from 'antd/lib/progress';
import List from 'antd/lib/list';

export default function RenameProgress() {
  const [allFiles, setAllFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [processedFileCount, setProcessedFileCount] = useState(0)
  const [unprocessedFiles, setUnprocessedFiles] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function processFiles() {
      const processedFolder = await getDriveItemInfo('/Bilder/Camera Roll/umbenannt')
      
      const response = await listFiles('/Bilder/Camera Roll')
      const files = response.value.filter(f => f.id !== processedFolder.id)
      setAllFiles(files)

      for (let file of files) {
        setCurrentFile(file)
        const processed = await handleFile(file, processedFolder)
        if (processed) {
          setProcessedFileCount(old => old + 1)
        } else {
          setUnprocessedFiles(old => [...old, file])
        }
      }

      setDone(true)
    }

    processFiles()
  }, [])

  const progressPercent = Math.round((processedFileCount + unprocessedFiles.length) / allFiles.length * 100)
  const successPercent = allFiles.length === 0 ? 100 : Math.round(processedFileCount / allFiles.length * 100)

  if (done) {
    const message = `${processedFileCount} out of ${allFiles.length} files processed successfully.`
    return (
      <Status
        progressPercent={100}
        successPercent={successPercent}
        unprocessedFiles={unprocessedFiles}
      >
        <Alert message={message} type="success" showIcon />
      </Status>
    )
  }

  if (!currentFile) {
    return <div style={{ textAlign: 'center' }}><Spin /></div>
  }
  
  return (
    <Status
      progressPercent={progressPercent}
      successPercent={successPercent}
      unprocessedFiles={unprocessedFiles}
    >
      <div>Processing {currentFile.name}</div>
    </Status>
  )
}


function Status({ progressPercent, successPercent, unprocessedFiles, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridRowGap: 50, justifyItems: 'center' }}>
      <Progress type="circle" percent={progressPercent} successPercent={successPercent} />
      {children}
      <UnprocessedFiles files={unprocessedFiles} />
    </div>
  )
}

function UnprocessedFiles({ files }) {
  if (files.length === 0) {
    return null
  }

  return (
    <div>
      <h2>Unprocessed files</h2>
      <List
        size="small"
        bordered
        dataSource={files}
        renderItem={item => (
          <List.Item>
            {item.name}
          </List.Item>
        )} />
      </div>
  )
}

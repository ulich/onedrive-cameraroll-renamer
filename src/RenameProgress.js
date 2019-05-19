import React, { useEffect, useState } from 'react';
import { handleFile } from './RenameService';
import { getDriveItemInfo, listFiles } from './utils/onedrive-client';
import Alert from 'antd/lib/alert';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';

export default function RenameProgress() {
  const [currentFile, setCurrentFile] = useState(null)
  const [unprocessedFiles, setUnprocessedFiles] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function perform() {
      const processedFolder = await getDriveItemInfo('/Bilder/Camera Roll/umbenannt')
      
      const response = await listFiles('/Bilder/Camera Roll')
      const files = response.value

      for (let file of files) {
        if (file.id === processedFolder.id) {
          continue
        }

        setCurrentFile(file)
        const processed = await handleFile(file, processedFolder)
        if (!processed) {
          setUnprocessedFiles(old => [...old, file])
        }
      }

      setDone(true)
    }

    perform()
  }, [])

  if (done) {
    return (
      <div>
        <Alert message="Done" type="success" showIcon />
        <UnprocessedFiles files={unprocessedFiles} />
      </div>
    )
  }

  if (!currentFile) {
    return <Spin />
  }

  return (
    <div>
      <Spin /> Processing {currentFile.name}
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
      <h2 style={{ marginTop: 50 }}>Unprocessed files</h2>
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

import React from 'react';
import useFileProcessor from './useFileProcessor';
import { Alert, Spin, Progress, List, Icon } from 'antd';

export default function RenameProgress() {
  const { allFilesCount, processedFiles, done } = useFileProcessor()

  const successfulCount = processedFiles.filter(item => item.successful).length
  const successPercent = (done && allFilesCount === 0) ? 100 : Math.round(successfulCount / allFilesCount * 100)
  const progressPercent = done ? 100 : Math.round(processedFiles.length / allFilesCount * 100)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridRowGap: 50, justifyItems: 'center' }}>
      <Progress type="circle" percent={progressPercent} successPercent={successPercent} />

      { done &&
        <Alert
          message={`${successfulCount} out of ${allFilesCount} files processed successfully.`}
          type="success"
          showIcon />
      }

      {processedFiles.length > 0 &&
        <List
          size="small"
          bordered
          dataSource={processedFiles}
          renderItem={item => <ListItem item={item} />}
          style={{ width: '100%', maxWidth: 600 }}
        />
      }
    </div>
  )
}

function ListItem({ item }) {
  return (
    <List.Item style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ marginRight: 10 }}>
        <ItemIcon item={item} />
      </div>
      <div style={{ flex: '1' }}>
        {item.file.name} {item.action.newName && ` -> ${item.action.newName}`}
      </div>
    </List.Item>
  )
}

function ItemIcon({ item }) {
  if (!item.processed) {
    return <Spin size="small" />
  }
  if (item.successful) {
    return <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
  }

  return <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
}

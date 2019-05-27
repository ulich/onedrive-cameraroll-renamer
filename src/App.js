import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { Async } from './utils/data-fetch';
import RenameProgress from './RenameProgress';
import { isAuthenticated, login, logout, getUserDetails } from './utils/onedrive-client';

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ display: 'flex', padding: '0 20px' }}>
        <Logo />
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          {authenticated && (
            <Menu.SubMenu title={<ProfileMenuItemTitle />}>
              <Menu.Item onClick={() => { logout(); setAuthenticated(false) }}>
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          )}
        </Menu>
      </Layout.Header>
      <Layout.Content style={{ padding: '40px 20px', maxWidth: 1200, width: '100%', alignSelf: 'center' }}>
        {authenticated
          ? <RenameProgress />
          : <Login onComplete={() => setAuthenticated(true)} />}
      </Layout.Content>
    </Layout>
  )
}

function Logo() {
  return (
    <div style={{ color: 'white', fontSize: 20, flex: 1 }}>
      CameraRollRenamer
    </div>
  )
}

function ProfileMenuItemTitle() {
  return (
    <Async fn={getUserDetails} deps={[]} onData={(user) => (
      <span className="submenu-title-wrapper">{user.displayName}</span>
    )}/>
  )
}

function Login({ onComplete }) {
  async function loginAndCallback() {
    await login()
    onComplete()
  }

  return <Button type="primary" onClick={loginAndCallback}>Sign in</Button>
}

import { UserAgentApplication } from 'msal';
import { Client } from '@microsoft/microsoft-graph-client';
import * as config from '../config';

const scopes = ["user.read", "files.readwrite"];

const userAgentApp = new UserAgentApplication({
  auth: {
    clientId: config.clientId,
  }
})

function getAuthenticatedClient() {
  return Client.init({
    authProvider: async (done) => {
      try {
        const token = await getAccessToken()
        done(null, token)
      } catch (e) {
        done(e)
      }
    }
  });
}

export function isAuthenticated() {
  return userAgentApp.getAccount() != null;
}

export async function login() {
  return userAgentApp.loginPopup({ scopes })
}

export function logout() {
  userAgentApp.logout();
}

export async function getUserDetails() {
  const client = getAuthenticatedClient()

  return await client.api('/me').get()
}

export async function getDriveItemInfo(path) {
  const client = getAuthenticatedClient()

  return await client.api(`/drive/root:${path}`).get()
}

export async function listFiles(folder) {
  const client = getAuthenticatedClient()

  return await client.api(`/drive/root:${folder}:/children`).get()
}

export async function moveFile(file, destination, newName = null) {
  const client = getAuthenticatedClient()

  const body = {
    parentReference: {
      id: destination.id
    }
  }

  if (newName) {
    body.name = newName
  }

  return await client.api(`/me/drive/items/${file.id}`).patch(body)
}

async function getAccessToken() {
  const response = await userAgentApp.acquireTokenSilent({ scopes })
  return (response || {}).accessToken
}

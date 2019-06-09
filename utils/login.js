import {Base64} from './base64.js'

const base64 = new Base64();

export function login(login, password) {
  const auth = base64.encode(`${login}:${password}`);
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://localhost:4000/auth/github_credentials',
      header: {
        'Authorization': `Basic ${auth}`,
      },
      method: 'POST',
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200)
          resolve(res.data.token);
        else
          reject(res.data)
      }
    })
  })
}

export function setToken(token) {
  return new Promise(resolve => {
    wx.setStorage({
      key: 'token',
      data: token,
      success: () => resolve(),
    })
  })
}

export function getToken(token) {
  return new Promise(resolve => {
    wx.getStorage({
      key: 'token',
      success: (token) => {
        console.log('got token', token);
        resolve(token.data)},
    })
  })
}
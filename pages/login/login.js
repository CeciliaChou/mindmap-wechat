import {
    login,
    setToken,
    getToken
} from '../../utils/login.js'

Page({
    onLoad: () => {
        console.log('onLoad');
        // wx.clearStorage({
        //     complete: () => {

        getToken().then(token => {
            console.log('token', token);
            if (token) wx.redirectTo({
                url: '../index/index',
            })
        })
        // }
        // });
    },

    data: {
        phone: '',
        password: ''
    },

    // 获取输入账号
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    // 获取输入密码
    passwordInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    // 登录
    login: function () {
        const {
            phone,
            password
        } = this.data;
        if (phone.length === 0 || password.length === 0) {
            wx.showToast({
                title: 'Username or password should not be empty',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.showLoading({
                title: 'Loading...',
            });
            login(phone, password).then(token => {
                wx.hideLoading();
                wx.showToast({
                    title: 'Login successful',
                    icon: 'success',
                    duration: 500,
                });
                return setToken(token)
            }).then(() => wx.redirectTo({
                url: '../index/index',
            }))
                .catch(() => {
                    wx.hideLoading();
                    wx.showToast({
                        title: 'Incorrect username or password',
                        icon: 'none',
                        duration: 500,
                    })
                })
        }
    }
});
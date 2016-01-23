'use strict';

export const  key = '@lussatech:session';
export const host = 'http://aprs.lussa.net';
export default {
  auth: {
    login: function (data) {
      const url = host + '/auth/login',
            opt = {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            };

      return fetch(url, opt);
    },
    register: function (data) {
      const url = host + '/auth/register',
            opt = {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            };

      return fetch(url, opt);
    },
    forget: function (data) {
      const url = host + '/auth/forget',
            opt = {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            };

      return fetch(url, opt);
    },
    reset: function (data) {
      const url = host + '/auth/reset',
            opt = {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            };

      return fetch(url, opt);
    }
  }
};

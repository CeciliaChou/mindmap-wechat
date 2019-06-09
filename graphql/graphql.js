import gqlwx from '../utils/wxgql.js';
import * as queries from './query.js';

const GraphQL = gqlwx.GraphQL;

function gqlFactory() {
    return new Promise(resolve => wx.getStorage({
        key: 'token',
        success: function (res) {
            resolve(res)
        },
    })).then(token =>
        GraphQL({
            //设置全局 url
            url: 'http://localhost:4000/graphql', // url 必填

            //设置全居动态 header
            header: function () {
                return {
                    // something....
                    'Authorization': `Bearer ${token.data}`
                }
            }
        }, true)
    );
}

let gql;

function getGql() {
    if (gql) return Promise.resolve(gql);
    return gqlFactory()
        .then(theGql => {
            gql = theGql;
            return theGql
        })
}

export function query(queryName, variables) {
    console.log(queryName, variables);
    return getGql().then(gql =>
        gql.query({
            query: queries[queryName],
            variables,
        })).then(({query}) => {
        return query;
    })
}

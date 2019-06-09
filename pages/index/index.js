import {query} from "../../graphql/graphql";
import Dialog from '../../component/dialog/dialog';


//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        labels: [],
        selectedLabel: null,

        activeQuestion: null,
        questions: [],
        questionCursor: null,
        activeIdea: null,
        ideas: [],
        ideaCursor: null,

        questionIdeas: {},
        ideaQuestions: {},

        addType: null,
        addTitle: '',
        addDescription: '',

        addressing: null,
        addressingActions: [],

        addingLabel: false,
        addLabelName: '',
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    test: () => {
        console.log('test')
    },
    load: function (promise) {
        wx.showLoading({title: 'Loading...'});
        promise.then(() => wx.hideLoading())
    },
    fetch: function (labelId) {
        const {data: {questionCursor, ideaCursor}} = this;
        return Promise.all([query('getLabelQuestionsQuery',
            {labelId, cursor: questionCursor})
            .then(({questions: {items, nextCursor}}) => {
                const questions = this.data.questions.concat(items);
                this.setData({
                    questions,
                    questionCursor: nextCursor,
                })
            }), query('getLabelIdeasQuery',
            {labelId, cursor: ideaCursor})
            .then(({ideas: {items, nextCursor}}) => {
                const ideas = this.data.ideas.concat(items);
                this.setData({
                    ideas,
                    ideaCursor: nextCursor,
                })
            })])
    },
    fetchNested: function (type, itemId) {
        const isQuestion = type === 'question';
        const field = isQuestion ? 'questionIdeas' : 'ideaQuestions';
        const {items, nextCursor} =
            this.data[field][itemId];
        const queryName = isQuestion ? 'getQuestionIdeasQuery' : 'getIdeaQuestionsQuery';
        const variables = {
            [isQuestion ? 'questionId' : 'ideaId']: itemId,
            cursor: nextCursor,
        };
        return query(queryName, variables)
            .then(data => {
                console.log('questionIdeas', data);
                data = isQuestion ? data.addressedBy : data.addresses;
                const {items: newItems, nextCursor: newNextCursor} = data;
                this.setData({
                    [`${field}.${itemId}.items`]: items.concat(newItems),
                    [`${field}.${itemId}.nextCursor`]: newNextCursor,
                })
            })
    },
    tapLabel: function (event) {
        const selectedLabel = event.target.dataset.id;
        this.setData({selectedLabel: selectedLabel});
        this.load(
            this.fetch(selectedLabel))
    },
    unsubscribe: function (event) {
        Dialog.confirm({
            title: 'Unsubscribe to this label?'
        }).then(() => {
            return this.load(query('unsubscribeToLabelQuery',
                {labelId: event.target.dataset.id})
                .then(() => {
                    const {data: {labels}} = this;
                    labels.splice(labels.findIndex(v => v.id === event.target.dataset.id));
                    this.setData({labels})
                }))
        }).catch(() => {
        })
    },
    activeQuestionChange: function (event) {
        const id = event.detail;
        if (id && !this.data.questionIdeas[id]) {
            this.setData({
                [`questionIdeas.${id}`]: {items: [], nextCursor: null}
            }, () => {
                this.load(this.fetchNested('question', id))
            });
        }
        this.setData({activeQuestion: id})
    },
    activeIdeaChange: function (event) {
        const id = event.detail;
        if (id && !this.data.ideaQuestions[id]) {
            this.setData({
                [`ideaQuestions.${id}`]: {items: [], nextCursor: null}
            }, () => {
                this.load(this.fetchNested('idea', id))
            });
        }
        this.setData({activeIdea: id})
    },
    closeAdd: function () {
        this.setData({addType: null, addTitle: '', addDescription: ''})
    },
    confirmAdd: function () {
        let addType = this.data.addType;
        const queryName = addType === 'question' ?
            'createQuestionQuery' : 'createIdeaQuery';
        const {data: {addTitle, addDescription}} = this;
        const variables = addType === 'question' ?
            {title: addTitle, description: addDescription} :
            {description: addDescription};
        const arr = addType === 'question' ?
            this.data.questions : this.data.ideas,
            selectedLabel = this.data.selectedLabel;
        let item;
        this.load(
            query(queryName, variables)
                .then(theItem => {
                    item = theItem;
                    return query('associateEntityWithLabelQuery', {
                        entityId: item.id,
                        labelId: selectedLabel,
                        entityType: addType.toUpperCase(),
                    })
                })
                .then(() => {
                    this.setData({
                        [addType === 'question' ? 'questions' : 'ideas']: arr.concat([item])
                    });
                    this.closeAdd()
                })
        )
    },
    requestAddQuestion: function () {
        this.setData({addType: 'question'})
    },
    requestAddIdea: function () {
        this.setData({addType: 'idea'})
    },
    setAddTitle: function (event) {
        this.setData({addTitle: event.detail})
    },
    setAddDescription: function (event) {
        this.setData({addDescription: event.detail})
    },
    showAddressing: function (event) {
        const type = event.target.dataset.type;
        let alreadyAddedList = type === 'question' ?
            this.data.questionIdeas[this.data.activeQuestion].items :
            this.data.ideaQuestions[this.data.activeIdea].items;
        alreadyAddedList = alreadyAddedList.map(item => item.id);
        const actionList = type === 'question' ? this.data.ideas : this.data.questions;
        this.setData({
            addressing: type,
            addressingActions: actionList
                .filter(item => !alreadyAddedList.includes(item.id))
                .map(item => ({
                    id: item.id,
                    name: type === 'question' ? item.description : item.title,
                }))
        })
    },
    closeAddressing: function () {
        this.setData({
            addressing: null,
            addressingActions: [],
        })
    },
    selectAddressing: function (event) {
        const isQuestion = this.data.addressing === 'question';
        const questionId = isQuestion ? this.data.activeQuestion : event.detail.id;
        const ideaId = isQuestion ? event.detail.id : this.data.activeIdea;
        const questionIdeas = this.data.questionIdeas[questionId];
        const ideaQuestions = this.data.ideaQuestions[ideaId];
        const {questions, ideas} = this.data;
        this.load(query('addressQuestionQuery', {questionId, ideaId})
            .then(() => {
                if (questionIdeas) {
                    questionIdeas.items.push(ideas.find(item => item.id === ideaId));
                    this.setData({
                        [`questionIdeas.${questionId}.items`]: questionIdeas.items,
                    });
                }
                if (ideaQuestions) {
                    ideaQuestions.items.push(questions.find(item => item.id === questionId));
                    this.setData({
                        [`ideaQuestions.${ideaId}.items`]: ideaQuestions.items,
                    });
                }
                this.closeAddressing()
            }))
    },
    requestAddLabel: function () {
        this.setData({addingLabel: true})
    },
    closeAddLabel: function () {
        this.setData({
            addingLabel: false,
            addLabelName: ''
        })
    },
    setAddLabelName: function (event) {
        this.setData({addLabelName: event.detail})
    },
    confirmAddLabel: function () {
        const {data: {addLabelName}} = this;
        this.load(
            query('getLabelByNameQuery', {name: addLabelName})
                .then((result) => {
                    if (result) return result.id;
                    return query('createLabelQuery', {name: addLabelName})
                        .then(({id}) => id)
                })
                .then(id => query('subscribeToLabelQuery', {labelId: id}))
                .then(label => {
                    const labels = this.data.labels.concat([label]);
                    this.setData({labels});
                    this.closeAddLabel()
                }))
    },
    onLoad: function () {
        this.load(
            query('getSubscribedLabelsQuery')
                .then(items => {
                    const labels = this.data.labels.concat(items);
                    this.setData({labels});
                }));
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
});

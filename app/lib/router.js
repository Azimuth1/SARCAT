Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});
Handlebars.registerHelper('isEqual', function (a, b) {
    return a === b;
});


Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'appNotFound',
    loadingTemplate: 'appLoading',
    waitOn: function () {
        return [
            Meteor.subscribe('publicLists'),
            Meteor.subscribe('userData'),
            Meteor.subscribe('config'),
            Meteor.subscribe('roles'),
        ];
    },
    onBeforeAction: function () {
        Session.set('config',Config.findOne());
        console.log(1)
        if (Config.findOne({
                initSetup: true
            })) {
            Router.go('adminSetup');
        }
        this.next();
    },
    action: function () {
        console.log('???')
        if (this.ready()) {

            A = Config.findOne();
            console.log(a)
            this.render();
        } else {
            this.render('appLoading');
        }
    }
});
if (Meteor.isClient) {

Tracker.autorun(function () {
//  Meteor.subscribe("config", Config.findOne());
//Session.set('config', Config.findOne());
//Session.set('profileComplete',agencyProfileComplete());



});

    /*Tracker.autorun(function () {
        var count = Session.get('adminUser');
        //console.log('autorun2:' + count);
    });*/

    //Roles.userIsInRole(Meteor.userId(), ['admin']);
    //L.Icon.Default.imagePath = '/img';
    //L.Icon.Default.imagePath = '/packages/leaflet/images';
}
Router.route('home', {
    path: '/',
    action: function () {
        if (Meteor.user()) {
            
            if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {

                Router.go('admin');
            } else {
                Router.go('records', Meteor.user());
            }

        } else {
            Router.go('signin');
        }
    }
});
Router.route('adminSetup', {
    path: '/adminSetup/',
    layoutTemplate: null,
    onBeforeAction: function () {
        this.next();
    }
});
Router.route('join');
Router.route('signin');
/*
Router.route('user-home', {
    path: '/user/:_id',
    data: function () {
        var obj = {};
        //obj.user = Meteor.user();
        obj.users = Meteor.users.find().fetch();
        obj.records = Records.find();
        return obj;
    },
});
*/

Router.route('records', {
    path: '/records',
    waitOn: function () {
        return [this.subscribe('publicLists')];
    },
    data: function () {
        var obj = {};
        //obj.user = Meteor.user();
        obj.users = Meteor.users.find();
        obj.records = Records.find();
        return obj;
    },

    action: function () {
        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('admin', {
    path: '/admin',
    waitOn: function () {
        return this.subscribe('userData');
    },
    data: function () {
        var obj = {};
        obj.users = Meteor.users.find();
        obj.records = Records.find();
        return obj;
    },

    action: function () {

        if (this.ready()) {
            this.render();
        }
    }
});
/*
Router.route('admin', {
    path: '/admin',
    waitOn: function () {
        return this.subscribe('userData');
    },
    data: function () {
        var obj = {};
        //obj.user = Meteor.user();
        obj.users = Meteor.users.find();
        obj.records = Records.find();
        console.log(obj)
        return obj;
    },

    action: function () {
        if (this.ready()) {
            this.render();
        }
    }
});*/

Router.route('form', {
    path: '/form/:_id',
    waitOn: function () {
        return this.subscribe('item', this.params._id);
    },
    data: function () {
        var obj = {};
        obj.record = Records.findOne(this.params._id);
        //console.log(obj.record);
        return obj;
    },
    action: function () {
        if (this.ready()) {
            console.log('ready')
            this.render();
        }
    }
});
//});
/*
meteor add insecure
meteor add autopublish
meteor remove insecure
meteor remove autopublish
*/
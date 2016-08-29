(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactRouter = require('react-router');

var _platformManager = require('./components/platform-manager');

var _platformManager2 = _interopRequireDefault(_platformManager);

var _configureDevices = require('./components/configure-devices');

var _configureDevices2 = _interopRequireDefault(_configureDevices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var authorizationStore = require('./stores/authorization-store');
var platformsPanelItemsStore = require('./stores/platforms-panel-items-store');
var devicesStore = require('./stores/devices-store');
var Dashboard = require('./components/dashboard');
var LoginForm = require('./components/login-form');
var PageNotFound = require('./components/page-not-found');
var Platform = require('./components/platform');

var Platforms = require('./components/platforms');
var Devices = require('./components/devices');

var PlatformCharts = require('./components/platform-charts');
var Navigation = require('./components/navigation');

var _afterLoginPath = '/dashboard';

var checkAuth = function checkAuth(AuthComponent) {
    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'componentWillMount',
            value: function componentWillMount() {

                if (AuthComponent.displayName !== 'LoginForm' && AuthComponent.displayName !== 'PageNotFound') {
                    if (!authorizationStore.getAuthorization()) {
                        _reactRouter.hashHistory.replace('/login');
                    }
                } else if (authorizationStore.getAuthorization()) {
                    _reactRouter.hashHistory.replace(_afterLoginPath);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(AuthComponent, this.props);
            }
        }]);

        return _class;
    }(React.Component);
};

var PublicExterior = React.createClass({
    displayName: 'PublicExterior',

    render: function render() {

        return React.createElement(
            'div',
            { className: 'public-exterior not-logged-in' },
            React.createElement(
                'div',
                { className: 'main' },
                React.createElement(Navigation, null),
                this.props.children
            )
        );
    }
});

var routes = React.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    React.createElement(
        _reactRouter.Route,
        { path: '/', component: checkAuth(_platformManager2.default) },
        React.createElement(_reactRouter.IndexRedirect, { to: 'dashboard' }),
        React.createElement(_reactRouter.Route, { path: 'dashboard', component: checkAuth(Dashboard) }),
        React.createElement(_reactRouter.Route, { path: 'platforms', component: checkAuth(Platforms) }),
        React.createElement(_reactRouter.Route, { path: 'platform/:uuid', component: checkAuth(Platform) }),
        React.createElement(_reactRouter.Route, { path: 'devices', component: checkAuth(Devices) }),
        React.createElement(_reactRouter.Route, { path: 'configure-devices', component: checkAuth(_configureDevices2.default) }),
        React.createElement(_reactRouter.Route, { path: 'charts', component: checkAuth(PlatformCharts) })
    ),
    React.createElement(
        _reactRouter.Route,
        { path: '/', component: checkAuth(PublicExterior) },
        React.createElement(_reactRouter.Route, { path: 'login', component: checkAuth(LoginForm) })
    ),
    React.createElement(_reactRouter.Route, { path: '*', component: PageNotFound })
);

ReactDOM.render(routes, document.getElementById('app'), function (Handler) {
    authorizationStore.addChangeListener(function () {
        if (authorizationStore.getAuthorization() && this.router.isActive('/login')) {
            this.router.replace(_afterLoginPath);
        } else if (!authorizationStore.getAuthorization() && !this.router.isActive('/login')) {
            this.router.replace('/login');
        }
    }.bind(this));

    platformsPanelItemsStore.addChangeListener(function () {
        if (platformsPanelItemsStore.getLastCheck() && authorizationStore.getAuthorization()) {
            if (!this.router.isActive('charts')) {
                this.router.push('/charts');
            }
        }
    }.bind(this));

    devicesStore.addChangeListener(function () {
        if (devicesStore.getNewScan()) {
            if (!this.router.isActive('configure-devices')) {
                this.router.push('/configure-devices');
            }
        }
    }.bind(this));
});

},{"./components/configure-devices":16,"./components/dashboard":25,"./components/devices":30,"./components/login-form":32,"./components/navigation":34,"./components/page-not-found":36,"./components/platform":40,"./components/platform-charts":38,"./components/platform-manager":39,"./components/platforms":43,"./stores/authorization-store":56,"./stores/devices-store":59,"./stores/platforms-panel-items-store":62,"react":undefined,"react-dom":undefined,"react-router":undefined}],2:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var RpcExchange = require('../lib/rpc/exchange');

var consoleActionCreators = {
    toggleConsole: function toggleConsole() {
        dispatcher.dispatch({
            type: ACTION_TYPES.TOGGLE_CONSOLE
        });
    },
    updateComposerValue: function updateComposerValue(value) {
        dispatcher.dispatch({
            type: ACTION_TYPES.UPDATE_COMPOSER_VALUE,
            value: value
        });
    },
    makeRequest: function makeRequest(opts) {
        new RpcExchange(opts).promise.catch(function ignore() {});
    }
};

module.exports = consoleActionCreators;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/rpc/exchange":50}],3:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');

var controlButtonActionCreators = {
	toggleTaptip: function toggleTaptip(name) {
		dispatcher.dispatch({
			type: ACTION_TYPES.TOGGLE_TAPTIP,
			name: name
		});
	},
	hideTaptip: function hideTaptip(name) {
		dispatcher.dispatch({
			type: ACTION_TYPES.HIDE_TAPTIP,
			name: name
		});
	}
};

module.exports = controlButtonActionCreators;

},{"../constants/action-types":47,"../dispatcher":48}],4:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var dispatcher = require('../dispatcher');
var rpc = require('../lib/rpc');

var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');

var devicesActionCreators = {
    configureDevices: function configureDevices(platform) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CONFIGURE_DEVICES,
            platform: platform
        });
    },
    addDevices: function addDevices(platform) {
        dispatcher.dispatch({
            type: ACTION_TYPES.ADD_DEVICES,
            platform: platform
        });
    },
    scanForDevices: function scanForDevices(platformUuid, bacnetProxyUuid, low, high, address) {

        // var authorization = authorizationStore.getAuthorization();

        // return new rpc.Exchange({
        //     method: 'platform.uuid.' + platformUuid + '.agent.uuid.' + bacnetProxyUuid + '.who_is',
        //     authorization: authorization,
        //     params: {

        //     },
        // }).promise
        //     .then(function (result) {

        //         if (result)
        //         {
        //             console.log(JSON.stringify(result));

        dispatcher.dispatch({
            type: ACTION_TYPES.LISTEN_FOR_IAMS,
            platformUuid: platformUuid,
            bacnetProxyUuid: bacnetProxyUuid,
            low_device_id: low,
            high_device_id: high,
            target_address: address
        });
        //     }

        // })
        // .catch(rpc.Error, function (error) {

        //     error.message = "Unable to scan for devices. " + error.message + ".";

        //     handle401(error, error.message);
        // });
    },
    cancelScan: function cancelScan(platform) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CANCEL_SCANNING,
            platform: platform
        });
    },
    listDetectedDevices: function listDetectedDevices(platform) {
        dispatcher.dispatch({
            type: ACTION_TYPES.LIST_DETECTED_DEVICES,
            platform: platform
        });
    },
    configureDevice: function configureDevice(device) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CONFIGURE_DEVICE,
            device: device
        });
    },
    // configureRegistry: function (device) {
    //     dispatcher.dispatch({
    //         type: ACTION_TYPES.CONFIGURE_REGISTRY,
    //         device: device
    //     });
    // },
    generateRegistry: function generateRegistry(device) {
        dispatcher.dispatch({
            type: ACTION_TYPES.GENERATE_REGISTRY,
            device: device
        });
    },
    cancelRegistry: function cancelRegistry(device) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CANCEL_REGISTRY,
            device: device
        });
    },
    loadRegistry: function loadRegistry(device, csvData, fileName) {
        dispatcher.dispatch({
            type: ACTION_TYPES.LOAD_REGISTRY,
            device: device,
            data: csvData,
            file: fileName
        });
    },
    editRegistry: function editRegistry(device) {
        dispatcher.dispatch({
            type: ACTION_TYPES.EDIT_REGISTRY,
            device: device
        });
    },
    saveRegistry: function saveRegistry(device, values) {
        dispatcher.dispatch({
            type: ACTION_TYPES.SAVE_REGISTRY,
            device: device,
            data: values
        });
    }
};

function handle401(error, message, highlight, orientation) {
    if (error.code && error.code === 401 || error.response && error.response.status === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error
        });

        platformManagerActionCreators.clearAuthorization();
    } else if (message) {
        statusIndicatorActionCreators.openStatusIndicator("error", message, highlight, orientation);
    }
}

module.exports = devicesActionCreators;

},{"../action-creators/status-indicator-action-creators":10,"../constants/action-types":47,"../dispatcher":48,"../lib/rpc":51,"../stores/authorization-store":56}],5:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');

var modalActionCreators = {
	openModal: function openModal(content) {
		dispatcher.dispatch({
			type: ACTION_TYPES.OPEN_MODAL,
			content: content
		});
	},
	closeModal: function closeModal() {
		dispatcher.dispatch({
			type: ACTION_TYPES.CLOSE_MODAL
		});
	}
};

module.exports = modalActionCreators;

},{"../constants/action-types":47,"../dispatcher":48}],6:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var platformsStore = require('../stores/platforms-store');
var platformChartStore = require('../stores/platform-chart-store');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var dispatcher = require('../dispatcher');
var rpc = require('../lib/rpc');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');

var platformActionCreators = {
    loadPlatform: function loadPlatform(platform) {
        platformActionCreators.loadAgents(platform);
        platformActionCreators.loadCharts(platform);
    },
    loadAgents: function loadAgents(platform) {
        var authorization = authorizationStore.getAuthorization();

        new rpc.Exchange({
            method: 'platforms.uuid.' + platform.uuid + '.list_agents',
            authorization: authorization
        }).promise.then(function (agentsList) {
            platform.agents = agentsList;

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_PLATFORM,
                platform: platform
            });

            if (!agentsList.length) {
                return;
            }

            new rpc.Exchange({
                method: 'platforms.uuid.' + platform.uuid + '.status_agents',
                authorization: authorization
            }).promise.then(function (agentStatuses) {
                platform.agents.forEach(function (agent) {
                    if (!agentStatuses.some(function (status) {
                        if (agent.uuid === status.uuid) {
                            agent.actionPending = false;
                            agent.process_id = status.process_id;
                            agent.return_code = status.return_code;

                            return true;
                        }
                    })) {
                        agent.actionPending = false;
                        agent.process_id = null;
                        agent.return_code = null;
                    }
                });

                dispatcher.dispatch({
                    type: ACTION_TYPES.RECEIVE_PLATFORM,
                    platform: platform
                });
            }).catch(rpc.Error, function (error) {
                handle401(error);
            });
        }).catch(rpc.Error, function (error) {
            handle401(error);
        });
    },
    startAgent: function startAgent(platform, agent) {
        var authorization = authorizationStore.getAuthorization();

        agent.actionPending = true;

        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_PLATFORM,
            platform: platform
        });

        new rpc.Exchange({
            method: 'platforms.uuid.' + platform.uuid + '.start_agent',
            params: [agent.uuid],
            authorization: authorization
        }).promise.then(function (status) {
            agent.process_id = status.process_id;
            agent.return_code = status.return_code;
        }).catch(rpc.Error, function (error) {
            handle401(error, "Unable to start agent " + agent.name + ": " + error.message, agent.name);
        }).finally(function () {
            agent.actionPending = false;

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_PLATFORM,
                platform: platform
            });
        });
    },
    stopAgent: function stopAgent(platform, agent) {
        var authorization = authorizationStore.getAuthorization();

        agent.actionPending = true;

        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_PLATFORM,
            platform: platform
        });

        new rpc.Exchange({
            method: 'platforms.uuid.' + platform.uuid + '.stop_agent',
            params: [agent.uuid],
            authorization: authorization
        }).promise.then(function (status) {
            agent.process_id = status.process_id;
            agent.return_code = status.return_code;
        }).catch(rpc.Error, function (error) {
            handle401(error, "Unable to stop agent " + agent.name + ": " + error.message, agent.name);
        }).finally(function () {
            agent.actionPending = false;

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_PLATFORM,
                platform: platform
            });
        });
    },
    removeAgent: function removeAgent(platform, agent) {
        var authorization = authorizationStore.getAuthorization();

        agent.actionPending = true;

        dispatcher.dispatch({
            type: ACTION_TYPES.CLOSE_MODAL
        });

        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_PLATFORM,
            platform: platform
        });

        var methodStr = 'platforms.uuid.' + platform.uuid + '.remove_agent';
        var agentId = [agent.uuid];

        new rpc.Exchange({
            method: methodStr,
            params: agentId,
            authorization: authorization
        }).promise.then(function (result) {

            if (result.error) {
                statusIndicatorActionCreators.openStatusIndicator("error", "Unable to remove agent " + agent.name + ": " + result.error, agent.name);
            } else {
                platformActionCreators.loadPlatform(platform);
            }
        }).catch(rpc.Error, function (error) {
            handle401(error, "Unable to remove agent " + agent.name + ": " + error.message, agent.name);
        });
    },
    installAgents: function installAgents(platform, files) {

        var authorization = authorizationStore.getAuthorization();

        new rpc.Exchange({
            method: 'platforms.uuid.' + platform.uuid + '.install',
            params: { files: files },
            authorization: authorization
        }).promise.then(function (results) {
            var errors = [];

            results.forEach(function (result) {
                if (result.error) {
                    errors.push(result.error);
                }
            });

            if (errors.length) {
                statusIndicatorActionCreators.openStatusIndicator("error", "Unable to install agents for platform " + platform.name + ": " + errors.join('\n'), platform.name);
            }

            if (errors.length !== files.length) {
                platformActionCreators.loadPlatform(platform);
            }
        }).catch(rpc.Error, function (error) {
            handle401(error, "Unable to install agents for platform " + platform.name + ": " + error.message, platform.name);
        });
    },
    handleChartsForUser: function handleChartsForUser(callback) {
        var authorization = authorizationStore.getAuthorization();
        var user = authorizationStore.getUsername();

        if (user) {
            callback(authorization, user);
        }
    },
    loadChartTopics: function loadChartTopics() {
        var authorization = authorizationStore.getAuthorization();

        new rpc.Exchange({
            method: 'historian.get_topic_list',
            authorization: authorization
        }).promise.then(function (topics) {

            var filteredTopics = [];

            topics.forEach(function (topic, index) {

                if (topic.indexOf("datalogger/platform/status") < 0) // ignore -- they're local platform topics that are in
                    {
                        // the list twice, also at datalogger/platform/<uuid>
                        var item = {};
                        var topicParts = topic.split("/");

                        if (topicParts.length > 2) {
                            var name;
                            var parentPath;
                            var label;

                            if (topic.indexOf("datalogger/platforms") > -1) // if a platform instance
                                {
                                    var platformUuid = topicParts[2];
                                    var topicPlatform = platformsStore.getPlatform(platformUuid);
                                    parentPath = topicPlatform ? topicPlatform.name : "Unknown Platform";
                                    label = topicParts[topicParts.length - 2] + "/" + topicParts[topicParts.length - 1] + " (" + parentPath + ")";
                                    name = topicParts[topicParts.length - 2] + " / " + topicParts[topicParts.length - 1]; // the name is the
                                    // last two path parts
                                } // ex.: times_percent / idle
                            else // else a device point
                                {
                                    parentPath = topicParts[0];

                                    for (var i = 1; i < topicParts.length - 1; i++) {
                                        parentPath = parentPath + " > " + topicParts[i];
                                    }

                                    label = topicParts[topicParts.length - 1] + " (" + parentPath + ")";
                                    name = topicParts[topicParts.length - 1]; // the name is the column name

                                    item.path = platformsPanelItemsStore.findTopicInTree(topic);
                                }

                            item.value = topic;
                            item.label = label;
                            item.key = index;
                            item.name = name;
                            item.parentPath = parentPath;

                            filteredTopics.push(item);
                        }
                    }
            });

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_CHART_TOPICS,
                topics: filteredTopics
            });
        }).catch(rpc.Error, function (error) {

            var message = error.message;

            if (error.code === -32602) {
                if (error.message === "historian unavailable") {
                    message = "Charts can't be added. The VOLTTRON Central historian is unavailable.";
                }
            } else {
                message = "Chart topics can't be loaded. " + error.message;
            }

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_CHART_TOPICS,
                topics: []
            });

            statusIndicatorActionCreators.openStatusIndicator("error", message);
            handle401(error);
        });
    },
    loadCharts: function loadCharts(platform) {

        var doLoadCharts = function (authorization, user) {
            new rpc.Exchange({
                method: 'get_setting_keys',
                authorization: authorization
            }).promise.then(function (valid_keys) {

                if (valid_keys.indexOf(user) > -1) {
                    new rpc.Exchange({
                        method: 'get_setting',
                        params: { key: user },
                        authorization: authorization
                    }).promise.then(function (charts) {

                        var notifyRouter = false;

                        dispatcher.dispatch({
                            type: ACTION_TYPES.LOAD_CHARTS,
                            charts: charts
                        });
                    }).catch(rpc.Error, function (error) {
                        handle401(error);
                    });
                }
            }).catch(rpc.Error, function (error) {
                handle401(error);
            });
        }.bind(platform);

        platformActionCreators.handleChartsForUser(doLoadCharts);
    },
    saveCharts: function saveCharts(chartsToSave) {

        var doSaveCharts = function (authorization, user) {
            var savedCharts = this ? this : platformChartStore.getPinnedCharts();

            new rpc.Exchange({
                method: 'set_setting',
                params: { key: user, value: savedCharts },
                authorization: authorization
            }).promise.then(function () {}).catch(rpc.Error, function (error) {
                handle401(error, "Unable to save charts: " + error.message);
            });
        }.bind(chartsToSave);

        platformActionCreators.handleChartsForUser(doSaveCharts);
    },
    saveChart: function saveChart(newChart) {

        var doSaveChart = function (authorization, user) {
            var newCharts = [this];

            new rpc.Exchange({
                method: 'set_setting',
                params: { key: user, value: newCharts },
                authorization: authorization
            }).promise.then(function () {}).catch(rpc.Error, function (error) {
                handle401(error, "Unable to save chart: " + error.message);
            });
        }.bind(newChart);

        platformActionCreators.handleChartsForUser(doSaveChart);
    },
    deleteChart: function deleteChart(chartToDelete) {

        var doDeleteChart = function (authorization, user) {

            var savedCharts = platformChartStore.getPinnedCharts();

            var newCharts = savedCharts.filter(function (chart) {
                return chart.chartKey !== this;
            });

            new rpc.Exchange({
                method: 'set_setting',
                params: { key: user, value: newCharts },
                authorization: authorization
            }).promise.then(function () {}).catch(rpc.Error, function (error) {
                handle401(error, "Unable to delete chart: " + error.message);
            });
        }.bind(chartToDelete);

        platformActionCreators.handleChartsForUser(doDeleteChart);
    },
    removeSavedPlatformCharts: function removeSavedPlatformCharts(platform) {

        var authorization = authorizationStore.getAuthorization();

        // first get all the keys (i.e., users) that charts are saved under
        new rpc.Exchange({
            method: 'get_setting_keys',
            authorization: authorization
        }).promise.then(function (valid_keys) {

            // then get the charts for each user
            valid_keys.forEach(function (key) {

                new rpc.Exchange({
                    method: 'get_setting',
                    params: { key: key },
                    authorization: authorization
                }).promise.then(function (charts) {

                    // for each saved chart, keep the chart if it has any series that don't belong
                    // to the deregistered platform
                    var filteredCharts = charts.filter(function (chart) {

                        var keeper = true;
                        var seriesToRemove;

                        var filteredSeries = chart.series.filter(function (series) {
                            var seriesToKeep = series.path.indexOf(this.uuid) < 0;

                            // also have to remove any data associated with the removed series
                            if (!seriesToKeep) {
                                var filteredData = chart.data.filter(function (datum) {
                                    return datum.uuid !== this.uuid;
                                }, series);

                                chart.data = filteredData;
                            }

                            return seriesToKeep;
                        }, this);

                        // keep the chart if there are any series that don't belong to the deregistered platform,
                        // but leave out the series that do belong to the deregistered platform
                        if (filteredSeries.length !== 0) {
                            chart.series = filteredSeries;
                        } else {
                            keeper = false;
                        }

                        return keeper;
                    }, platform);

                    // now save the remaining charts. Even if there are none, do the save, because that's what deletes 
                    // the rejects.
                    new rpc.Exchange({
                        method: 'set_setting',
                        params: { key: key, value: filteredCharts },
                        authorization: authorization
                    }).promise.then(function () {}).catch(rpc.Error, function (error) {
                        handle401(error, "Error removing deregistered platform's charts from saved charts (e0): " + error.message);
                    });
                }).catch(rpc.Error, function (error) {
                    handle401(error, "Error removing deregistered platform's charts from saved charts (e1): " + error.message);
                });
            });
        }).catch(rpc.Error, function (error) {
            handle401(error, "Error removing deregistered platform's charts from saved charts (e2): " + error.message);
        });
    }

};

function handle401(error, message, highlight, orientation) {
    if (error.code && error.code === 401 || error.response && error.response.status === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error
        });

        dispatcher.dispatch({
            type: ACTION_TYPES.CLEAR_AUTHORIZATION
        });
    } else if (message) {
        statusIndicatorActionCreators.openStatusIndicator("error", message, highlight, orientation);
    }
}

module.exports = platformActionCreators;

},{"../action-creators/status-indicator-action-creators":10,"../constants/action-types":47,"../dispatcher":48,"../lib/rpc":51,"../stores/authorization-store":56,"../stores/platform-chart-store":61,"../stores/platforms-panel-items-store":62,"../stores/platforms-store":64}],7:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var authorizationStore = require('../stores/authorization-store');
var platformChartStore = require('../stores/platform-chart-store');
var platformsStore = require('../stores/platforms-store');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');
var rpc = require('../lib/rpc');

var platformChartActionCreators = {
    pinChart: function pinChart(chartKey) {
        dispatcher.dispatch({
            type: ACTION_TYPES.PIN_CHART,
            chartKey: chartKey
        });
    },
    setType: function setType(chartKey, chartType) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CHANGE_CHART_TYPE,
            chartKey: chartKey,
            chartType: chartType
        });
    },
    changeRefreshRate: function changeRefreshRate(rate, chartKey) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CHANGE_CHART_REFRESH,
            rate: rate,
            chartKey: chartKey
        });
    },
    setMin: function setMin(min, chartKey) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CHANGE_CHART_MIN,
            min: min,
            chartKey: chartKey
        });
    },
    setMax: function setMax(max, chartKey) {
        dispatcher.dispatch({
            type: ACTION_TYPES.CHANGE_CHART_MAX,
            max: max,
            chartKey: chartKey
        });
    },
    refreshChart: function refreshChart(series) {

        var authorization = authorizationStore.getAuthorization();

        series.forEach(function (item) {
            new rpc.Exchange({
                method: 'historian.query',
                params: {
                    topic: item.topic,
                    count: 20,
                    order: 'LAST_TO_FIRST'
                },
                authorization: authorization
            }).promise.then(function (result) {

                if (result.hasOwnProperty("values")) {
                    item.data = result.values;

                    item.data.forEach(function (datum) {
                        datum.name = item.name;
                        datum.parent = item.parentPath;
                        datum.uuid = item.uuid;
                    });
                    dispatcher.dispatch({
                        type: ACTION_TYPES.REFRESH_CHART,
                        item: item
                    });
                } else {
                    console.log("chart " + item.name + " isn't being refreshed");
                }
            }).catch(rpc.Error, function (error) {
                handle401(error);
            });
        });
    },
    addToChart: function addToChart(panelItem, emitChange) {

        var authorization = authorizationStore.getAuthorization();

        new rpc.Exchange({
            method: 'historian.query',
            params: {
                topic: panelItem.topic,
                count: 20,
                order: 'LAST_TO_FIRST'
            },
            authorization: authorization
        }).promise.then(function (result) {

            if (result.hasOwnProperty("values")) {
                panelItem.data = result.values;

                panelItem.data.forEach(function (datum) {
                    datum.name = panelItem.name;
                    datum.parent = panelItem.parentPath;
                    datum.uuid = panelItem.uuid;
                });

                dispatcher.dispatch({
                    type: ACTION_TYPES.SHOW_CHARTS,
                    emitChange: emitChange === null || typeof emitChange === "undefined" ? true : emitChange
                });

                dispatcher.dispatch({
                    type: ACTION_TYPES.ADD_TO_CHART,
                    panelItem: panelItem
                });

                platformsPanelActionCreators.checkItem(panelItem.path, true);

                var savedCharts = platformChartStore.getPinnedCharts();
                var inSavedChart = savedCharts.find(function (chart) {
                    return chart.chartKey === panelItem.name;
                });

                if (inSavedChart) {
                    platformActionCreators.saveCharts(savedCharts);
                }
            } else {
                var message = "Unable to load chart: An unknown problem occurred.";
                var orientation = "center";
                var error = {};

                if (panelItem.path && panelItem.path.length > 1) {
                    var platformUuid = panelItem.path[1];
                    var forwarderRunning = platformsStore.getForwarderRunning(platformUuid);

                    if (!forwarderRunning) {
                        message = "Unable to load chart: The forwarder agent for the device's platform isn't available.";
                        orientation = "left";
                    }
                }

                platformsPanelActionCreators.checkItem(panelItem.path, false);
                handle401(error, message, null, orientation);
            }
        }).catch(rpc.Error, function (error) {

            var message = "Unable to load chart: " + error.message;
            var orientation;

            if (error.code === -32602) {
                if (error.message === "historian unavailable") {
                    message = "Unable to load chart: The VOLTTRON Central platform's historian is unavailable.";
                    orientation = "left";
                }
            } else {
                var historianRunning = platformsStore.getVcHistorianRunning();

                if (!historianRunning) {
                    message = "Unable to load chart: The VOLTTRON Central platform's historian is unavailable.";
                    orientation = "left";
                }
            }

            platformsPanelActionCreators.checkItem(panelItem.path, false);
            handle401(error, message, null, orientation);
        });
    },
    removeFromChart: function removeFromChart(panelItem) {

        var savedCharts = platformChartStore.getPinnedCharts();
        var inSavedChart = savedCharts.find(function (chart) {
            return chart.chartKey === panelItem.name;
        });

        dispatcher.dispatch({
            type: ACTION_TYPES.REMOVE_FROM_CHART,
            panelItem: panelItem
        });

        platformsPanelActionCreators.checkItem(panelItem.path, false);

        if (inSavedChart) {
            platformActionCreators.saveCharts();
        }
    },
    removeChart: function removeChart(chartName) {

        dispatcher.dispatch({
            type: ACTION_TYPES.REMOVE_CHART,
            name: chartName
        });
    }
};

function handle401(error, message, highlight, orientation) {
    if (error.code && error.code === 401 || error.response && error.response.status === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error
        });

        dispatcher.dispatch({
            type: ACTION_TYPES.CLEAR_AUTHORIZATION
        });
    } else if (message) {
        statusIndicatorActionCreators.openStatusIndicator("error", message, highlight, orientation);
    }
}

module.exports = platformChartActionCreators;

},{"../action-creators/platform-action-creators":6,"../action-creators/platforms-panel-action-creators":9,"../action-creators/status-indicator-action-creators":10,"../constants/action-types":47,"../dispatcher":48,"../lib/rpc":51,"../stores/authorization-store":56,"../stores/platform-chart-store":61,"../stores/platforms-panel-items-store":62,"../stores/platforms-store":64}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var dispatcher = require('../dispatcher');
var platformActionCreators = require('../action-creators/platform-action-creators');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var rpc = require('../lib/rpc');

var initializing = false;

var platformManagerActionCreators = {
    initialize: function initialize() {
        if (!authorizationStore.getAuthorization()) {
            return;
        }

        var reload = false;
        platformManagerActionCreators.loadPlatforms(reload);
    },
    requestAuthorization: function requestAuthorization(username, password) {
        new rpc.Exchange({
            method: 'get_authorization',
            params: {
                username: username,
                password: password
            }
        }, ['password']).promise.then(function (result) {

            dispatcher.dispatch({
                type: ACTION_TYPES.WILL_INITIALIZE_PLATFORMS
            });

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_AUTHORIZATION,
                authorization: result,
                name: username
            });
        }).then(platformManagerActionCreators.initialize).catch(rpc.Error, function (error) {

            var message = error.message;

            if (error.response.status === 401) {
                message = "Invalid username/password specified.";
            }

            statusIndicatorActionCreators.openStatusIndicator("error", message, null, "center"); //This is needed because the 401 status  
            handle401(error, error.message); // will keep the statusindicator from being shown. This is 
        }); // the one time we show bad status for not authorized. Other 
    }, // times, we just log them out.
    clearAuthorization: function clearAuthorization() {
        dispatcher.dispatch({
            type: ACTION_TYPES.CLEAR_AUTHORIZATION
        });
    },
    loadPlatforms: function loadPlatforms(reload) {
        var authorization = authorizationStore.getAuthorization();

        return new rpc.Exchange({
            method: 'list_platforms',
            authorization: authorization
        }).promise.then(function (platforms) {

            platforms = platforms.map(function (platform, index) {

                if (platform.name === null || platform.name === "" || _typeof(platform.name) === undefined) {
                    platform.name = "Unnamed Platform " + (index + 1);
                }

                return platform;
            });

            var managerPlatforms = JSON.parse(JSON.stringify(platforms));
            var panelPlatforms = JSON.parse(JSON.stringify(platforms));

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_PLATFORMS,
                platforms: managerPlatforms
            });

            dispatcher.dispatch({
                type: ACTION_TYPES.RECEIVE_PLATFORM_STATUSES,
                platforms: panelPlatforms,
                reload: reload
            });

            managerPlatforms.forEach(function (platform, i) {
                platformActionCreators.loadAgents(platform);

                if (!reload) {
                    platformActionCreators.loadCharts(platform);
                }
            });
        }).catch(rpc.Error, function (error) {
            handle401(error, error.message);
        });
    },
    registerPlatform: function registerPlatform(name, address, method) {
        var authorization = authorizationStore.getAuthorization();

        var rpcMethod;
        var params = {};

        switch (method) {
            case "discovery":
                rpcMethod = 'register_instance';
                params = {
                    display_name: name,
                    discovery_address: address
                };
                break;
            case "advanced":
                rpcMethod = 'register_platform';
                params = {
                    identity: 'platform.agent',
                    agentId: name,
                    address: address
                };
                break;
        }

        new rpc.Exchange({
            method: rpcMethod,
            authorization: authorization,
            params: params
        }).promise.then(function (result) {
            dispatcher.dispatch({
                type: ACTION_TYPES.CLOSE_MODAL
            });

            statusIndicatorActionCreators.openStatusIndicator("success", "Platform " + name + " was registered.", name, "center");

            var reload = true;
            platformManagerActionCreators.loadPlatforms(reload);
        }).catch(rpc.Error, function (error) {

            dispatcher.dispatch({
                type: ACTION_TYPES.CLOSE_MODAL
            });

            var message = "Platform " + name + " was not registered: " + error.message;
            var orientation;

            switch (error.code) {
                case -32600:
                    message = "Platform " + name + " was not registered: Invalid address.";
                    orientation = "center";
                    break;
                case -32000:
                    message = "Platform " + name + " was not registered: An unknown error occurred.";
                    orientation = "center";
                    break;
            }

            handle401(error, message, name, orientation);
        });
    },
    deregisterPlatform: function deregisterPlatform(platform) {
        var authorization = authorizationStore.getAuthorization();

        var platformName = platform.name;

        new rpc.Exchange({
            method: 'unregister_platform',
            authorization: authorization,
            params: {
                platform_uuid: platform.uuid
            }
        }).promise.then(function (result) {
            dispatcher.dispatch({
                type: ACTION_TYPES.CLOSE_MODAL
            });

            platformActionCreators.removeSavedPlatformCharts(platform);

            statusIndicatorActionCreators.openStatusIndicator("success", "Platform " + platformName + " was deregistered.", platformName, "center");
            dispatcher.dispatch({
                type: ACTION_TYPES.REMOVE_PLATFORM_CHARTS,
                platform: platform
            });

            var reload = true;
            platformManagerActionCreators.loadPlatforms(reload);
        }).catch(rpc.Error, function (error) {
            var message = "Platform " + platformName + " was not deregistered: " + error.message;

            handle401(error, message, platformName);
        });
    }
};

function handle401(error, message, highlight, orientation) {
    if (error.code && error.code === 401 || error.response && error.response.status === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error
        });

        platformManagerActionCreators.clearAuthorization();
    } else if (message) {
        statusIndicatorActionCreators.openStatusIndicator("error", message, highlight, orientation);
    }
}

module.exports = platformManagerActionCreators;

},{"../action-creators/platform-action-creators":6,"../action-creators/status-indicator-action-creators":10,"../constants/action-types":47,"../dispatcher":48,"../lib/rpc":51,"../stores/authorization-store":56}],9:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var dispatcher = require('../dispatcher');
var rpc = require('../lib/rpc');

var platformsPanelActionCreators = {
    togglePanel: function togglePanel() {

        dispatcher.dispatch({
            type: ACTION_TYPES.TOGGLE_PLATFORMS_PANEL
        });
    },

    loadChildren: function loadChildren(type, parent) {
        if (type === "platform") {
            dispatcher.dispatch({
                type: ACTION_TYPES.START_LOADING_DATA,
                panelItem: parent
            });

            loadPanelDevices(parent);
        }

        function loadPanelDevices(platform) {
            var authorization = authorizationStore.getAuthorization();

            new rpc.Exchange({
                method: 'platforms.uuid.' + platform.uuid + '.get_devices',
                authorization: authorization
            }).promise.then(function (result) {

                var devicesList = [];

                for (var key in result) {
                    var device = JSON.parse(JSON.stringify(result[key]));
                    device.path = key;

                    devicesList.push(device);
                }

                dispatcher.dispatch({
                    type: ACTION_TYPES.RECEIVE_DEVICE_STATUSES,
                    platform: platform,
                    devices: devicesList
                });

                loadPanelAgents(platform);
            }).catch(rpc.Error, function (error) {
                endLoadingData(platform);
                handle401(error, "Unable to load devices for platform " + platform.name + " in side panel: " + error.message, platform.name);
            });
        }

        function loadPanelAgents(platform) {
            var authorization = authorizationStore.getAuthorization();

            new rpc.Exchange({
                method: 'platforms.uuid.' + platform.uuid + '.list_agents',
                authorization: authorization
            }).promise.then(function (agentsList) {

                dispatcher.dispatch({
                    type: ACTION_TYPES.RECEIVE_AGENT_STATUSES,
                    platform: platform,
                    agents: agentsList
                });

                loadPerformanceStats(platform);
            }).catch(rpc.Error, function (error) {
                endLoadingData(platform);
                handle401(error, "Unable to load agents for platform " + platform.name + " in side panel: " + error.message, platform.name);
            });
        }

        function loadPerformanceStats(parent) {

            if (parent.type === "platform") {
                var authorization = authorizationStore.getAuthorization();

                //TODO: use service to get performance for a single platform

                new rpc.Exchange({
                    method: 'list_performance',
                    authorization: authorization
                }).promise.then(function (result) {

                    var platformPerformance = result.find(function (item) {
                        return item["platform.uuid"] === parent.uuid;
                    });

                    var pointsList = [];

                    if (platformPerformance) {
                        var points = platformPerformance.performance.points;

                        points.forEach(function (point) {

                            var pointName = point === "percent" ? "cpu / percent" : point.replace("/", " / ");

                            pointsList.push({
                                "topic": platformPerformance.performance.topic + "/" + point,
                                "name": pointName
                            });
                        });
                    }

                    dispatcher.dispatch({
                        type: ACTION_TYPES.RECEIVE_PERFORMANCE_STATS,
                        parent: parent,
                        points: pointsList
                    });

                    endLoadingData(parent);
                }).catch(rpc.Error, function (error) {

                    var message = error.message;

                    if (error.code === -32602) {
                        if (error.message === "historian unavailable") {
                            message = "Data could not be fetched for platform " + parent.name + ". The historian agent is unavailable.";
                        }
                    }

                    endLoadingData(parent);
                    handle401(error, message, parent.name, "center");
                });
            }
        }

        function endLoadingData(panelItem) {
            dispatcher.dispatch({
                type: ACTION_TYPES.END_LOADING_DATA,
                panelItem: panelItem
            });
        }
    },

    loadFilteredItems: function loadFilteredItems(filterTerm, filterStatus) {
        dispatcher.dispatch({
            type: ACTION_TYPES.FILTER_ITEMS,
            filterTerm: filterTerm,
            filterStatus: filterStatus
        });
    },

    expandAll: function expandAll(itemPath) {

        dispatcher.dispatch({
            type: ACTION_TYPES.EXPAND_ALL,
            itemPath: itemPath
        });
    },

    toggleItem: function toggleItem(itemPath) {

        dispatcher.dispatch({
            type: ACTION_TYPES.TOGGLE_ITEM,
            itemPath: itemPath
        });
    },

    checkItem: function checkItem(itemPath, checked) {

        dispatcher.dispatch({
            type: ACTION_TYPES.CHECK_ITEM,
            itemPath: itemPath,
            checked: checked
        });
    }
};

function handle401(error, message, highlight, orientation) {
    if (error.code && error.code === 401 || error.response && error.response.status === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error
        });

        dispatcher.dispatch({
            type: ACTION_TYPES.CLEAR_AUTHORIZATION
        });
    } else if (message) {
        statusIndicatorActionCreators.openStatusIndicator("error", message, highlight, orientation);
    }
}

module.exports = platformsPanelActionCreators;

},{"../action-creators/status-indicator-action-creators":10,"../constants/action-types":47,"../dispatcher":48,"../lib/rpc":51,"../stores/authorization-store":56,"../stores/platforms-panel-items-store":62}],10:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');

var actionStatusCreators = {
	openStatusIndicator: function openStatusIndicator(status, message, highlight, align) {

		dispatcher.dispatch({
			type: ACTION_TYPES.OPEN_STATUS,
			status: status,
			message: message,
			highlight: highlight,
			align: align
		});
	},
	closeStatusIndicator: function closeStatusIndicator() {
		dispatcher.dispatch({
			type: ACTION_TYPES.CLOSE_STATUS
		});
	}
};

module.exports = actionStatusCreators;

},{"../constants/action-types":47,"../dispatcher":48}],11:[function(require,module,exports){
'use strict';

var React = require('react');

var platformActionCreators = require('../action-creators/platform-action-creators');
var modalActionCreators = require('../action-creators/modal-action-creators');

var RemoveAgentForm = require('./remove-agent-form');

var AgentRow = React.createClass({
    displayName: 'AgentRow',

    _onStop: function _onStop() {
        platformActionCreators.stopAgent(this.props.platform, this.props.agent);
    },
    _onStart: function _onStart() {
        platformActionCreators.startAgent(this.props.platform, this.props.agent);
    },
    _onRemove: function _onRemove() {
        modalActionCreators.openModal(React.createElement(RemoveAgentForm, { platform: this.props.platform, agent: this.props.agent }));
    },
    render: function render() {
        var agent = this.props.agent,
            status,
            action,
            remove,
            notAllowed;

        if (agent.actionPending === undefined) {
            status = 'Retrieving status...';
        } else if (agent.actionPending) {
            if (agent.process_id === null || agent.return_code !== null) {
                status = 'Starting...';
                action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Start', disabled: true });
            } else {
                status = 'Stopping...';
                action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Stop', disabled: true });
            }
        } else {

            if (agent.process_id === null) {
                status = 'Never started';

                if (agent.permissions.can_start) {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Start', onClick: this._onStart });
                } else {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Start', onClick: this._onStart, disabled: true });
                }
            } else if (agent.return_code === null) {
                status = 'Running (PID ' + agent.process_id + ')';

                if (agent.permissions.can_stop) {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Stop', onClick: this._onStop });
                } else {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Stop', onClick: this._onStop, disabled: true });
                }
            } else {
                status = 'Stopped (returned ' + agent.return_code + ')';

                if (agent.permissions.can_restart) {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Start', onClick: this._onStart });
                } else {
                    action = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Start', onClick: this._onStart, disabled: true });
                }
            }
        }

        if (agent.permissions.can_remove) {
            remove = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Remove', onClick: this._onRemove });
        } else {
            remove = React.createElement('input', { className: 'button button--agent-action', type: 'button', value: 'Remove', onClick: this._onRemove, disabled: true });
        }

        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                agent.name
            ),
            React.createElement(
                'td',
                null,
                agent.uuid
            ),
            React.createElement(
                'td',
                null,
                status
            ),
            React.createElement(
                'td',
                null,
                action,
                ' ',
                remove
            )
        );
    }
});

module.exports = AgentRow;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-action-creators":6,"./remove-agent-form":45,"react":undefined}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseComponent = function (_React$Component) {
	_inherits(BaseComponent, _React$Component);

	function BaseComponent() {
		_classCallCheck(this, BaseComponent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseComponent).apply(this, arguments));
	}

	_createClass(BaseComponent, [{
		key: '_bind',
		value: function _bind() {
			var _this2 = this;

			for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
				methods[_key] = arguments[_key];
			}

			methods.forEach(function (method) {
				return _this2[method] = _this2[method].bind(_this2);
			});
		}
	}]);

	return BaseComponent;
}(_react2.default.Component);

exports.default = BaseComponent;

},{"react":undefined}],13:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var OutsideClick = require('react-click-outside');

var ComboBox = React.createClass({
    displayName: 'ComboBox',

    getInitialState: function getInitialState() {

        var preppedItems = prepItems(this.props.itemskey, this.props.itemsvalue, this.props.itemslabel, this.props.items);

        var state = {
            selectedKey: "",
            selectedLabel: "",
            selectedValue: "",
            inputValue: "",
            hideMenu: true,
            preppedItems: preppedItems,
            itemsList: preppedItems,
            focusedIndex: -1
        };

        this.forceHide = false;

        return state;
    },
    componentDidUpdate: function componentDidUpdate() {
        if (this.forceHide) {
            ReactDOM.findDOMNode(this.refs.comboInput).blur();
            this.forceHide = false;
        } else {
            if (this.state.focusedIndex > -1) {
                var modal = document.querySelector(".modal__dialog");

                var comboItems = document.querySelectorAll(".combobox-item");

                if (comboItems.length > this.state.focusedIndex) {
                    var targetItem = comboItems[this.state.focusedIndex];

                    if (targetItem) {
                        var menu = targetItem.parentNode;

                        var menuRect = menu.getBoundingClientRect();
                        var modalRect = modal.getBoundingClientRect();
                        var targetRect = targetItem.getBoundingClientRect();

                        if (targetRect.bottom > modalRect.bottom || targetRect.top < modalRect.top) {
                            var newTop = targetRect.top - menuRect.top;

                            modal.scrollTop = newTop;
                        }
                    }
                }
            }
        }
    },
    handleClickOutside: function handleClickOutside() {
        if (!this.state.hideMenu) {
            var validValue = this._validateValue(this.state.inputValue);
            this.props.onselect(validValue);
            this.setState({ hideMenu: true });
            this.setState({ focusedIndex: -1 });
        }
    },
    _validateValue: function _validateValue(inputValue) {

        var validInput = this.props.items.find(function (item) {
            return item.label === inputValue;
        });

        var validKey = validInput ? validInput.key : "";
        var validValue = validInput ? validInput.value : "";
        var validLabel = validInput ? validInput.label : "";

        this.setState({ selectedKey: validKey });
        this.setState({ selectedValue: validValue });
        this.setState({ selectedLabel: validLabel });

        return validValue;
    },
    _onClick: function _onClick(e) {
        this.setState({ selectedKey: e.target.dataset.key });
        this.setState({ selectedLabel: e.target.dataset.label });
        this.setState({ selectedValue: e.target.dataset.value });
        this.setState({ inputValue: e.target.dataset.label });
        this.setState({ hideMenu: true });

        this.props.onselect(e.target.dataset.value);

        this.setState({ focusedIndex: -1 });
    },
    _onFocus: function _onFocus() {
        this.setState({ hideMenu: false });
    },
    _onKeyup: function _onKeyup(e) {
        switch (e.keyCode) {
            case 13:
                //Enter key
                this.forceHide = true;
                this.setState({ hideMenu: true });

                var inputValue = this.state.inputValue;

                if (this.state.focusedIndex > -1) {
                    var selectedItem = this.state.itemsList[this.state.focusedIndex];
                    inputValue = selectedItem.label;

                    this.setState({ inputValue: inputValue });
                    this.setState({ selectedKey: selectedItem.key });
                    this.setState({ selectedLabel: selectedItem.label });
                    this.setState({ selectedValue: selectedItem.value });
                }

                var validValue = this._validateValue(inputValue);
                this.props.onselect(validValue);

                this.setState({ focusedIndex: -1 });
                break;
        }
    },
    _onKeydown: function _onKeydown(e) {
        switch (e.keyCode) {
            case 9: //Tab key
            case 40:
                //Arrow down key

                e.preventDefault();

                var newIndex = 0;

                if (this.state.focusedIndex < this.state.itemsList.length - 1) {
                    newIndex = this.state.focusedIndex + 1;
                }

                this.setState({ focusedIndex: newIndex });
                break;
            case 38:
                //Arrow up key

                e.preventDefault();

                var newIndex = this.state.itemsList.length - 1;

                if (this.state.focusedIndex > 0) {
                    newIndex = this.state.focusedIndex - 1;
                }

                this.setState({ focusedIndex: newIndex });
                break;
        }
    },
    _onChange: function _onChange(e) {

        var inputValue = e.target.value;

        var itemsList = filterItems(inputValue, this.state.preppedItems);

        this.setState({ itemsList: itemsList });

        this.setState({ inputValue: inputValue });
    },

    render: function render() {

        var menuStyle = {
            display: this.state.hideMenu ? 'none' : 'block'
        };

        var inputStyle = {
            width: "390px"
        };

        var items = this.state.itemsList.map(function (item, index) {

            var highlightStyle = {};

            if (this.state.focusedIndex > -1 && this.state.focusedIndex === index) {
                highlightStyle.backgroundColor = "#B2C9D1";
            }

            return React.createElement(
                'div',
                { className: 'combobox-item',
                    style: highlightStyle,
                    key: item.key },
                React.createElement(
                    'div',
                    {
                        onClick: this._onClick,
                        'data-label': item.label,
                        'data-value': item.value,
                        'data-key': item.key },
                    item.label
                )
            );
        }, this);

        return React.createElement(
            'div',
            { className: 'combobox-control' },
            React.createElement('input', {
                style: inputStyle,
                type: 'text',
                onFocus: this._onFocus,
                onChange: this._onChange,
                onKeyUp: this._onKeyup,
                onKeyDown: this._onKeydown,
                ref: 'comboInput',
                placeholder: 'type here to see topics',
                value: this.state.inputValue }),
            React.createElement(
                'div',
                { className: 'combobox-menu', style: menuStyle },
                items
            )
        );
    }
});

function prepItems(itemsKey, itemsValue, itemsLabel, itemsList) {
    var props = {
        itemsKey: itemsKey,
        itemsValue: itemsValue,
        itemsLabel: itemsLabel
    };

    var list = itemsList.map(function (item, index) {

        var preppedItem = {
            key: this.itemsKey ? item[this.itemsKey] : index,
            value: this.itemsValue ? item[this.itemsValue] : item,
            label: this.itemsLabel ? item[this.itemsLabel] : item
        };

        return preppedItem;
    }, props);

    return JSON.parse(JSON.stringify(list));
}

function filterItems(filterTerm, itemsList) {
    var listCopy = JSON.parse(JSON.stringify(itemsList));

    var filteredItems = listCopy;

    if (filterTerm) {
        filteredItems = [];

        listCopy.forEach(function (item) {
            if (item.label.toUpperCase().indexOf(filterTerm.toUpperCase()) > -1) {
                filteredItems.push(item);
            }
        });
    }

    return filteredItems;
}

module.exports = OutsideClick(ComboBox);

},{"react":undefined,"react-click-outside":undefined,"react-dom":undefined}],14:[function(require,module,exports){
'use strict';

var React = require('react');

var consoleActionCreators = require('../action-creators/console-action-creators');
var consoleStore = require('../stores/console-store');

var Composer = React.createClass({
    displayName: 'Composer',

    getInitialState: getStateFromStores,
    componentDidMount: function componentDidMount() {
        consoleStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        consoleStore.removeChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.replaceState(getStateFromStores());
    },
    _onSendClick: function _onSendClick() {
        consoleActionCreators.makeRequest(JSON.parse(this.state.composerValue));
    },
    _onTextareaChange: function _onTextareaChange(e) {
        consoleActionCreators.updateComposerValue(e.target.value);
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'composer' },
            React.createElement('textarea', {
                key: this.state.composerId,
                onChange: this._onTextareaChange,
                defaultValue: this.state.composerValue
            }),
            React.createElement('input', {
                className: 'button',
                ref: 'send',
                type: 'button',
                value: 'Send',
                disabled: !this.state.valid,
                onClick: this._onSendClick
            })
        );
    }
});

function getStateFromStores() {
    var composerValue = consoleStore.getComposerValue();
    var valid = true;

    try {
        JSON.parse(composerValue);
    } catch (ex) {
        if (ex instanceof SyntaxError) {
            valid = false;
        } else {
            throw ex;
        }
    }

    return {
        composerId: consoleStore.getComposerId(),
        composerValue: composerValue,
        valid: valid
    };
}

module.exports = Composer;

},{"../action-creators/console-action-creators":2,"../stores/console-store":57,"react":undefined}],15:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');
var CsvParse = require('babyparse');

var ConfirmForm = require('./confirm-form');
var modalActionCreators = require('../action-creators/modal-action-creators');
var devicesActionCreators = require('../action-creators/devices-action-creators');
var devicesStore = require('../stores/devices-store');

var ConfigureDevice = React.createClass({
    displayName: 'ConfigureDevice',

    getInitialState: function getInitialState() {
        return getStateFromStores(this.props.device);
    },
    componentDidMount: function componentDidMount() {
        devicesStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        devicesStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState(getStateFromStores(this.props.device));
    },
    _configureDevice: function _configureDevice(device) {
        devicesActionCreators.configureDevice(device);
    },
    _updateSetting: function _updateSetting(evt) {
        var newVal = evt.target.value;
        var key = evt.currentTarget.dataset.setting;

        var tmpState = JSON.parse(JSON.stringify(this.state));

        var newSettings = tmpState.settings.map(function (item) {
            if (item.key === key) {
                item.value = newVal;
            }

            return item;
        });

        this.setState({ settings: newSettings });
    },
    _updateRegistryPath: function _updateRegistryPath(evt) {
        this.setState({ registry_config: evt.target.value });
    },
    _uploadRegistryFile: function _uploadRegistryFile(evt) {

        var csvFile = evt.target.files[0];

        if (!csvFile) {
            return;
        }

        var fileName = evt.target.value;

        var reader = new FileReader();

        reader.onload = function (e) {

            var contents = e.target.result;

            var results = parseCsvFile(contents);

            if (results.errors.length) {
                var errorMsg = "The file wasn't in a valid CSV format.";

                modalActionCreators.openModal(React.createElement(ConfirmForm, {
                    promptTitle: 'Error Reading File',
                    promptText: errorMsg,
                    cancelText: 'OK'
                }));

                this.setState({ registry_config: this.state.registry_config });
            } else {
                if (results.warnings.length) {
                    var warningMsg = results.warnings.map(function (warning) {
                        return warning.message;
                    });

                    modalActionCreators.openModal(React.createElement(ConfirmForm, {
                        promptTitle: 'File Upload Notes',
                        promptText: warningMsg,
                        cancelText: 'OK'
                    }));
                }

                if (!results.meta.aborted) {
                    this.setState({ registry_config: fileName });
                    devicesActionCreators.loadRegistry(this.props.device, results.data, fileName);
                }
            }
        }.bind(this);

        reader.readAsText(csvFile);
    },
    _generateRegistryFile: function _generateRegistryFile() {
        devicesActionCreators.generateRegistry(this.props.device);
    },
    _editRegistryFile: function _editRegistryFile() {
        devicesActionCreators.editRegistry(this.props.device);
    },
    render: function render() {

        var attributeRows = this.props.device.map(function (device) {

            return React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    null,
                    device.label
                ),
                React.createElement(
                    'td',
                    { className: 'plain' },
                    device.value
                )
            );
        });

        var tableStyle = {
            backgroundColor: "#E7E7E7"
        };

        var uneditableAttributes = React.createElement(
            'table',
            { style: tableStyle },
            React.createElement(
                'tbody',
                null,
                attributeRows,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        'Proxy Address'
                    ),
                    React.createElement(
                        'td',
                        { className: 'plain' },
                        '10.0.2.15'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        'Network Interface'
                    ),
                    React.createElement(
                        'td',
                        { className: 'plain' },
                        'UDP/IP'
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        'Campus'
                    ),
                    React.createElement(
                        'td',
                        { className: 'plain' },
                        'PNNL'
                    )
                )
            )
        );

        var buttonStyle = {
            height: "24px",
            width: "66px",
            lineHeight: "18px"
        };

        var firstStyle = {
            width: "30%",
            textAlign: "right"
        };

        var secondStyle = {
            width: "50%"
        };

        var buttonColumns = {
            width: "8%"
        };

        var settingsRows = this.state.settings.map(function (setting) {

            var stateSetting = this.state.settings.find(function (s) {
                return s.key === setting.key;
            });

            return React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    { style: firstStyle },
                    setting.label
                ),
                React.createElement(
                    'td',
                    { style: secondStyle,
                        className: 'plain' },
                    React.createElement('input', {
                        className: 'form__control form__control--block',
                        type: 'text',
                        'data-setting': setting.key,
                        onChange: this._updateSetting,
                        value: stateSetting.value
                    })
                )
            );
        }, this);

        var editButton = this.state.registry_saved ? React.createElement(
            'td',
            {
                style: buttonColumns,
                className: 'plain' },
            React.createElement(
                'button',
                {
                    style: buttonStyle, onClick: this._editRegistryFile },
                'Edit'
            )
        ) : React.createElement('td', { className: 'plain' });

        var registryConfigRow = React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                { style: firstStyle },
                'Registry Configuration File'
            ),
            React.createElement(
                'td',
                {
                    style: secondStyle,
                    className: 'plain' },
                React.createElement('input', {
                    className: 'form__control form__control--block',
                    type: 'text',
                    onChange: this._updateRegistryPath,
                    value: this.state.registry_config
                })
            ),
            React.createElement(
                'td',
                {
                    style: buttonColumns,
                    className: 'plain' },
                React.createElement(
                    'div',
                    { className: 'buttonWrapper' },
                    React.createElement(
                        'div',
                        null,
                        'Upload'
                    ),
                    React.createElement('input', {
                        className: 'uploadButton',
                        type: 'file',
                        onChange: this._uploadRegistryFile })
                )
            ),
            editButton,
            React.createElement(
                'td',
                {
                    style: buttonColumns,
                    className: 'plain' },
                React.createElement(
                    'button',
                    {
                        style: buttonStyle, onClick: this._generateRegistryFile },
                    'Generate'
                )
            )
        );

        var editableAttributes = React.createElement(
            'table',
            null,
            React.createElement(
                'tbody',
                null,
                settingsRows,
                registryConfigRow
            )
        );

        var boxPadding = this.state.registry_saved ? "60px" : "60px 100px";

        var configDeviceBox = {
            padding: boxPadding,
            marginTop: "20px",
            marginBottom: "20px",
            border: "1px solid black"
        };

        return React.createElement(
            'div',
            { className: 'configDeviceContainer' },
            React.createElement(
                'div',
                { className: 'uneditableAttributes' },
                uneditableAttributes
            ),
            React.createElement(
                'div',
                { style: configDeviceBox },
                editableAttributes
            )
        );
    }
});

function getStateFromStores(device) {

    var registryFile = devicesStore.getRegistryFile(device);

    return {
        settings: [{ key: "unit", value: "", label: "Unit" }, { key: "building", value: "", label: "Building" }, { key: "path", value: "", label: "Path" }, { key: "interval", value: "", label: "Interval" }, { key: "timezone", value: "", label: "Timezone" }, { key: "heartbeat_point", value: "", label: "Heartbeat Point" }, { key: "minimum_priority", value: "", label: "Minimum Priority" }, { key: "max_objs_per_read", value: "", label: "Maximum Objects per Read" }],
        registry_config: registryFile,
        registry_saved: registryFile ? true : false
    };
}

function parseCsvFile(contents) {

    var results = CsvParse.parse(contents);

    var registryValues = [];

    var header = [];

    var data = results.data;

    results.warnings = [];

    if (data.length) {
        header = data.slice(0, 1);
    }

    var template = [];

    if (header[0].length) {
        header[0].forEach(function (column) {
            template.push({ "key": column.replace(/ /g, "_"), "value": null, "label": column });
        });

        var templateLength = template.length;

        if (data.length > 1) {
            var rows = data.slice(1);

            var rowsCount = rows.length;

            rows.forEach(function (r, num) {

                if (r.length !== templateLength && num !== rowsCount - 1) {
                    results.warnings.push({ message: "Row " + num + " was omitted for having the wrong number of columns." });
                } else {
                    var newTemplate = JSON.parse(JSON.stringify(template));

                    var newRow = [];

                    r.forEach(function (value, i) {
                        newTemplate[i].value = value;

                        newRow.push(newTemplate[i]);
                    });

                    registryValues.push(newRow);
                }
            });
        } else {
            registryValues = template;
        }
    }

    results.data = registryValues;

    return results;
}

module.exports = ConfigureDevice;

},{"../action-creators/devices-action-creators":4,"../action-creators/modal-action-creators":5,"../stores/devices-store":59,"./confirm-form":18,"babyparse":undefined,"react":undefined,"react-router":undefined}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _devicesFound = require('./devices-found');

var _devicesFound2 = _interopRequireDefault(_devicesFound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var platformsStore = require('../stores/platforms-store');
var devicesStore = require('../stores/devices-store');
var devicesActionCreators = require('../action-creators/devices-action-creators');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');

var scanDuration = 10000; // 10 seconds


var ConfigureDevices = function (_BaseComponent) {
    _inherits(ConfigureDevices, _BaseComponent);

    function ConfigureDevices(props) {
        _classCallCheck(this, ConfigureDevices);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConfigureDevices).call(this, props));

        _this._bind('_onPlatformStoresChange', '_onDevicesStoresChange', '_onDeviceMethodChange', '_onProxySelect', '_onDeviceStart', '_onDeviceEnd', '_onAddress', '_onStartScan', '_onDeviceStart', '_onDeviceEnd', '_onAddress', '_showCancel', '_resumeScan', '_cancelScan', '_onDevicesLoaded', 'componentWillUnmount');

        _this.state = getInitialState();
        return _this;
    }

    _createClass(ConfigureDevices, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            platformsStore.addChangeListener(this._onPlatformStoresChange);
            devicesStore.addChangeListener(this._onDevicesStoresChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            platformsStore.removeChangeListener(this._onPlatformStoresChange);
            devicesStore.removeChangeListener(this._onDevicesStoresChange);

            if (this._scanTimeout) {
                clearTimeout(this._scanTimeout);
            }
        }
    }, {
        key: '_onPlatformStoresChange',
        value: function _onPlatformStoresChange() {

            if (this.state.platform) {
                var bacnetProxies = platformsStore.getRunningBacnetProxies(this.state.platform.uuid);

                this.setState({ bacnetProxies: bacnetProxies });

                if (bacnetProxies.length < 1 && this.state.deviceMethod === "scanForDevices") {
                    this.setState({ deviceMethod: "addDevicesManually" });
                }
            }
        }
    }, {
        key: '_onDevicesStoresChange',
        value: function _onDevicesStoresChange() {

            if (devicesStore.getNewScan()) {
                this.setState(getInitialState());

                if (this._scanTimeout) {
                    clearTimeout(this._scanTimeout);
                }
            }
        }
    }, {
        key: '_onDeviceMethodChange',
        value: function _onDeviceMethodChange(evt) {

            var deviceMethod = evt.target.value;

            if (this.state.bacnetProxies.length) {
                this.setState({ deviceMethod: deviceMethod });
            } else {
                statusIndicatorActionCreators.openStatusIndicator("error", "Can't scan for devices: A BACNet proxy agent for the platform must be installed and running.", null, "left");
            }
        }
    }, {
        key: '_onProxySelect',
        value: function _onProxySelect(evt) {
            var selectedProxyUuid = evt.target.value;
            this.setState({ selectedProxyUuid: selectedProxyUuid });
        }
    }, {
        key: '_onDeviceStart',
        value: function _onDeviceStart(evt) {
            this.setState({ deviceStart: evt.target.value });
        }
    }, {
        key: '_onDeviceEnd',
        value: function _onDeviceEnd(evt) {
            this.setState({ deviceEnd: evt.target.value });
        }
    }, {
        key: '_onAddress',
        value: function _onAddress(evt) {
            this.setState({ address: evt.target.value });
        }
    }, {
        key: '_onStartScan',
        value: function _onStartScan(evt) {
            devicesActionCreators.scanForDevices(this.state.platform.uuid, this.state.selectedProxyUuid, this.state.deviceStart, this.state.deviceEnd, this.state.address);

            this.setState({ scanning: true });
            this.setState({ scanStarted: true });
            this.setState({ canceled: false });

            if (this._scanTimeout) {
                clearTimeout(this._scanTimeout);
            }

            this._scanTimeout = setTimeout(this._cancelScan, scanDuration);
        }
    }, {
        key: '_onDevicesLoaded',
        value: function _onDevicesLoaded(devicesLoaded) {
            this.setState({ devicesLoaded: devicesLoaded });
        }
    }, {
        key: '_showCancel',
        value: function _showCancel() {

            if (this.state.scanning) {
                this.setState({ cancelButton: true });
            }
        }
    }, {
        key: '_resumeScan',
        value: function _resumeScan() {

            if (this.state.scanning) {
                this.setState({ cancelButton: false });
            }
        }
    }, {
        key: '_cancelScan',
        value: function _cancelScan() {
            this.setState({ scanning: false });
            this.setState({ canceled: true });
        }
    }, {
        key: 'render',
        value: function render() {

            var deviceContent, defaultMessage;

            if (this.state.platform) {

                var platform = this.state.platform;

                var methodSelect = _react2.default.createElement(
                    'select',
                    {
                        onChange: this._onDeviceMethodChange,
                        value: this.state.deviceMethod,
                        autoFocus: true,
                        required: true
                    },
                    _react2.default.createElement(
                        'option',
                        { value: 'scanForDevices' },
                        'Scan for Devices'
                    ),
                    _react2.default.createElement(
                        'option',
                        { value: 'addDevicesManually' },
                        'Add Manually'
                    )
                );

                var proxySelect;

                var wideStyle = {
                    width: "100%"
                };

                var fifthCell = {
                    width: "20px"
                };

                if (this.state.deviceMethod === "scanForDevices") {
                    var proxies = this.state.bacnetProxies.map(function (proxy) {
                        return _react2.default.createElement(
                            'option',
                            { key: proxy.uuid, value: proxy.uuid },
                            proxy.name
                        );
                    });

                    proxySelect = _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement(
                            'td',
                            { className: 'plain' },
                            _react2.default.createElement(
                                'b',
                                null,
                                'BACNet Proxy Agent: '
                            )
                        ),
                        _react2.default.createElement(
                            'td',
                            { className: 'plain',
                                colSpan: 4 },
                            _react2.default.createElement(
                                'select',
                                {
                                    style: wideStyle,
                                    onChange: this._onProxySelect,
                                    value: this.state.selectedProxyUuid,
                                    autoFocus: true,
                                    required: true
                                },
                                proxies
                            )
                        ),
                        _react2.default.createElement('td', { className: 'plain', style: fifthCell })
                    );
                }

                var buttonStyle = {
                    height: "21px"
                };

                var platformNameLength = platform.name.length * 6;

                var platformNameStyle = {
                    width: "25%",
                    minWidth: platformNameLength
                };

                var deviceRangeStyle = {
                    width: "70px"
                };

                var tdStyle = {
                    minWidth: "120px"
                };

                var scanOptions = _react2.default.createElement(
                    'div',
                    { className: 'detectDevicesContainer' },
                    _react2.default.createElement(
                        'div',
                        { className: 'detectDevicesBox' },
                        _react2.default.createElement(
                            'table',
                            null,
                            _react2.default.createElement(
                                'tbody',
                                null,
                                proxySelect,
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain', style: tdStyle },
                                        _react2.default.createElement(
                                            'b',
                                            null,
                                            'Device ID Range'
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain' },
                                        'Start:'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain' },
                                        _react2.default.createElement('input', {
                                            type: 'number',
                                            style: deviceRangeStyle,
                                            onChange: this._onDeviceStart,
                                            value: this.state.deviceStart })
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain' },
                                        'End:'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain' },
                                        _react2.default.createElement('input', {
                                            type: 'number',
                                            style: deviceRangeStyle,
                                            onChange: this._onDeviceEnd,
                                            value: this.state.deviceEnd })
                                    ),
                                    _react2.default.createElement('td', { className: 'plain' })
                                ),
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        _react2.default.createElement(
                                            'b',
                                            null,
                                            'Address'
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        { className: 'plain',
                                            colSpan: 4 },
                                        _react2.default.createElement('input', {
                                            style: wideStyle,
                                            type: 'text',
                                            onChange: this._onAddress,
                                            value: this.state.address })
                                    ),
                                    _react2.default.createElement('td', { className: 'plain', style: fifthCell })
                                )
                            )
                        )
                    )
                );

                var scanOptionsStyle = {
                    float: "left",
                    marginRight: "10px"
                };

                var platformNameStyle = {
                    float: "left",
                    width: "100%"
                };

                var devicesContainer;
                var scanButton;

                if (this.state.scanning) {
                    var spinnerContent;

                    if (this.state.cancelButton) {
                        spinnerContent = _react2.default.createElement(
                            'span',
                            { className: 'cancelScanning' },
                            _react2.default.createElement('i', { className: 'fa fa-remove' })
                        );
                    } else {
                        spinnerContent = _react2.default.createElement('i', { className: 'fa fa-cog fa-spin fa-2x fa-fw margin-bottom' });
                    }

                    scanButton = _react2.default.createElement(
                        'div',
                        { style: scanOptionsStyle },
                        _react2.default.createElement(
                            'div',
                            { className: 'scanningSpinner',
                                onClick: this._cancelScan,
                                onMouseEnter: this._showCancel,
                                onMouseLeave: this._resumeScan },
                            spinnerContent
                        )
                    );
                } else {
                    scanButton = _react2.default.createElement(
                        'div',
                        { style: scanOptionsStyle },
                        _react2.default.createElement(
                            'button',
                            { style: buttonStyle, onClick: this._onStartScan },
                            'Go'
                        )
                    );
                }

                if (this.state.devicesLoaded || this.state.scanStarted) {
                    devicesContainer = _react2.default.createElement(_devicesFound2.default, {
                        devicesloaded: this._onDevicesLoaded,
                        platform: this.state.platform,
                        canceled: this.state.canceled,
                        bacnet: this.state.selectedProxyUuid });
                }

                deviceContent = _react2.default.createElement(
                    'div',
                    { className: 'device-box device-scan' },
                    _react2.default.createElement(
                        'div',
                        { style: platformNameStyle },
                        _react2.default.createElement(
                            'div',
                            { style: scanOptionsStyle },
                            _react2.default.createElement(
                                'b',
                                null,
                                'Instance: '
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: scanOptionsStyle },
                            platform.name
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: scanOptionsStyle },
                        _react2.default.createElement(
                            'b',
                            null,
                            'Method: '
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: scanOptionsStyle },
                        methodSelect
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: scanOptionsStyle },
                        scanOptions
                    ),
                    scanButton
                );
            } else {
                defaultMessage = _react2.default.createElement(
                    'div',
                    null,
                    'Launch device installation from the side tree by clicking on the ',
                    _react2.default.createElement('i', { className: 'fa fa-cogs' }),
                    ' button next to the platform instance.'
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'view' },
                _react2.default.createElement(
                    'h2',
                    null,
                    'Install Devices'
                ),
                deviceContent,
                defaultMessage,
                _react2.default.createElement(
                    'div',
                    { className: 'device-box device-container' },
                    devicesContainer
                )
            );
        }
    }]);

    return ConfigureDevices;
}(_baseComponent2.default);

;

function getInitialState() {

    var state = devicesStore.getState();

    if (state.platform) {
        state.bacnetProxies = platformsStore.getRunningBacnetProxies(state.platform.uuid);
        state.deviceMethod = state.bacnetProxies.length ? "scanForDevices" : "addDevicesManually";

        state.deviceStart = "";
        state.deviceEnd = "";
        state.address = "";

        state.newScan = true;

        if (state.deviceMethod === "scanForDevices") {
            state.selectedProxyUuid = state.bacnetProxies[0].uuid;
        }

        state.scanning = false;
        state.canceled = false;
        state.devicesLoaded = false;
        state.scanStarted = false;
        state.cancelButton = false;
    }

    return state;
}

exports.default = ConfigureDevices;

},{"../action-creators/devices-action-creators":4,"../action-creators/status-indicator-action-creators":10,"../stores/devices-store":59,"../stores/platforms-store":64,"./base-component":12,"./devices-found":29,"react":undefined}],17:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var devicesActionCreators = require('../action-creators/devices-action-creators');
var devicesStore = require('../stores/devices-store');
var FilterPointsButton = require('./control_buttons/filter-points-button');
var ControlButton = require('./control-button');
var CogButton = require('./control_buttons/cog-select-button');
var EditColumnButton = require('./control_buttons/edit-columns-button');

var ConfirmForm = require('./confirm-form');
var modalActionCreators = require('../action-creators/modal-action-creators');

var ConfigureRegistry = React.createClass({
    displayName: 'ConfigureRegistry',

    getInitialState: function getInitialState() {
        var state = {};

        state.registryValues = getPointsFromStore(this.props.device);
        state.registryHeader = [];
        state.columnNames = [];
        state.pointNames = [];

        if (state.registryValues.length > 0) {
            state.registryHeader = getRegistryHeader(state.registryValues[0]);
            state.columnNames = state.registryValues[0].map(function (columns) {
                return columns.key;
            });

            state.pointNames = state.registryValues.map(function (points) {
                return points[0].value;
            });
        }

        state.pointsToDelete = [];
        state.allSelected = false;

        state.selectedCells = [];
        state.selectedCellRow = null;
        state.selectedCellColumn = null;

        this.scrollToBottom = false;
        this.resizeTable = false;

        return state;
    },
    componentDidMount: function componentDidMount() {
        // platformsStore.addChangeListener(this._onStoresChange);

        this.containerDiv = document.getElementsByClassName("fixed-table-container-inner")[0];
        this.fixedHeader = document.getElementsByClassName("header-background")[0];
        this.fixedInner = document.getElementsByClassName("fixed-table-container-inner")[0];
        this.registryTable = document.getElementsByClassName("registryConfigTable")[0];
    },
    componentWillUnmount: function componentWillUnmount() {
        // platformsStore.removeChangeListener(this._onStoresChange);
    },
    componentDidUpdate: function componentDidUpdate() {

        if (this.scrollToBottom) {
            this.containerDiv.scrollTop = this.containerDiv.scrollHeight;

            this.scrollToBottom = false;
        }

        if (this.resizeTable) {
            this.fixedHeader.style.width = this.registryTable.clientWidth + "px";
            this.fixedInner.style.width = this.registryTable.clientWidth + "px";

            this.resizeTable = false;
        }

        if (this.state.selectedCellRow) {
            var focusedCell = document.getElementsByClassName("focusedCell")[0];
            if (focusedCell) {
                focusedCell.focus();
            }
        }
    },
    _onStoresChange: function _onStoresChange() {
        this.setState({ registryValues: getPointsFromStore(this.props.device) });
    },
    _onFilterBoxChange: function _onFilterBoxChange(filterValue) {
        this.setState({ registryValues: getFilteredPoints(this.props.device, filterValue) });
    },
    _onClearFilter: function _onClearFilter() {
        this.setState({ registryValues: getPointsFromStore(this.props.device) }); //TODO: when filtering, set nonmatches to hidden so they're
        //still there and we don't lose information in inputs
        //then to clear filter, set all to not hidden
    },
    _onAddPoint: function _onAddPoint() {

        var pointNames = this.state.pointNames;

        pointNames.push("");

        this.setState({ pointNames: pointNames });

        var registryValues = this.state.registryValues;

        var pointValues = [];

        this.state.columnNames.map(function (column) {
            pointValues.push({ "key": column, "value": "", "editable": true });
        });

        registryValues.push(pointValues);

        this.setState({ registryValues: registryValues });

        this.scrollToBottom = true;
    },
    _onRemovePoints: function _onRemovePoints() {

        var promptText, confirmText, confirmAction, cancelText;

        if (this.state.pointsToDelete.length > 0) {
            promptText = "Are you sure you want to delete these points? " + this.state.pointsToDelete.join(", ");
            confirmText = "Delete";
            confirmAction = this._removePoints.bind(this, this.state.pointsToDelete);
        } else {
            promptText = "Select points to delete.";
            cancelText = "OK";
        }

        modalActionCreators.openModal(React.createElement(ConfirmForm, {
            promptTitle: 'Remove Points',
            promptText: promptText,
            confirmText: confirmText,
            onConfirm: confirmAction,
            cancelText: cancelText
        }));
    },
    _removePoints: function _removePoints(pointsToDelete) {
        console.log("removing " + pointsToDelete.join(", "));

        var registryValues = this.state.registryValues.slice();
        var pointsList = this.state.pointsToDelete.slice();
        var namesList = this.state.pointNames.slice();

        pointsToDelete.forEach(function (pointToDelete) {

            var index = -1;
            var pointValue = "";

            registryValues.some(function (vals, i) {
                var pointMatched = vals[0].value === pointToDelete;

                if (pointMatched) {
                    index = i;
                    pointValue = vals[0].value;
                }

                return pointMatched;
            });

            if (index > -1) {
                registryValues.splice(index, 1);

                index = pointsList.indexOf(pointValue);

                if (index > -1) {
                    pointsList.splice(index, 1);
                }

                index = namesList.indexOf(pointValue);

                if (index > -1) {
                    namesList.splice(index, 1);
                }
            }
        });

        this.setState({ registryValues: registryValues });
        this.setState({ pointsToDelete: pointsList });
        this.setState({ pointNames: namesList });

        modalActionCreators.closeModal();
    },
    _selectForDelete: function _selectForDelete(attributesList) {

        var pointsToDelete = this.state.pointsToDelete;

        var index = pointsToDelete.indexOf(attributesList[0].value);

        if (index < 0) {
            pointsToDelete.push(attributesList[0].value);
        } else {
            pointsToDelete.splice(index, 1);
        }

        this.setState({ pointsToDelete: pointsToDelete });
    },
    _selectAll: function _selectAll() {
        var allSelected = !this.state.allSelected;

        this.setState({ allSelected: allSelected });

        this.setState({ pointsToDelete: allSelected ? this.state.pointNames.slice() : [] });
    },
    _onAddColumn: function _onAddColumn(columnFrom) {

        console.log(columnFrom);

        var registryHeader = this.state.registryHeader.slice();
        var registryValues = this.state.registryValues.slice();
        var columnNames = this.state.columnNames.slice();

        var index = registryHeader.indexOf(columnFrom);

        if (index > -1) {
            registryHeader.splice(index + 1, 0, registryHeader[index] + "2");

            this.setState({ registryHeader: registryHeader });

            columnNames.splice(index + 1, 0, columnFrom + "2");

            this.setState({ columnNames: columnNames });

            var newRegistryValues = registryValues.map(function (values) {

                values.splice(index + 1, 0, { "key": columnFrom.replace(/ /g, "_") + "2", "value": "" });
                var newValues = values;

                return newValues;
            });

            this.resizeTable = true;

            this.setState({ registryValues: newRegistryValues });
        }
    },
    _onCloneColumn: function _onCloneColumn(index) {

        var registryHeader = this.state.registryHeader.slice();
        var registryValues = this.state.registryValues.slice();
        var columnNames = this.state.columnNames.slice();

        registryHeader.splice(index + 1, 0, registryHeader[index]);

        this.setState({ registryHeader: registryHeader });

        columnNames.splice(index + 1, 0, registryHeader[index]);

        this.setState({ columnNames: columnNames });

        var newRegistryValues = registryValues.map(function (values, row) {

            var clonedValue = {};

            for (var key in values[index]) {
                clonedValue[key] = values[index][key];
            }

            values.splice(index + 1, 0, clonedValue);

            return values;
        });

        this.resizeTable = true;

        this.setState({ registryValues: newRegistryValues });
    },
    _onRemoveColumn: function _onRemoveColumn(column) {

        var promptText = "Are you sure you want to delete the column, " + column + "?";

        modalActionCreators.openModal(React.createElement(ConfirmForm, {
            promptTitle: 'Remove Column',
            promptText: promptText,
            confirmText: 'Delete',
            onConfirm: this._removeColumn.bind(this, column)
        }));
    },
    _removeColumn: function _removeColumn(columnToDelete) {
        console.log("deleting " + columnToDelete);

        var registryHeader = this.state.registryHeader.slice();
        var registryValues = this.state.registryValues.slice();
        var columnNames = this.state.columnNames.slice();

        var index = columnNames.indexOf(columnToDelete.replace(/ /g, "_"));

        if (index > -1) {
            columnNames.splice(index, 1);
        }

        index = registryHeader.indexOf(columnToDelete);

        if (index > -1) {
            registryHeader.splice(index, 1);

            registryValues.forEach(function (values) {

                var itemFound = values.find(function (item, i) {

                    var matched = item.key === columnToDelete.replace(/ /g, "_");

                    if (matched) {
                        index = i;
                    }

                    return matched;
                });

                if (itemFound) {
                    values.splice(index, 1);
                }
            });

            this.resizeTable = true;

            this.setState({ columnNames: columnNames });
            this.setState({ registryValues: registryValues });
            this.setState({ registryHeader: registryHeader });

            modalActionCreators.closeModal();
        }
    },
    _updateCell: function _updateCell(row, column, e) {

        var currentTarget = e.currentTarget;
        var newRegistryValues = this.state.registryValues.slice();

        newRegistryValues[row][column].value = currentTarget.value;

        this.setState({ registryValues: newRegistryValues });
    },
    _onFindNext: function _onFindNext(findValue, column) {

        var registryValues = this.state.registryValues.slice();

        if (this.state.selectedCells.length === 0) {
            var selectedCells = [];

            this.setState({ registryValues: registryValues.map(function (values, row) {

                    //searching i-th column in each row, and if the cell contains the target value, select it
                    values[column].selected = values[column].value.indexOf(findValue) > -1;

                    if (values[column].selected) {
                        selectedCells.push(row);
                    }

                    return values;
                })
            });

            if (selectedCells.length > 0) {
                this.setState({ selectedCells: selectedCells });
                this.setState({ selectedCellColumn: column });

                //set focus to the first selected cell
                this.setState({ selectedCellRow: selectedCells[0] });
            }
        } else {
            //we've already found the selected cells, so we need to advance focus to the next one
            if (this.state.selectedCells.length > 1) {
                var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);

                this.setState({ selectedCellRow: selectedCellRow });
            }
        }
    },
    _onReplace: function _onReplace(findValue, replaceValue, column) {

        if (!this.state.selectedCellRow) {
            this._onFindNext(findValue, column);
        } else {
            var registryValues = this.state.registryValues.slice();
            registryValues[this.state.selectedCellRow][column].value = registryValues[this.state.selectedCellRow][column].value.replace(findValue, replaceValue);

            //If the cell no longer has the target value, deselect it and move focus to the next selected cell
            if (registryValues[this.state.selectedCellRow][column].value.indexOf(findValue) < 0) {
                registryValues[this.state.selectedCellRow][column].selected = false;

                //see if there will even be another selected cell to move to
                var selectedCells = this.state.selectedCells.slice();
                var index = selectedCells.indexOf(this.state.selectedCellRow);

                if (index > -1) {
                    selectedCells.splice(index, 1);
                }

                if (selectedCells.length > 0) {
                    var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);

                    this.setState({ selectedCellRow: selectedCellRow });
                    this.setState({ selectedCells: selectedCells });
                } else {
                    //there were no more selected cells, so clear everything out
                    this.setState({ selectedCells: [] });
                    this.setState({ selectedCellRow: null });
                    this.setState({ selectedCellColumn: null });
                }
            }

            this.setState({ registryValues: registryValues });
        }
    },
    _onReplaceAll: function _onReplaceAll(findValue, replaceValue, column) {

        if (!this.state.selectedCellRow) {
            this._onFindNext(findValue, column);
        } else {
            var registryValues = this.state.registryValues.slice();
            var selectedCells = this.state.selectedCells.slice();
            var selectedCellRow = this.state.selectedCellRow;

            while (selectedCells.length > 0) {
                registryValues[selectedCellRow][column].value = registryValues[this.state.selectedCellRow][column].value.replace(findValue, replaceValue);

                if (registryValues[selectedCellRow][column].value.indexOf(findValue) < 0) {
                    registryValues[selectedCellRow][column].selected = false;

                    var index = selectedCells.indexOf(selectedCellRow);

                    if (index > -1) {
                        selectedCells.splice(index, 1);
                    } else {
                        //something went wrong, so stop the while loop
                        break;
                    }

                    if (selectedCells.length > 0) {
                        selectedCellRow = this._goToNext(selectedCellRow, this.state.selectedCells);
                    }
                }
            }

            this.setState({ selectedCellRow: null });
            this.setState({ selectedCells: [] });
            this.setState({ selectedCellColumn: null });
            this.setState({ registryValues: registryValues });
        }
    },
    _onClearFind: function _onClearFind(column) {

        var registryValues = this.state.registryValues.slice();

        this.state.selectedCells.map(function (row) {
            registryValues[row][column].selected = false;
        });

        this.setState({ registryValues: registryValues });
        this.setState({ selectedCells: [] });
        this.setState({ selectedCellRow: null });
        this.setState({ selectedCellColumn: null });
    },
    _goToNext: function _goToNext(selectedCellRow, selectedCells) {

        //this is the row with current focus
        var rowIndex = selectedCells.indexOf(selectedCellRow);

        if (rowIndex > -1) {
            //either set focus to the next one in the selected cells list
            if (rowIndex < selectedCells.length - 1) {
                selectedCellRow = selectedCells[++rowIndex];
            } else //or if we're at the end of the list, go back to the first one
                {
                    selectedCellRow = selectedCells[0];
                }
        }

        return selectedCellRow;
    },
    _cancelRegistry: function _cancelRegistry() {
        devicesActionCreators.cancelRegistry(this.props.device);
    },
    _saveRegistry: function _saveRegistry() {
        devicesActionCreators.saveRegistry(this.props.device, this.state.registryValues);
    },
    render: function render() {

        var filterPointsTooltip = {
            content: "Filter Points",
            "x": 160,
            "y": 30
        };

        var filterButton = React.createElement(FilterPointsButton, {
            name: 'filterRegistryPoints',
            tooltipMsg: filterPointsTooltip,
            onfilter: this._onFilterBoxChange,
            onclear: this._onClearFilter });

        var addPointTooltip = {
            content: "Add New Point",
            "x": 160,
            "y": 30
        };

        var addPointButton = React.createElement(ControlButton, {
            name: 'addRegistryPoint',
            tooltip: addPointTooltip,
            controlclass: 'add_point_button',
            fontAwesomeIcon: 'plus',
            clickAction: this._onAddPoint });

        var removePointTooltip = {
            content: "Remove Points",
            "x": 160,
            "y": 30
        };

        var removePointsButton = React.createElement(ControlButton, {
            name: 'removeRegistryPoints',
            fontAwesomeIcon: 'minus',
            tooltip: removePointTooltip,
            controlclass: 'remove_point_button',
            clickAction: this._onRemovePoints });

        var registryRows, registryHeader;

        registryRows = this.state.registryValues.map(function (attributesList, rowIndex) {

            var registryCells = attributesList.map(function (item, columnIndex) {

                var selectedStyle = item.selected ? { backgroundColor: "#F5B49D" } : {};
                var focusedCell = this.state.selectedCellColumn === columnIndex && this.state.selectedCellRow === rowIndex ? "focusedCell" : "";

                var itemCell = columnIndex === 0 && !item.editable ? React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'label',
                        null,
                        item.value
                    )
                ) : React.createElement(
                    'td',
                    null,
                    React.createElement('input', {
                        id: this.state.registryValues[rowIndex][columnIndex].key + "-" + columnIndex + "-" + rowIndex,
                        type: 'text',
                        className: focusedCell,
                        style: selectedStyle,
                        onChange: this._updateCell.bind(this, rowIndex, columnIndex),
                        value: this.state.registryValues[rowIndex][columnIndex].value })
                );

                return itemCell;
            }, this);

            return React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    null,
                    React.createElement('input', { type: 'checkbox',
                        onChange: this._selectForDelete.bind(this, attributesList),
                        checked: this.state.pointsToDelete.indexOf(attributesList[0].value) > -1 })
                ),
                registryCells
            );
        }, this);

        var wideCell = {
            width: "100%"
        };

        registryHeader = this.state.registryHeader.map(function (item, index) {

            var cogButton = React.createElement(CogButton, {
                onremove: this._onRemoveColumn,
                onadd: this._onAddColumn,
                onclone: this._onCloneColumn,
                column: index,
                item: item });

            var editColumnButton = React.createElement(EditColumnButton, {
                column: index,
                tooltipMsg: 'Edit Column',
                findnext: this._onFindNext,
                replace: this._onReplace,
                replaceall: this._onReplaceAll,
                onfilter: this._onFilterBoxChange,
                onclear: this._onClearFind });

            var firstColumnWidth;

            if (index === 0) {
                firstColumnWidth = {
                    width: item.length * 10 + "px"
                };
            }

            var headerCell = index === 0 ? React.createElement(
                'th',
                { style: firstColumnWidth },
                React.createElement(
                    'div',
                    { className: 'th-inner' },
                    item,
                    ' ',
                    filterButton,
                    ' ',
                    addPointButton,
                    ' ',
                    removePointsButton
                )
            ) : React.createElement(
                'th',
                null,
                React.createElement(
                    'div',
                    { className: 'th-inner', style: wideCell },
                    item,
                    cogButton,
                    editColumnButton
                )
            );

            return headerCell;
        }, this);

        var wideDiv = {
            width: "100%",
            textAlign: "center",
            paddingTop: "20px"
        };

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'fixed-table-container' },
                React.createElement('div', { className: 'header-background' }),
                React.createElement(
                    'div',
                    { className: 'fixed-table-container-inner' },
                    React.createElement(
                        'table',
                        { className: 'registryConfigTable' },
                        React.createElement(
                            'thead',
                            null,
                            React.createElement(
                                'tr',
                                null,
                                React.createElement(
                                    'th',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'th-inner' },
                                        React.createElement('input', { type: 'checkbox',
                                            onChange: this._selectAll,
                                            checked: this.state.allSelected })
                                    )
                                ),
                                registryHeader
                            )
                        ),
                        React.createElement(
                            'tbody',
                            null,
                            registryRows
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { style: wideDiv },
                React.createElement(
                    'div',
                    { className: 'inlineBlock' },
                    React.createElement(
                        'button',
                        { onClick: this._cancelRegistry },
                        'Cancel'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'inlineBlock' },
                    React.createElement(
                        'button',
                        { onClick: this._saveRegistry },
                        'Save'
                    )
                )
            )
        );
    }
});

function getFilteredPoints(device, filterStr) {
    return devicesStore.getFilteredRegistryValues(device, filterStr);
}

function getPointsFromStore(device) {
    return devicesStore.getRegistryValues(device);
}

function getRegistryHeader(registryItem) {
    return registryItem.map(function (item) {
        return item.key.replace(/_/g, " ");
    });
}

module.exports = ConfigureRegistry;

},{"../action-creators/devices-action-creators":4,"../action-creators/modal-action-creators":5,"../stores/devices-store":59,"./confirm-form":18,"./control-button":20,"./control_buttons/cog-select-button":21,"./control_buttons/edit-columns-button":22,"./control_buttons/filter-points-button":23,"react":undefined,"react-router":undefined}],18:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');

var ConfirmForm = React.createClass({
    displayName: 'ConfirmForm',

    _onCancelClick: modalActionCreators.closeModal,
    _onSubmit: function _onSubmit(e) {
        e.preventDefault();
        this.props.onConfirm();
    },
    render: function render() {

        var promptText = this.props.promptText;

        if (this.props.hasOwnProperty("preText") && this.props.hasOwnProperty("postText")) {
            promptText = React.createElement(
                'b',
                null,
                promptText
            );
        }

        return React.createElement(
            'form',
            { className: 'confirmation-form', onSubmit: this._onSubmit },
            React.createElement(
                'h1',
                null,
                this.props.promptTitle
            ),
            React.createElement(
                'p',
                null,
                this.props.preText,
                promptText,
                this.props.postText
            ),
            React.createElement(
                'div',
                { className: 'form__actions' },
                React.createElement(
                    'button',
                    {
                        className: 'button button--secondary',
                        type: 'button',
                        onClick: this._onCancelClick,
                        autoFocus: true
                    },
                    'Cancel'
                ),
                React.createElement(
                    'button',
                    { className: 'button' },
                    this.props.confirmText
                )
            )
        );
    }
});

module.exports = ConfirmForm;

},{"../action-creators/modal-action-creators":5,"react":undefined}],19:[function(require,module,exports){
'use strict';

var React = require('react');

var Composer = require('./composer');
var Conversation = require('./conversation');

var Console = React.createClass({
    displayName: 'Console',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'console' },
            React.createElement(Conversation, null),
            React.createElement(Composer, null)
        );
    }
});

module.exports = Console;

},{"./composer":14,"./conversation":24,"react":undefined}],20:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');
var controlButtonStore = require('../stores/control-button-store');
var controlButtonActionCreators = require('../action-creators/control-button-action-creators');
var OutsideClick = require('react-click-outside');

var ControlButton = React.createClass({
    displayName: 'ControlButton',

    getInitialState: function getInitialState() {
        var state = {};

        state.showTaptip = false;
        state.showTooltip = false;
        state.deactivateTooltip = false;

        state.selected = this.props.selected === true;

        state.taptipX = 0;
        state.taptipY = 0;
        state.tooltipX = 0;
        state.tooltipY = 0;

        state.tooltipOffsetX = 0;
        state.tooltipOffsetY = 0;
        state.taptipOffsetX = 0;
        state.taptipOffsetY = 0;

        if (this.props.hasOwnProperty("tooltip")) {
            if (this.props.tooltip.hasOwnProperty("x")) state.tooltipX = this.props.tooltip.x;

            if (this.props.tooltip.hasOwnProperty("y")) state.tooltipY = this.props.tooltip.y;

            if (this.props.tooltip.hasOwnProperty("xOffset")) state.tooltipOffsetX = this.props.tooltip.xOffset;

            if (this.props.tooltip.hasOwnProperty("yOffset")) state.tooltipOffsetY = this.props.tooltip.yOffset;
        }

        if (this.props.hasOwnProperty("taptip")) {
            if (this.props.taptip.hasOwnProperty("x")) state.taptipX = this.props.taptip.x;

            if (this.props.taptip.hasOwnProperty("y")) state.taptipY = this.props.taptip.y;

            if (this.props.taptip.hasOwnProperty("xOffset")) state.taptipOffsetX = this.props.taptip.xOffset;

            if (this.props.taptip.hasOwnProperty("yOffset")) state.taptipOffsetY = this.props.taptip.yOffset;
        }

        return state;
    },
    componentDidMount: function componentDidMount() {
        controlButtonStore.addChangeListener(this._onStoresChange);

        window.addEventListener('keydown', this._hideTaptip);
    },
    componentWillUnmount: function componentWillUnmount() {
        controlButtonStore.removeChangeListener(this._onStoresChange);

        window.removeEventListener('keydown', this._hideTaptip);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected === true });

        if (nextProps.selected === true) {
            this.setState({ showTooltip: false });
        }
    },
    _onStoresChange: function _onStoresChange() {

        var showTaptip = controlButtonStore.getTaptip(this.props.name);

        if (showTaptip !== null) {
            if (showTaptip !== this.state.showTaptip) {
                this.setState({ showTaptip: showTaptip });
            }

            this.setState({ selected: showTaptip === true });

            if (showTaptip === true) {
                this.setState({ showTooltip: false });
            } else {
                if (typeof this.props.closeAction == 'function') {
                    this.props.closeAction();
                }
            }
        }
    },
    handleClickOutside: function handleClickOutside() {
        if (this.state.showTaptip) {
            controlButtonActionCreators.hideTaptip(this.props.name);
        }
    },
    _showTaptip: function _showTaptip(evt) {

        if (!this.state.showTaptip) {
            if (!(this.props.taptip.hasOwnProperty("x") && this.props.taptip.hasOwnProperty("y"))) {
                this.setState({ taptipX: evt.clientX - this.state.taptipOffsetX });
                this.setState({ taptipY: evt.clientY - this.state.taptipOffsetY });
            }
        }

        controlButtonActionCreators.toggleTaptip(this.props.name);
    },
    _hideTaptip: function _hideTaptip(evt) {
        if (evt.keyCode === 27) {
            controlButtonActionCreators.hideTaptip(this.props.name);
        }
    },
    _showTooltip: function _showTooltip(evt) {
        this.setState({ showTooltip: true });

        if (!(this.props.tooltip.hasOwnProperty("x") && this.props.tooltip.hasOwnProperty("y"))) {
            this.setState({ tooltipX: evt.clientX - this.state.tooltipOffsetX });
            this.setState({ tooltipY: evt.clientY - this.state.tooltipOffsetY });
        }
    },
    _hideTooltip: function _hideTooltip() {
        this.setState({ showTooltip: false });
    },
    render: function render() {

        var taptip;
        var tooltip;
        var clickAction;
        var selectedStyle;

        var tooltipShow;
        var tooltipHide;

        var buttonIcon = this.props.icon ? this.props.icon : this.props.fontAwesomeIcon ? React.createElement('i', { className: "fa fa-" + this.props.fontAwesomeIcon }) : React.createElement(
            'div',
            { className: this.props.buttonClass },
            React.createElement(
                'span',
                null,
                this.props.unicodeIcon
            )
        );

        if (this.props.staySelected || this.state.selected === true || this.state.showTaptip === true) {
            selectedStyle = {
                backgroundColor: "#ccc"
            };
        } else if (this.props.tooltip) {
            var tooltipStyle = {
                display: this.state.showTooltip ? "block" : "none",
                position: "absolute",
                top: this.state.tooltipY + "px",
                left: this.state.tooltipX + "px"
            };

            var toolTipClasses = this.state.showTooltip ? "tooltip_outer delayed-show-slow" : "tooltip_outer";

            tooltipShow = this._showTooltip;
            tooltipHide = this._hideTooltip;

            tooltip = React.createElement(
                'div',
                { className: toolTipClasses,
                    style: tooltipStyle },
                React.createElement(
                    'div',
                    { className: 'tooltip_inner' },
                    React.createElement(
                        'div',
                        { className: 'opaque_inner' },
                        this.props.tooltip.content
                    )
                )
            );
        }

        if (this.props.taptip) {
            var taptipStyle = {
                display: this.state.showTaptip ? "block" : "none",
                position: "absolute",
                left: this.state.taptipX + "px",
                top: this.state.taptipY + "px"
            };

            if (this.props.taptip.styles) {
                this.props.taptip.styles.forEach(function (styleToAdd) {
                    taptipStyle[styleToAdd.key] = styleToAdd.value;
                });
            }

            var tapTipClasses = "taptip_outer";

            var taptipBreak = this.props.taptip.hasOwnProperty("break") ? this.props.taptip.break : React.createElement('br', null);
            var taptipTitle = this.props.taptip.hasOwnProperty("title") ? React.createElement(
                'h4',
                null,
                this.props.taptip.title
            ) : "";

            var innerStyle = {};

            if (this.props.taptip.hasOwnProperty("padding")) {
                innerStyle = {
                    padding: this.props.taptip.padding
                };
            }

            taptip = React.createElement(
                'div',
                { className: tapTipClasses,
                    style: taptipStyle },
                React.createElement(
                    'div',
                    { className: 'taptip_inner',
                        style: innerStyle },
                    React.createElement(
                        'div',
                        { className: 'opaque_inner' },
                        taptipTitle,
                        taptipBreak,
                        this.props.taptip.content
                    )
                )
            );

            clickAction = this.props.taptip.action ? this.props.taptip.action : this._showTaptip;
        } else if (this.props.clickAction) {
            clickAction = this.props.clickAction;
        }

        var controlButtonClass = this.props.controlclass ? this.props.controlclass : "control_button";

        var centering = this.props.hasOwnProperty("nocentering") && this.props.nocentering === true ? "" : "centeredDiv";

        var outerClasses = this.props.hasOwnProperty("floatleft") && this.props.floatleft === true ? "floatLeft" : "inlineBlock";

        return React.createElement(
            'div',
            { className: outerClasses },
            taptip,
            tooltip,
            React.createElement(
                'div',
                { className: controlButtonClass,
                    onClick: clickAction,
                    onMouseEnter: tooltipShow,
                    onMouseLeave: tooltipHide,
                    style: selectedStyle },
                React.createElement(
                    'div',
                    { className: centering },
                    buttonIcon
                )
            )
        );
    }
});

module.exports = OutsideClick(ControlButton);

},{"../action-creators/control-button-action-creators":3,"../stores/control-button-store":58,"react":undefined,"react-click-outside":undefined,"react-router":undefined}],21:[function(require,module,exports){
'use strict';

var React = require('react');

var ControlButton = require('../control-button');
var EditColumnButton = require('./edit-columns-button');
var controlButtonActionCreators = require('../../action-creators/control-button-action-creators');
// var controlButtonStore = require('../../stores/control-button-store');

var CogButton = React.createClass({
    displayName: 'CogButton',

    componentDidMount: function componentDidMount() {
        // this.opSelector = document.getElementsByClassName("opSelector")[0];
        // this.opSelector.selectedIndex = -1;
    },
    componentDidUpdate: function componentDidUpdate() {},
    _onClose: function _onClose() {},
    _onCloneColumn: function _onCloneColumn() {
        this.props.onclone(this.props.column);
        controlButtonActionCreators.hideTaptip("cogControlButton" + this.props.column);
    },
    _onAddColumn: function _onAddColumn() {
        this.props.onadd(this.props.item);
        controlButtonActionCreators.hideTaptip("cogControlButton" + this.props.column);
    },
    _onRemoveColumn: function _onRemoveColumn() {
        this.props.onremove(this.props.item);
        controlButtonActionCreators.hideTaptip("cogControlButton" + this.props.column);
    },
    _onEditColumn: function _onEditColumn() {
        controlButtonActionCreators.hideTaptip("cogControlButton" + this.props.column);
        controlButtonActionCreators.showTaptip("editControlButton" + this.props.column);
    },
    render: function render() {

        var cogBoxContainer = {
            position: "relative"
        };

        var cogBox = React.createElement(
            'div',
            { style: cogBoxContainer },
            React.createElement(
                'ul',
                {
                    className: 'opList' },
                React.createElement(
                    'li',
                    {
                        className: 'opListItem edit',
                        onClick: this._onEditColumn },
                    'Find and Replace'
                ),
                React.createElement(
                    'li',
                    {
                        className: 'opListItem clone',
                        onClick: this._onCloneColumn },
                    'Duplicate'
                ),
                React.createElement(
                    'li',
                    {
                        className: 'opListItem add',
                        onClick: this._onAddColumn },
                    'Add'
                ),
                React.createElement(
                    'li',
                    {
                        className: 'opListItem remove',
                        onClick: this._onRemoveColumn },
                    'Remove'
                )
            )
        );

        var cogTaptip = {
            "content": cogBox,
            "x": 100,
            "y": 24,
            "styles": [{ "key": "width", "value": "120px" }],
            "break": "",
            "padding": "0px"
        };

        var columnIndex = this.props.column;

        var cogIcon = React.createElement('i', { className: "fa fa-cog " });

        return React.createElement(ControlButton, {
            name: "cogControlButton" + columnIndex,
            taptip: cogTaptip,
            controlclass: 'cog_button',
            fontAwesomeIcon: 'pencil',
            closeAction: this._onClose });
    }
});

module.exports = CogButton;

},{"../../action-creators/control-button-action-creators":3,"../control-button":20,"./edit-columns-button":22,"react":undefined}],22:[function(require,module,exports){
'use strict';

var React = require('react');

var ControlButton = require('../control-button');
var controlButtonActionCreators = require('../../action-creators/control-button-action-creators');
// var controlButtonStore = require('../../stores/control-button-store');

var EditColumnButton = React.createClass({
    displayName: 'EditColumnButton',

    getInitialState: function getInitialState() {
        return getStateFromStores();
    },
    _onFindBoxChange: function _onFindBoxChange(e) {
        var findValue = e.target.value;

        this.setState({ findValue: findValue });

        this.props.onclear(this.props.column);
    },
    _onReplaceBoxChange: function _onReplaceBoxChange(e) {
        var replaceValue = e.target.value;

        this.setState({ replaceValue: replaceValue });
    },
    _findNext: function _findNext() {

        if (this.state.findValue === "") {
            this.props.onclear(this.props.column);
        } else {
            this.props.findnext(this.state.findValue, this.props.column);
        }
    },
    _onClearEdit: function _onClearEdit(e) {

        this.props.onclear(this.props.column);
        this.setState({ findValue: "" });
        this.setState({ replaceValue: "" });
        controlButtonActionCreators.hideTaptip("editControlButton" + this.props.column);
    },
    _replace: function _replace() {
        this.props.replace(this.state.findValue, this.state.replaceValue, this.props.column);
    },
    _replaceAll: function _replaceAll() {
        this.props.replaceall(this.state.findValue, this.state.replaceValue, this.props.column);
    },
    render: function render() {

        var editBoxContainer = {
            position: "relative"
        };

        var inputStyle = {
            width: "100%",
            marginLeft: "10px",
            fontWeight: "normal"
        };

        var divWidth = {
            width: "85%"
        };

        var clearTooltip = {
            content: "Clear Search",
            x: 50,
            y: 0
        };

        var findTooltip = {
            content: "Find Next",
            x: 100,
            y: 0
        };

        var replaceTooltip = {
            content: "Replace",
            x: 100,
            y: 80
        };

        var replaceAllTooltip = {
            content: "Replace All",
            x: 100,
            y: 80
        };

        var buttonsStyle = {
            marginTop: "8px"
        };

        var editBox = React.createElement(
            'div',
            { style: editBoxContainer },
            React.createElement(ControlButton, {
                fontAwesomeIcon: 'ban',
                tooltip: clearTooltip,
                clickAction: this._onClearEdit }),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'tbody',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { colSpan: '2' },
                                'Find in Column'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { width: '70%' },
                                React.createElement('input', {
                                    type: 'text',
                                    style: inputStyle,
                                    onChange: this._onFindBoxChange,
                                    value: this.state.findValue
                                })
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'div',
                                    { style: buttonsStyle },
                                    React.createElement(ControlButton, {
                                        fontAwesomeIcon: 'step-forward',
                                        tooltip: findTooltip,
                                        clickAction: this._findNext })
                                )
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { colSpan: '2' },
                                'Replace With'
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                null,
                                React.createElement('input', {
                                    type: 'text',
                                    style: inputStyle,
                                    onChange: this._onReplaceBoxChange,
                                    value: this.state.replaceValue
                                })
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'div',
                                    { className: 'inlineBlock',
                                        style: buttonsStyle },
                                    React.createElement(ControlButton, {
                                        fontAwesomeIcon: 'step-forward',
                                        tooltip: replaceTooltip,
                                        clickAction: this._replace }),
                                    React.createElement(ControlButton, {
                                        fontAwesomeIcon: 'fast-forward',
                                        tooltip: replaceAllTooltip,
                                        clickAction: this._replaceAll })
                                )
                            )
                        )
                    )
                )
            )
        );

        var editTaptip = {
            "title": "Search Column",
            "content": editBox,
            "x": 100,
            "y": 24,
            "styles": [{ "key": "width", "value": "250px" }]
        };

        var editTooltip = {
            "content": this.props.tooltipMsg,
            "x": 160,
            "y": 0
        };

        var columnIndex = this.props.column;

        return React.createElement(ControlButton, {
            name: "editControlButton" + columnIndex,
            taptip: editTaptip,
            tooltip: editTooltip,
            fontAwesomeIcon: 'pencil',
            controlclass: 'edit_column_button' });
    }
});

function getStateFromStores() {
    return {
        findValue: "",
        replaceValue: ""
    };
}

module.exports = EditColumnButton;

},{"../../action-creators/control-button-action-creators":3,"../control-button":20,"react":undefined}],23:[function(require,module,exports){
'use strict';

var React = require('react');

var ControlButton = require('../control-button');
// var controlButtonStore = require('../../stores/control-button-store');

var FilterPointsButton = React.createClass({
    displayName: 'FilterPointsButton',

    getInitialState: function getInitialState() {
        return getStateFromStores();
    },
    // componentDidMount: function () {
    //     controlButtonStore.addChangeListener(this._onStoresChange);
    // },
    // componentWillUnmount: function () {
    //     controlButtonStore.removeChangeListener(this._onStoresChange);
    // },
    // _onStoresChange: function () {

    //     if (controlButtonStore.getClearButton(this.props.name))
    //     {
    //         this.setState({ filterValue: "" });
    //     }
    // },
    _onFilterBoxChange: function _onFilterBoxChange(e) {
        var filterValue = e.target.value;

        this.setState({ filterValue: filterValue });

        if (filterValue !== "") {
            this.props.onfilter(e.target.value);
        } else {
            this.props.onclear();
        }
    },
    _onClearFilter: function _onClearFilter(e) {
        this.setState({ filterValue: "" });
        this.props.onclear();
    },
    render: function render() {

        var filterBoxContainer = {
            position: "relative"
        };

        var inputStyle = {
            width: "100%",
            marginLeft: "10px",
            fontWeight: "normal"
        };

        var divWidth = {
            width: "85%"
        };

        var clearTooltip = {
            content: "Clear Filter",
            "x": 80,
            "y": 0
        };

        var filterBox = React.createElement(
            'div',
            { style: filterBoxContainer },
            React.createElement(ControlButton, {
                fontAwesomeIcon: 'ban',
                tooltip: clearTooltip,
                clickAction: this._onClearFilter }),
            React.createElement(
                'div',
                { className: 'inlineBlock' },
                React.createElement(
                    'div',
                    { className: 'inlineBlock' },
                    React.createElement('span', { className: 'fa fa-filter' })
                ),
                React.createElement(
                    'div',
                    { className: 'inlineBlock', style: divWidth },
                    React.createElement('input', {
                        type: 'search',
                        style: inputStyle,
                        onChange: this._onFilterBoxChange,
                        value: this.state.filterValue
                    })
                )
            )
        );

        var filterTaptip = {
            "title": "Filter Points",
            "content": filterBox,
            "xOffset": 60,
            "yOffset": 120,
            "styles": [{ "key": "width", "value": "200px" }]
        };

        var filterIcon = React.createElement('i', { className: 'fa fa-filter' });

        var holdSelect = this.state.filterValue !== "";

        return React.createElement(ControlButton, {
            name: "filterControlButton",
            taptip: filterTaptip,
            tooltip: this.props.tooltipMsg,
            controlclass: 'filter_button',
            staySelected: holdSelect,
            icon: filterIcon });
    }
});

function getStateFromStores() {
    return {
        filterValue: ""
    };
}

module.exports = FilterPointsButton;

},{"../control-button":20,"react":undefined}],24:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Exchange = require('./exchange');
var consoleStore = require('../stores/console-store');

var Conversation = React.createClass({
    displayName: 'Conversation',

    getInitialState: getStateFromStores,
    componentDidMount: function componentDidMount() {
        var $conversation = $(ReactDOM.findDOMNode(this.refs.conversation));

        if ($conversation.prop('scrollHeight') > $conversation.height()) {
            $conversation.scrollTop($conversation.prop('scrollHeight'));
        }

        consoleStore.addChangeListener(this._onChange);
    },
    componentDidUpdate: function componentDidUpdate() {
        var $conversation = $(ReactDOM.findDOMNode(this.refs.conversation));

        $conversation.stop().animate({ scrollTop: $conversation.prop('scrollHeight') }, 500);
    },
    componentWillUnmount: function componentWillUnmount() {
        consoleStore.removeChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.setState(getStateFromStores());
    },
    render: function render() {
        return React.createElement(
            'div',
            { ref: 'conversation', className: 'conversation' },
            this.state.exchanges.map(function (exchange, index) {
                return React.createElement(Exchange, { key: index, exchange: exchange });
            })
        );
    }
});

function getStateFromStores() {
    return { exchanges: consoleStore.getExchanges() };
}

module.exports = Conversation;

},{"../stores/console-store":57,"./exchange":31,"jquery":undefined,"react":undefined,"react-dom":undefined}],25:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');
var platformChartStore = require('../stores/platform-chart-store');

var PlatformChart = require('./platform-chart');

var Dashboard = React.createClass({
    displayName: 'Dashboard',

    getInitialState: function getInitialState() {
        var state = getStateFromStores();
        return state;
    },
    componentDidMount: function componentDidMount() {
        platformChartStore.addChangeListener(this._onStoreChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        platformChartStore.removeChangeListener(this._onStoreChange);
    },
    _onStoreChange: function _onStoreChange() {
        this.setState(getStateFromStores());
    },
    render: function render() {

        var pinnedCharts = this.state.platformCharts;

        var platformCharts = [];

        pinnedCharts.forEach(function (pinnedChart) {
            if (pinnedChart.data.length > 0) {
                var platformChart = React.createElement(PlatformChart, { key: pinnedChart.chartKey, chart: pinnedChart, chartKey: pinnedChart.chartKey, hideControls: true });
                platformCharts.push(platformChart);
            }
        });

        if (pinnedCharts.length === 0) {
            platformCharts = React.createElement(
                'p',
                { className: 'empty-help' },
                'Pin a chart to have it appear on the dashboard'
            );
        }

        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'h2',
                null,
                'Dashboard'
            ),
            platformCharts
        );
    }
});

function getStateFromStores() {
    return {
        platformCharts: platformChartStore.getPinnedCharts()
    };
}

module.exports = Dashboard;

},{"../stores/platform-chart-store":61,"./platform-chart":37,"react":undefined,"react-router":undefined}],26:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');
var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');

var RegisterPlatformForm = React.createClass({
    displayName: 'RegisterPlatformForm',

    getInitialState: function getInitialState() {
        return {};
    },
    _onCancelClick: modalActionCreators.closeModal,
    _onSubmit: function _onSubmit(e) {
        e.preventDefault();
        platformManagerActionCreators.deregisterPlatform(this.props.platform);
    },
    render: function render() {
        return React.createElement(
            'form',
            { className: 'register-platform-form', onSubmit: this._onSubmit },
            React.createElement(
                'h1',
                null,
                'Deregister platform'
            ),
            React.createElement(
                'p',
                null,
                'Deregister ',
                React.createElement(
                    'strong',
                    null,
                    this.props.platform.name
                ),
                '?'
            ),
            React.createElement(
                'div',
                { className: 'form__actions' },
                React.createElement(
                    'button',
                    {
                        className: 'button button--secondary',
                        type: 'button',
                        onClick: this._onCancelClick,
                        autoFocus: true
                    },
                    'Cancel'
                ),
                React.createElement(
                    'button',
                    { className: 'button' },
                    'Deregister'
                )
            )
        );
    }
});

module.exports = RegisterPlatformForm;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-manager-action-creators":8,"react":undefined}],27:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var platformsStore = require('../stores/platforms-store');
var devicesActionCreators = require('../action-creators/devices-action-creators');

var DetectDevices = React.createClass({
    displayName: 'DetectDevices',

    getInitialState: function getInitialState() {
        var state = getStateFromStores();

        state.deviceRangeSelected = true;
        state.selectedProtocol = "udp_ip";
        state.udpPort = "";
        state.deviceStart = "";
        state.deviceEnd = "";
        state.address = "";

        return state;
    },
    componentDidMount: function componentDidMount() {
        // platformsStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        // platformsStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState(getStateFromStores());
    },
    _doScan: function _doScan() {
        devicesActionCreators.scanForDevices(this.props.platform);
    },
    _cancelScan: function _cancelScan() {
        devicesActionCreators.cancelScan(this.props.platform);
    },
    _continue: function _continue() {
        devicesActionCreators.listDetectedDevices(this.props.platform);
    },
    _onDeviceRangeSelect: function _onDeviceRangeSelect(evt) {
        var deviceRangeSelected = evt.target.checked;
        this.setState({ deviceRangeSelected: deviceRangeSelected });
    },
    _onAddressSelect: function _onAddressSelect(evt) {
        var addressSelected = evt.target.checked;
        this.setState({ deviceRangeSelected: !addressSelected });
    },
    _onIpSelect: function _onIpSelect(evt) {
        var selectedProtocol = evt.target.value;
        this.setState({ selectedProtocol: selectedProtocol });
    },
    _onPortInput: function _onPortInput(evt) {
        var udpPort = evt.target.value;
        this.setState({ udpPort: udpPort });
    },
    _onDeviceStart: function _onDeviceStart(evt) {
        var deviceStart = evt.target.value;
        this.setState({ deviceStart: deviceStart });
    },
    _onDeviceEnd: function _onDeviceEnd(evt) {
        var deviceEnd = evt.target.value;
        this.setState({ deviceEnd: deviceEnd });
    },
    _onAddress: function _onAddress(evt) {
        var address = evt.target.value;
        this.setState({ address: address });
    },
    render: function render() {

        var devices;

        switch (this.props.action) {
            case "start_scan":

                var containerStyle = {
                    width: "400px",
                    height: "400px"
                };

                var progressStyle = {
                    height: "40%",
                    clear: "both",
                    padding: "80px 0px 0px 200px"
                };

                var labelStyle = {
                    fontSize: "24px"
                };

                devices = React.createElement(
                    'div',
                    { style: containerStyle },
                    React.createElement(
                        'div',
                        { style: progressStyle },
                        React.createElement('i', { className: 'fa fa-cog fa-spin fa-5x fa-fw margin-bottom' }),
                        React.createElement('br', null),
                        React.createElement(
                            'div',
                            { style: labelStyle },
                            React.createElement(
                                'span',
                                null,
                                'Detecting...'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'inlineBlock' },
                        React.createElement(
                            'div',
                            { className: 'inlineBlock' },
                            React.createElement(
                                'button',
                                { onClick: this._cancelScan },
                                'Cancel'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'inlineBlock' },
                            React.createElement(
                                'button',
                                { onClick: this._continue },
                                'Continue'
                            )
                        )
                    )
                );

                break;
            case "get_scan_settings":

                var selectStyle = {
                    height: "24px",
                    width: "151px"
                };

                var radioStyle = {
                    width: "20px",
                    float: "left",
                    height: "20px",
                    paddingTop: "4px"
                };

                var buttonStyle = {
                    display: (this.state.deviceRangeSelected && this.state.deviceStart !== "" && this.state.deviceEnd !== "" || !this.state.deviceRangeSelected && this.state.address !== "") && this.state.udpPort !== "" ? "block" : "none"
                };

                var addressStyle = {
                    color: this.state.deviceRangeSelected ? "gray" : "black"
                };

                var deviceRangeStyle = {
                    color: this.state.deviceRangeSelected ? "black" : "gray"
                };

                devices = React.createElement(
                    'div',
                    { className: 'detectDevicesContainer' },
                    React.createElement(
                        'div',
                        { className: 'detectDevicesBox' },
                        React.createElement(
                            'table',
                            null,
                            React.createElement(
                                'tbody',
                                null,
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { className: 'table_label' },
                                        'Network Interface'
                                    ),
                                    React.createElement(
                                        'td',
                                        { className: 'plain' },
                                        React.createElement(
                                            'select',
                                            {
                                                style: selectStyle,
                                                onChange: this._onIpSelect,
                                                value: this.state.selectedProtocol },
                                            React.createElement(
                                                'option',
                                                { value: 'udp_ip' },
                                                'UDP/IP'
                                            ),
                                            React.createElement(
                                                'option',
                                                { value: 'ipc' },
                                                'IPC'
                                            ),
                                            React.createElement(
                                                'option',
                                                { value: 'tcp' },
                                                'TCP'
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { className: 'table_label buffer_row' },
                                        'UDP Port'
                                    ),
                                    React.createElement(
                                        'td',
                                        { className: 'plain buffer_row' },
                                        React.createElement('input', {
                                            type: 'number',
                                            onChange: this._onPortInput,
                                            value: this.state.udpPort })
                                    )
                                ),
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { className: 'table_label' },
                                        React.createElement(
                                            'div',
                                            null,
                                            React.createElement(
                                                'div',
                                                { style: radioStyle },
                                                React.createElement('input', {
                                                    type: 'radio',
                                                    name: 'scan_method',
                                                    onChange: this._onDeviceRangeSelect,
                                                    checked: this.state.deviceRangeSelected })
                                            ),
                                            React.createElement(
                                                'span',
                                                { style: deviceRangeStyle },
                                                'Device ID Range'
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        'td',
                                        { className: 'plain' },
                                        React.createElement('input', {
                                            disabled: !this.state.deviceRangeSelected,
                                            style: deviceRangeStyle,
                                            type: 'number',
                                            onChange: this._onDeviceStart,
                                            value: this.state.deviceStart }),
                                        ' ',
                                        React.createElement('input', {
                                            disabled: !this.state.deviceRangeSelected,
                                            style: deviceRangeStyle,
                                            type: 'number',
                                            onChange: this._onDeviceEnd,
                                            value: this.state.deviceEnd })
                                    )
                                ),
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { className: 'table_label' },
                                        React.createElement(
                                            'div',
                                            null,
                                            React.createElement(
                                                'div',
                                                { style: radioStyle },
                                                React.createElement('input', {
                                                    type: 'radio',
                                                    name: 'scan_method',
                                                    onChange: this._onAddressSelect,
                                                    checked: !this.state.deviceRangeSelected })
                                            ),
                                            React.createElement(
                                                'span',
                                                { style: addressStyle },
                                                'Address'
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        'td',
                                        { className: 'plain' },
                                        React.createElement('input', {
                                            disabled: this.state.deviceRangeSelected,
                                            style: addressStyle,
                                            type: 'text',
                                            onChange: this._onAddress,
                                            value: this.state.address })
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        {
                            style: buttonStyle },
                        React.createElement(
                            'button',
                            { onClick: this._doScan },
                            'Scan'
                        )
                    )
                );

                break;
        }

        return React.createElement(
            'div',
            null,
            devices
        );
    }
});

function getStateFromStores() {
    return {
        platform: { name: "PNNL", uuid: "99090" }
    };
}

module.exports = DetectDevices;

},{"../action-creators/devices-action-creators":4,"../stores/platforms-store":64,"react":undefined,"react-router":undefined}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var devicesActionCreators = require('../action-creators/devices-action-creators');
var devicesStore = require('../stores/devices-store');
var FilterPointsButton = require('./control_buttons/filter-points-button');
var ControlButton = require('./control-button');
var CogButton = require('./control_buttons/cog-select-button');
var EditColumnButton = require('./control_buttons/edit-columns-button');

var ConfirmForm = require('./confirm-form');
var modalActionCreators = require('../action-creators/modal-action-creators');

var DeviceConfiguration = function (_BaseComponent) {
    _inherits(DeviceConfiguration, _BaseComponent);

    function DeviceConfiguration(props) {
        _classCallCheck(this, DeviceConfiguration);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeviceConfiguration).call(this, props));

        _this._bind('_updateCell', '_focusCellAndColumn', '_blurCellAndColumn');

        _this.state = {};

        // this.state.registryValues = getPointsFromStore(this.props.device);
        _this.state.registryValues = _this.props.device.registryConfig;
        _this.state.registryHeader = [];
        _this.state.columnNames = [];
        _this.state.pointNames = [];

        if (_this.state.registryValues.length > 0) {
            _this.state.registryHeader = getRegistryHeader(_this.state.registryValues[0]);
            _this.state.columnNames = _this.state.registryValues[0].map(function (columns) {
                return columns.key;
            });

            _this.state.pointNames = _this.state.registryValues.map(function (points) {
                return points[0].value;
            });
        }

        _this.state.pointsToDelete = [];
        _this.state.allSelected = false;

        _this.state.selectedCells = [];
        _this.state.selectedCellRow = null;
        _this.state.selectedCellColumn = null;

        _this.state.activeColumn = null;
        _this.state.activeRow = null;

        _this.scrollToBottom = false;
        _this.resizeTable = false;

        return _this;
    }

    _createClass(DeviceConfiguration, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // platformsStore.addChangeListener(this._onStoresChange);

            this.containerDiv = document.getElementsByClassName("fixed-table-container-inner")[0];
            this.fixedHeader = document.getElementsByClassName("header-background")[0];
            this.fixedInner = document.getElementsByClassName("fixed-table-container-inner")[0];
            this.registryTable = document.getElementsByClassName("registryConfigTable")[0];
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // platformsStore.removeChangeListener(this._onStoresChange);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {

            if (this.scrollToBottom) {
                this.containerDiv.scrollTop = this.containerDiv.scrollHeight;

                this.scrollToBottom = false;
            }

            if (this.resizeTable) {
                this.fixedHeader.style.width = this.registryTable.clientWidth + "px";
                this.fixedInner.style.width = this.registryTable.clientWidth + "px";

                this.resizeTable = false;
            }

            if (this.state.selectedCellRow) {
                var focusedCell = document.getElementsByClassName("focusedCell")[0];
                if (focusedCell) {
                    focusedCell.focus();
                }
            }
        }
    }, {
        key: '_onStoresChange',
        value: function _onStoresChange() {
            this.setState({ registryValues: getPointsFromStore(this.props.device) });
        }
    }, {
        key: '_onFilterBoxChange',
        value: function _onFilterBoxChange(filterValue) {
            this.setState({ registryValues: getFilteredPoints(this.props.device, filterValue) });
        }
    }, {
        key: '_onClearFilter',
        value: function _onClearFilter() {
            this.setState({ registryValues: getPointsFromStore(this.props.device) }); //TODO: when filtering, set nonmatches to hidden so they're
            //still there and we don't lose information in inputs
            //then to clear filter, set all to not hidden
        }
    }, {
        key: '_onAddPoint',
        value: function _onAddPoint() {

            var pointNames = this.state.pointNames;

            pointNames.push("");

            this.setState({ pointNames: pointNames });

            var registryValues = this.state.registryValues;

            var pointValues = [];

            this.state.columnNames.map(function (column) {
                pointValues.push({ "key": column, "value": "", "editable": true });
            });

            registryValues.push(pointValues);

            this.setState({ registryValues: registryValues });

            this.scrollToBottom = true;
        }
    }, {
        key: '_onRemovePoints',
        value: function _onRemovePoints() {

            var promptText, confirmText, confirmAction, cancelText;

            if (this.state.pointsToDelete.length > 0) {
                promptText = "Are you sure you want to delete these points? " + this.state.pointsToDelete.join(", ");
                confirmText = "Delete";
                confirmAction = this._removePoints.bind(this, this.state.pointsToDelete);
            } else {
                promptText = "Select points to delete.";
                cancelText = "OK";
            }

            modalActionCreators.openModal(_react2.default.createElement(ConfirmForm, {
                promptTitle: 'Remove Points',
                promptText: promptText,
                confirmText: confirmText,
                onConfirm: confirmAction,
                cancelText: cancelText
            }));
        }
    }, {
        key: '_removePoints',
        value: function _removePoints(pointsToDelete) {
            console.log("removing " + pointsToDelete.join(", "));

            var registryValues = this.state.registryValues.slice();
            var pointsList = this.state.pointsToDelete.slice();
            var namesList = this.state.pointNames.slice();

            pointsToDelete.forEach(function (pointToDelete) {

                var index = -1;
                var pointValue = "";

                registryValues.some(function (vals, i) {
                    var pointMatched = vals[0].value === pointToDelete;

                    if (pointMatched) {
                        index = i;
                        pointValue = vals[0].value;
                    }

                    return pointMatched;
                });

                if (index > -1) {
                    registryValues.splice(index, 1);

                    index = pointsList.indexOf(pointValue);

                    if (index > -1) {
                        pointsList.splice(index, 1);
                    }

                    index = namesList.indexOf(pointValue);

                    if (index > -1) {
                        namesList.splice(index, 1);
                    }
                }
            });

            this.setState({ registryValues: registryValues });
            this.setState({ pointsToDelete: pointsList });
            this.setState({ pointNames: namesList });

            modalActionCreators.closeModal();
        }
    }, {
        key: '_selectForDelete',
        value: function _selectForDelete(attributesList) {

            var pointsToDelete = this.state.pointsToDelete;

            var index = pointsToDelete.indexOf(attributesList[0].value);

            if (index < 0) {
                pointsToDelete.push(attributesList[0].value);
            } else {
                pointsToDelete.splice(index, 1);
            }

            this.setState({ pointsToDelete: pointsToDelete });
        }
    }, {
        key: '_selectAll',
        value: function _selectAll() {
            var allSelected = !this.state.allSelected;

            this.setState({ allSelected: allSelected });

            this.setState({ pointsToDelete: allSelected ? this.state.pointNames.slice() : [] });
        }
    }, {
        key: '_onAddColumn',
        value: function _onAddColumn(columnFrom) {

            console.log(columnFrom);

            var registryHeader = this.state.registryHeader.slice();
            var registryValues = this.state.registryValues.slice();
            var columnNames = this.state.columnNames.slice();

            var index = registryHeader.indexOf(columnFrom);

            if (index > -1) {
                registryHeader.splice(index + 1, 0, registryHeader[index] + "2");

                this.setState({ registryHeader: registryHeader });

                columnNames.splice(index + 1, 0, columnFrom + "2");

                this.setState({ columnNames: columnNames });

                var newRegistryValues = registryValues.map(function (values) {

                    values.splice(index + 1, 0, { "key": columnFrom.replace(/ /g, "_") + "2", "value": "" });
                    var newValues = values;

                    return newValues;
                });

                this.resizeTable = true;

                this.setState({ registryValues: newRegistryValues });
            }
        }
    }, {
        key: '_onCloneColumn',
        value: function _onCloneColumn(index) {

            var registryHeader = this.state.registryHeader.slice();
            var registryValues = this.state.registryValues.slice();
            var columnNames = this.state.columnNames.slice();

            registryHeader.splice(index + 1, 0, registryHeader[index]);

            this.setState({ registryHeader: registryHeader });

            columnNames.splice(index + 1, 0, registryHeader[index]);

            this.setState({ columnNames: columnNames });

            var newRegistryValues = registryValues.map(function (values, row) {

                var clonedValue = {};

                for (var key in values[index]) {
                    clonedValue[key] = values[index][key];
                }

                values.splice(index + 1, 0, clonedValue);

                return values;
            });

            this.resizeTable = true;

            this.setState({ registryValues: newRegistryValues });
        }
    }, {
        key: '_onRemoveColumn',
        value: function _onRemoveColumn(column) {

            var promptText = "Are you sure you want to delete the column, " + column + "?";

            modalActionCreators.openModal(_react2.default.createElement(ConfirmForm, {
                promptTitle: 'Remove Column',
                promptText: promptText,
                confirmText: 'Delete',
                onConfirm: this._removeColumn.bind(this, column)
            }));
        }
    }, {
        key: '_removeColumn',
        value: function _removeColumn(columnToDelete) {
            console.log("deleting " + columnToDelete);

            var registryHeader = this.state.registryHeader.slice();
            var registryValues = this.state.registryValues.slice();
            var columnNames = this.state.columnNames.slice();

            var index = columnNames.indexOf(columnToDelete.replace(/ /g, "_"));

            if (index > -1) {
                columnNames.splice(index, 1);
            }

            index = registryHeader.indexOf(columnToDelete);

            if (index > -1) {
                registryHeader.splice(index, 1);

                registryValues.forEach(function (values) {

                    var itemFound = values.find(function (item, i) {

                        var matched = item.key === columnToDelete.replace(/ /g, "_");

                        if (matched) {
                            index = i;
                        }

                        return matched;
                    });

                    if (itemFound) {
                        values.splice(index, 1);
                    }
                });

                this.resizeTable = true;

                this.setState({ columnNames: columnNames });
                this.setState({ registryValues: registryValues });
                this.setState({ registryHeader: registryHeader });

                modalActionCreators.closeModal();
            }
        }
    }, {
        key: '_updateCell',
        value: function _updateCell(row, column, e) {

            var currentTarget = e.currentTarget;
            var newRegistryValues = this.state.registryValues.slice();

            newRegistryValues[row][column].value = currentTarget.textContent;

            this.setState({ registryValues: newRegistryValues });
        }
    }, {
        key: '_focusCellAndColumn',
        value: function _focusCellAndColumn(row, column, e) {
            this.setState({ activeRow: row });
            this.setState({ activeColumn: column });
        }
    }, {
        key: '_blurCellAndColumn',
        value: function _blurCellAndColumn() {
            this.setState({ activeRow: null });
            this.setState({ activeColumn: null });
        }
    }, {
        key: '_onFindNext',
        value: function _onFindNext(findValue, column) {

            var registryValues = this.state.registryValues.slice();

            if (this.state.selectedCells.length === 0) {
                var selectedCells = [];

                this.setState({ registryValues: registryValues.map(function (values, row) {

                        //searching i-th column in each row, and if the cell contains the target value, select it
                        values[column].selected = values[column].value.indexOf(findValue) > -1;

                        if (values[column].selected) {
                            selectedCells.push(row);
                        }

                        return values;
                    })
                });

                if (selectedCells.length > 0) {
                    this.setState({ selectedCells: selectedCells });
                    this.setState({ selectedCellColumn: column });

                    //set focus to the first selected cell
                    this.setState({ selectedCellRow: selectedCells[0] });
                }
            } else {
                //we've already found the selected cells, so we need to advance focus to the next one
                if (this.state.selectedCells.length > 1) {
                    var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);

                    this.setState({ selectedCellRow: selectedCellRow });
                }
            }
        }
    }, {
        key: '_onReplace',
        value: function _onReplace(findValue, replaceValue, column) {

            if (!this.state.selectedCellRow) {
                this._onFindNext(findValue, column);
            } else {
                var registryValues = this.state.registryValues.slice();
                registryValues[this.state.selectedCellRow][column].value = registryValues[this.state.selectedCellRow][column].value.replace(findValue, replaceValue);

                //If the cell no longer has the target value, deselect it and move focus to the next selected cell
                if (registryValues[this.state.selectedCellRow][column].value.indexOf(findValue) < 0) {
                    registryValues[this.state.selectedCellRow][column].selected = false;

                    //see if there will even be another selected cell to move to
                    var selectedCells = this.state.selectedCells.slice();
                    var index = selectedCells.indexOf(this.state.selectedCellRow);

                    if (index > -1) {
                        selectedCells.splice(index, 1);
                    }

                    if (selectedCells.length > 0) {
                        var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);

                        this.setState({ selectedCellRow: selectedCellRow });
                        this.setState({ selectedCells: selectedCells });
                    } else {
                        //there were no more selected cells, so clear everything out
                        this.setState({ selectedCells: [] });
                        this.setState({ selectedCellRow: null });
                        this.setState({ selectedCellColumn: null });
                    }
                }

                this.setState({ registryValues: registryValues });
            }
        }
    }, {
        key: '_onReplaceAll',
        value: function _onReplaceAll(findValue, replaceValue, column) {

            if (!this.state.selectedCellRow) {
                this._onFindNext(findValue, column);
            } else {
                var registryValues = this.state.registryValues.slice();
                var selectedCells = this.state.selectedCells.slice();
                var selectedCellRow = this.state.selectedCellRow;

                while (selectedCells.length > 0) {
                    registryValues[selectedCellRow][column].value = registryValues[this.state.selectedCellRow][column].value.replace(findValue, replaceValue);

                    if (registryValues[selectedCellRow][column].value.indexOf(findValue) < 0) {
                        registryValues[selectedCellRow][column].selected = false;

                        var index = selectedCells.indexOf(selectedCellRow);

                        if (index > -1) {
                            selectedCells.splice(index, 1);
                        } else {
                            //something went wrong, so stop the while loop
                            break;
                        }

                        if (selectedCells.length > 0) {
                            selectedCellRow = this._goToNext(selectedCellRow, this.state.selectedCells);
                        }
                    }
                }

                this.setState({ selectedCellRow: null });
                this.setState({ selectedCells: [] });
                this.setState({ selectedCellColumn: null });
                this.setState({ registryValues: registryValues });
            }
        }
    }, {
        key: '_onClearFind',
        value: function _onClearFind(column) {

            var registryValues = this.state.registryValues.slice();

            this.state.selectedCells.map(function (row) {
                registryValues[row][column].selected = false;
            });

            this.setState({ registryValues: registryValues });
            this.setState({ selectedCells: [] });
            this.setState({ selectedCellRow: null });
            this.setState({ selectedCellColumn: null });
        }
    }, {
        key: '_goToNext',
        value: function _goToNext(selectedCellRow, selectedCells) {

            //this is the row with current focus
            var rowIndex = selectedCells.indexOf(selectedCellRow);

            if (rowIndex > -1) {
                //either set focus to the next one in the selected cells list
                if (rowIndex < selectedCells.length - 1) {
                    selectedCellRow = selectedCells[++rowIndex];
                } else //or if we're at the end of the list, go back to the first one
                    {
                        selectedCellRow = selectedCells[0];
                    }
            }

            return selectedCellRow;
        }
    }, {
        key: '_cancelRegistry',
        value: function _cancelRegistry() {
            devicesActionCreators.cancelRegistry(this.props.device);
        }
    }, {
        key: '_saveRegistry',
        value: function _saveRegistry() {
            devicesActionCreators.saveRegistry(this.props.device, this.state.registryValues);
        }
    }, {
        key: 'render',
        value: function render() {

            var filterPointsTooltip = {
                content: "Filter Points",
                "x": 160,
                "y": 30
            };

            var filterButton = _react2.default.createElement(FilterPointsButton, {
                name: 'filterRegistryPoints',
                tooltipMsg: filterPointsTooltip,
                onfilter: this._onFilterBoxChange,
                onclear: this._onClearFilter });

            var addPointTooltip = {
                content: "Add New Point",
                "x": 160,
                "y": 30
            };

            var addPointButton = _react2.default.createElement(ControlButton, {
                name: 'addRegistryPoint',
                tooltip: addPointTooltip,
                controlclass: 'add_point_button',
                fontAwesomeIcon: 'plus',
                clickAction: this._onAddPoint });

            var removePointTooltip = {
                content: "Remove Points",
                "x": 160,
                "y": 30
            };

            var removePointsButton = _react2.default.createElement(ControlButton, {
                name: 'removeRegistryPoints',
                fontAwesomeIcon: 'minus',
                tooltip: removePointTooltip,
                controlclass: 'remove_point_button',
                clickAction: this._onRemovePoints });

            var registryRows, registryHeader;

            registryRows = this.state.registryValues.map(function (attributesList, rowIndex) {

                var registryCells = attributesList.map(function (item, columnIndex) {

                    var selectedStyle = item.selected ? { backgroundColor: "#F5B49D" } : columnIndex === this.state.activeColumn ? rowIndex === this.state.activeRow ? { backgroundColor: "#B0B0B0" } : { backgroundColor: "#DBDBDB" } : {};

                    var focusedCell = this.state.selectedCellColumn === columnIndex && this.state.selectedCellRow === rowIndex ? " registryConfig-input focusedCell inlineBlock" : "registryConfig-input inlineBlock";

                    var itemCell = columnIndex === 0 && !item.editable ? _react2.default.createElement(
                        'div',
                        { key: this.state.registryValues[rowIndex][columnIndex].key + "-" + columnIndex + "-" + rowIndex + "-key", className: 'registryConfig-cell' },
                        _react2.default.createElement(
                            'label',
                            null,
                            item.value
                        )
                    ) : _react2.default.createElement(
                        'div',
                        { key: this.state.registryValues[rowIndex][columnIndex].key + "-" + columnIndex + "-" + rowIndex + "-key", className: 'registryConfig-cell' },
                        _react2.default.createElement(
                            'div',
                            { className: 'inlineBlock' },
                            ' ◆ '
                        ),
                        _react2.default.createElement('div', { id: this.state.registryValues[rowIndex][columnIndex].key + "-" + columnIndex + "-" + rowIndex,
                            type: 'text',
                            className: focusedCell,
                            style: selectedStyle,
                            contentEditable: true,
                            onInput: this._updateCell.bind(this, rowIndex, columnIndex),
                            onBlur: this._blurCellAndColumn,
                            onFocus: this._focusCellAndColumn.bind(this, rowIndex, columnIndex),
                            dangerouslySetInnerHTML: { __html: this.state.registryValues[rowIndex][columnIndex].value } })
                    );

                    return itemCell;
                }, this);

                return _react2.default.createElement(
                    'div',
                    { className: 'registryConfig-row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'registryConfig-cell' },
                        _react2.default.createElement('input', { type: 'checkbox',
                            onChange: this._selectForDelete.bind(this, attributesList),
                            checked: this.state.pointsToDelete.indexOf(attributesList[0].value) > -1 })
                    ),
                    registryCells
                );
            }, this);

            var wideCell = {
                width: "100%"
            };

            registryHeader = this.state.registryHeader.map(function (item, index) {

                var cogButton = _react2.default.createElement(CogButton, {
                    onremove: this._onRemoveColumn,
                    onadd: this._onAddColumn,
                    onclone: this._onCloneColumn,
                    column: index,
                    item: item });

                var editColumnButton = _react2.default.createElement(EditColumnButton, {
                    column: index,
                    tooltipMsg: 'Edit Column',
                    findnext: this._onFindNext,
                    replace: this._onReplace,
                    replaceall: this._onReplaceAll,
                    onfilter: this._onFilterBoxChange,
                    onclear: this._onClearFind });

                var firstColumnWidth;

                if (index === 0) {
                    firstColumnWidth = {
                        width: item.length * 10 + "px"
                    };
                }

                var headerCell = index === 0 ? _react2.default.createElement(
                    'div',
                    { className: 'registryConfig-header-cell', style: firstColumnWidth },
                    _react2.default.createElement(
                        'div',
                        { className: 'th-inner' },
                        item,
                        ' ',
                        filterButton,
                        ' ',
                        addPointButton,
                        ' ',
                        removePointsButton
                    )
                ) : _react2.default.createElement(
                    'div',
                    { className: 'registryConfig-header-cell' },
                    _react2.default.createElement(
                        'div',
                        { className: 'th-inner', style: wideCell },
                        _react2.default.createElement(
                            'span',
                            { style: index === this.state.activeColumn ? { backgroundColor: "#DBDBDB" } : {} },
                            item
                        ),
                        cogButton,
                        editColumnButton
                    )
                );

                return headerCell;
            }, this);

            var wideDiv = {
                width: "100%",
                textAlign: "center",
                paddingTop: "20px"
            };

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'fixed-table-container' },
                    _react2.default.createElement('div', { className: 'header-background' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'fixed-table-container-inner' },
                        _react2.default.createElement(
                            'div',
                            { className: 'registryConfig-table' },
                            _react2.default.createElement(
                                'div',
                                { className: 'registryConfig-header' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'registryConfig-header-cell th-inner' },
                                    _react2.default.createElement('input', { type: 'checkbox',
                                        onChange: this._selectAll,
                                        checked: this.state.allSelected })
                                ),
                                registryHeader
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'registryConfig-body' },
                                registryRows
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { style: wideDiv },
                    _react2.default.createElement(
                        'div',
                        { className: 'inlineBlock' },
                        _react2.default.createElement(
                            'button',
                            { onClick: this._cancelRegistry },
                            'Cancel'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'inlineBlock' },
                        _react2.default.createElement(
                            'button',
                            { onClick: this._saveRegistry },
                            'Save'
                        )
                    )
                )
            );
        }
    }]);

    return DeviceConfiguration;
}(_baseComponent2.default);

;

function getFilteredPoints(device, filterStr) {
    return devicesStore.getFilteredRegistryValues(device, filterStr);
}

function getPointsFromStore(device) {
    return devicesStore.getRegistryValues(device);
}

function getRegistryHeader(registryItem) {
    return registryItem.map(function (item) {
        return item.key.replace(/_/g, " ");
    });
}

exports.default = DeviceConfiguration;

},{"../action-creators/devices-action-creators":4,"../action-creators/modal-action-creators":5,"../stores/devices-store":59,"./base-component":12,"./confirm-form":18,"./control-button":20,"./control_buttons/cog-select-button":21,"./control_buttons/edit-columns-button":22,"./control_buttons/filter-points-button":23,"react":undefined}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _socket = require('socket');

var _socket2 = _interopRequireDefault(_socket);

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _deviceConfiguration = require('./device-configuration');

var _deviceConfiguration2 = _interopRequireDefault(_deviceConfiguration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var devicesActionCreators = require('../action-creators/devices-action-creators');
var modalActionCreators = require('../action-creators/modal-action-creators');
var devicesStore = require('../stores/devices-store');
var socket = (0, _socket2.default)('https://localhost:3000');
var CsvParse = require('babyparse');

var DevicesFound = function (_BaseComponent) {
    _inherits(DevicesFound, _BaseComponent);

    function DevicesFound(props) {
        _classCallCheck(this, DevicesFound);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DevicesFound).call(this, props));

        _this._bind('_onStoresChange', '_uploadRegistryFile');

        _this.state = {};
        _this.state.devices = devicesStore.getDevices(props.platform, props.bacnet);

        if (socket) {
            socket.on('server:event', function (data) {
                console.log("data: " + data);
            });
        }
        return _this;
    }

    _createClass(DevicesFound, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            devicesStore.addChangeListener(this._onStoresChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            devicesStore.removeChangeListener(this._onStoresChange);
        }
    }, {
        key: '_onStoresChange',
        value: function _onStoresChange() {
            var devices = devicesStore.getDevices(this.props.platform, this.props.bacnet);
            this.props.devicesloaded(devices.length > 0);
            this.setState({ devices: devices });
        }
    }, {
        key: '_configureDevice',
        value: function _configureDevice(device) {

            device.configuring = !device.configuring;
            devicesActionCreators.configureDevice(device);
        }
    }, {
        key: '_uploadRegistryFile',
        value: function _uploadRegistryFile(evt) {

            var csvFile = evt.target.files[0];

            if (!csvFile) {
                return;
            }

            var deviceId = evt.target.dataset.key;
            var device = this.state.devices.find(function (device) {
                return device.id === deviceId;
            });

            if (device) {
                var fileName = evt.target.value;

                var reader = new FileReader();

                reader.onload = function (e) {

                    var contents = e.target.result;

                    var results = parseCsvFile(contents);

                    if (results.errors.length) {
                        var errorMsg = "The file wasn't in a valid CSV format.";

                        modalActionCreators.openModal(_react2.default.createElement(ConfirmForm, {
                            promptTitle: 'Error Reading File',
                            promptText: errorMsg,
                            cancelText: 'OK'
                        }));

                        // this.setState({registry_config: this.state.registry_config});
                    } else {
                        if (results.warnings.length) {
                            var warningMsg = results.warnings.map(function (warning) {
                                return warning.message;
                            });

                            modalActionCreators.openModal(_react2.default.createElement(ConfirmForm, {
                                promptTitle: 'File Upload Notes',
                                promptText: warningMsg,
                                cancelText: 'OK'
                            }));
                        }

                        if (!results.meta.aborted) {
                            // this.setState({registry_config: fileName});       
                            devicesActionCreators.loadRegistry(device, results.data, fileName);
                            console.log(JSON.stringify(results.data));
                        }
                    }
                }.bind(this);

                reader.readAsText(csvFile);
            } else {
                alert("Couldn't find device by ID " + deviceId);
            }
        }
    }, {
        key: 'render',
        value: function render() {

            var devicesContainer;
            if (this.state.devices.length) {
                var devices = this.state.devices.map(function (device) {

                    var deviceId = device.id;

                    var tds = device.items.map(function (d, i) {
                        return _react2.default.createElement(
                            'td',
                            { key: d.key + "-" + i, className: 'plain' },
                            d.value
                        );
                    });

                    return _react2.default.createElement(
                        'tr',
                        { key: deviceId },
                        _react2.default.createElement(
                            'td',
                            { key: "config-arrow-" + deviceId, className: 'plain' },
                            _react2.default.createElement(
                                'div',
                                { className: device.configuring ? "configure-arrow rotateConfigure" : "configure-arrow",
                                    onClick: this._configureDevice.bind(this, device) },
                                '▶'
                            )
                        ),
                        tds,
                        _react2.default.createElement(
                            'td',
                            { key: "file-upload-" + deviceId, className: 'plain' },
                            _react2.default.createElement(
                                'div',
                                { className: 'fileButton' },
                                _react2.default.createElement(
                                    'div',
                                    null,
                                    _react2.default.createElement('i', { className: 'fa fa-file' })
                                ),
                                _react2.default.createElement('input', {
                                    className: 'uploadButton',
                                    type: 'file',
                                    'data-key': deviceId,
                                    onChange: this._uploadRegistryFile })
                            )
                        )
                    );
                }, this);

                var ths = this.state.devices[0].items.map(function (d, i) {
                    return _react2.default.createElement(
                        'th',
                        { key: d.key + "-" + i + "-th", className: 'plain' },
                        d.label
                    );
                });

                if (devices.length) {
                    for (var i = devices.length - 1; i >= 0; i--) {
                        var device = this.state.devices.find(function (dev) {
                            return dev.id === devices[i].key;
                        });

                        if (device) {
                            if (device.registryConfig.length > 0) {
                                var deviceConfiguration = _react2.default.createElement(
                                    'tr',
                                    { key: "config-" + device.id },
                                    _react2.default.createElement(
                                        'td',
                                        { colSpan: 7 },
                                        _react2.default.createElement(_deviceConfiguration2.default, { device: device })
                                    )
                                );

                                devices.splice(i + 1, 0, deviceConfiguration);
                            }
                        }
                    }
                }

                devicesContainer = _react2.default.createElement(
                    'table',
                    null,
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement('th', { className: 'plain' }),
                            ths,
                            _react2.default.createElement('th', { className: 'plain' })
                        ),
                        devices
                    )
                );
            } else {
                if (this.props.canceled) {
                    devicesContainer = _react2.default.createElement(
                        'div',
                        { className: 'no-devices' },
                        'No devices were detected.'
                    );
                } else {
                    devicesContainer = _react2.default.createElement(
                        'div',
                        { className: 'no-devices' },
                        'Searching for devices ...'
                    );
                }
            }

            return _react2.default.createElement(
                'div',
                { className: 'devicesFoundContainer' },
                _react2.default.createElement(
                    'div',
                    { className: 'devicesFoundBox' },
                    devicesContainer
                )
            );
        }
    }]);

    return DevicesFound;
}(_baseComponent2.default);

;

var parseCsvFile = function parseCsvFile(contents) {

    var results = CsvParse.parse(contents);

    var registryValues = [];

    var header = [];

    var data = results.data;

    results.warnings = [];

    if (data.length) {
        header = data.slice(0, 1);
    }

    var template = [];

    if (header[0].length) {
        header[0].forEach(function (column) {
            template.push({ "key": column.replace(/ /g, "_"), "value": null, "label": column });
        });

        var templateLength = template.length;

        if (data.length > 1) {
            var rows = data.slice(1);

            var rowsCount = rows.length;

            rows.forEach(function (r, num) {

                if (r.length !== templateLength && num !== rowsCount - 1) {
                    results.warnings.push({ message: "Row " + num + " was omitted for having the wrong number of columns." });
                } else {
                    var newTemplate = JSON.parse(JSON.stringify(template));

                    var newRow = [];

                    r.forEach(function (value, i) {
                        newTemplate[i].value = value;

                        newRow.push(newTemplate[i]);
                    });

                    registryValues.push(newRow);
                }
            });
        } else {
            registryValues = template;
        }
    }

    results.data = registryValues;

    return results;
};

exports.default = DevicesFound;

},{"../action-creators/devices-action-creators":4,"../action-creators/modal-action-creators":5,"../stores/devices-store":59,"./base-component":12,"./device-configuration":28,"babyparse":undefined,"react":undefined,"socket":undefined}],30:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

// var platformsStore = require('../stores/platforms-store');
var DetectDevices = require('./detect-devices');
var DevicesFound = require('./devices-found');
var ConfigureDevice = require('./configure-device');
var ConfigureRegistry = require('./configure-registry');
var devicesStore = require('../stores/devices-store');

var Devices = React.createClass({
    displayName: 'Devices',

    // mixins: [Router.State],
    getInitialState: function getInitialState() {
        return getStateFromStores();
    },
    componentDidMount: function componentDidMount() {
        devicesStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        devicesStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState(getStateFromStores());
    },
    render: function render() {

        var view_component;
        var platform = this.state.platform;

        switch (this.state.view) {
            case "Detect Devices":

                view_component = React.createElement(DetectDevices, { platform: this.state.platform, action: this.state.action });

                break;
            case "Configure Devices":
                view_component = React.createElement(DevicesFound, { platform: this.state.platform, action: this.state.action });
                break;
            case "Configure Device":
                view_component = React.createElement(ConfigureDevice, { device: this.state.device, action: this.state.action });
                break;
            case "Registry Configuration":
                view_component = React.createElement(ConfigureRegistry, { device: this.state.device, action: this.state.action });
                break;
        }

        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'h2',
                null,
                this.state.view
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    React.createElement(
                        'b',
                        null,
                        'Instance: '
                    )
                ),
                React.createElement(
                    'label',
                    null,
                    platform.name
                ),
                view_component
            )
        );
    }
});

function getStateFromStores() {

    var deviceState = devicesStore.getState();

    return {
        // platform: platformsStore.getPlatform(component.getParams().uuid),
        platform: { name: "PNNL", uuid: "99090" },
        view: deviceState.view,
        action: deviceState.action,
        device: deviceState.device
    };
}

module.exports = Devices;

},{"../stores/devices-store":59,"./configure-device":15,"./configure-registry":17,"./detect-devices":27,"./devices-found":29,"react":undefined,"react-router":undefined}],31:[function(require,module,exports){
'use strict';

var React = require('react');

var Exchange = React.createClass({
    displayName: 'Exchange',

    _formatTime: function _formatTime(time) {
        var d = new Date();

        d.setTime(time);

        return d.toLocaleString();
    },
    _formatMessage: function _formatMessage(message) {
        return JSON.stringify(message, null, '    ');
    },
    render: function render() {
        var exchange = this.props.exchange;
        var classes = ['response'];
        var responseText;

        if (!exchange.completed) {
            classes.push('response--pending');
            responseText = 'Waiting for response...';
        } else if (exchange.error) {
            classes.push('response--error');
            responseText = exchange.error.message;
        } else {
            if (exchange.response.error) {
                classes.push('response--error');
            }

            responseText = this._formatMessage(exchange.response);
        }

        return React.createElement(
            'div',
            { className: 'exchange' },
            React.createElement(
                'div',
                { className: 'request' },
                React.createElement(
                    'div',
                    { className: 'time' },
                    this._formatTime(exchange.initiated)
                ),
                React.createElement(
                    'pre',
                    null,
                    this._formatMessage(exchange.request)
                )
            ),
            React.createElement(
                'div',
                { className: classes.join(' ') },
                exchange.completed && React.createElement(
                    'div',
                    { className: 'time' },
                    this._formatTime(exchange.completed)
                ),
                React.createElement(
                    'pre',
                    null,
                    responseText
                )
            )
        );
    }
});

module.exports = Exchange;

},{"react":undefined}],32:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');

var LoginForm = React.createClass({
    displayName: 'LoginForm',

    getInitialState: function getInitialState() {
        var state = {};

        return state;
    },
    _onUsernameChange: function _onUsernameChange(e) {
        this.setState({
            username: e.target.value,
            error: null
        });
    },
    _onPasswordChange: function _onPasswordChange(e) {
        this.setState({
            password: e.target.value,
            error: null
        });
    },
    _onSubmit: function _onSubmit(e) {
        e.preventDefault();
        platformManagerActionCreators.requestAuthorization(this.state.username, this.state.password);
    },
    render: function render() {
        return React.createElement(
            'form',
            { className: 'login-form', onSubmit: this._onSubmit },
            React.createElement('input', {
                className: 'login-form__field',
                type: 'text',
                placeholder: 'Username',
                autoFocus: true,
                onChange: this._onUsernameChange
            }),
            React.createElement('input', {
                className: 'login-form__field',
                type: 'password',
                placeholder: 'Password',
                onChange: this._onPasswordChange
            }),
            React.createElement('input', {
                className: 'button login-form__submit',
                type: 'submit',
                value: 'Log in',
                disabled: !this.state.username || !this.state.password
            })
        );
    }
});

module.exports = LoginForm;

},{"../action-creators/platform-manager-action-creators":8,"react":undefined,"react-router":undefined}],33:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');

var Modal = React.createClass({
	displayName: 'Modal',

	_onClick: function _onClick(e) {
		if (e.target === e.currentTarget) {
			modalActionCreators.closeModal();
		}
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'modal__overlay', onClick: this._onClick },
			React.createElement(
				'div',
				{ className: 'modal__dialog' },
				this.props.children
			)
		);
	}
});

module.exports = Modal;

},{"../action-creators/modal-action-creators":5,"react":undefined}],34:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');
var authorizationStore = require('../stores/authorization-store');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');

var Navigation = React.createClass({
    displayName: 'Navigation',

    getInitialState: getStateFromStores,
    componentDidMount: function componentDidMount() {
        authorizationStore.addChangeListener(this._onStoreChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        authorizationStore.removeChangeListener(this._onStoreChange);
    },
    _onStoreChange: function _onStoreChange() {
        this.setState(getStateFromStores());
    },
    _onLogOutClick: function _onLogOutClick() {
        platformManagerActionCreators.clearAuthorization();
    },
    render: function render() {
        var navItems;

        if (this.state.loggedIn) {
            navItems = ['Dashboard', 'Platforms', 'Charts'].map(function (navItem) {
                var route = navItem.toLowerCase();

                return React.createElement(
                    Router.Link,
                    {
                        key: route,
                        to: route,
                        className: 'navigation__item',
                        activeClassName: 'navigation__item--active'
                    },
                    navItem
                );
            });

            navItems.push(React.createElement(
                'a',
                {
                    key: 'logout',
                    className: 'navigation__item',
                    tabIndex: '0',
                    onClick: this._onLogOutClick
                },
                'Log out'
            ));
        }

        return React.createElement(
            'nav',
            { className: 'navigation' },
            React.createElement(
                'h1',
                { className: 'logo' },
                React.createElement(
                    'span',
                    { className: 'logo__name' },
                    'VOLTTRON'
                ),
                React.createElement(
                    'span',
                    { className: 'logo__tm' },
                    '™'
                ),
                React.createElement(
                    'span',
                    { className: 'logo__central' },
                    ' Central'
                ),
                React.createElement(
                    'span',
                    { className: 'logo__beta' },
                    'BETA'
                ),
                React.createElement(
                    'span',
                    { className: 'logo__funding' },
                    'Funded by DOE EERE BTO'
                )
            ),
            navItems
        );
    }
});

function getStateFromStores() {
    return {
        loggedIn: !!authorizationStore.getAuthorization()
    };
}

module.exports = Navigation;

},{"../action-creators/platform-manager-action-creators":8,"../action-creators/platforms-panel-action-creators":9,"../stores/authorization-store":56,"react":undefined,"react-router":undefined}],35:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');
var platformChartActionCreators = require('../action-creators/platform-chart-action-creators');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var chartStore = require('../stores/platform-chart-store');
var ComboBox = require('./combo-box');

var NewChartForm = React.createClass({
    displayName: 'NewChartForm',

    getInitialState: function getInitialState() {
        var state = {};

        state.refreshInterval = 15000;

        state.topics = chartStore.getChartTopics();

        state.selectedTopic = "";

        return state;
    },
    componentDidMount: function componentDidMount() {
        chartStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        chartStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState({ topics: chartStore.getChartTopics() });
    },
    _onPropChange: function _onPropChange(e) {
        var state = {};

        for (key in this.state) {
            state[key] = this.state[key];
        }

        var key = e.target.id;

        switch (e.target.type) {
            case 'checkbox':
                state[key] = e.target.checked;
                break;
            case 'number':
                state[key] = parseFloat(e.target.value);
                break;
            default:
                state[key] = e.target.value;
        }

        this.setState(state);
    },
    _onTopicChange: function _onTopicChange(value) {
        this.setState({ selectedTopic: value });
    },
    _onCancelClick: function _onCancelClick() {
        modalActionCreators.closeModal();
    },
    _onSubmit: function _onSubmit(e) {

        e.preventDefault();

        var selectedTopic = this.state.topics.find(function (topic) {
            return topic.value === this.state.selectedTopic;
        }, this);

        if (selectedTopic) {
            selectedTopic.uuid = selectedTopic.value;
            selectedTopic.topic = selectedTopic.value;
            selectedTopic.pinned = this.state.pin ? true : false;
            selectedTopic.refreshInterval = this.state.refreshInterval;
            selectedTopic.chartType = this.state.chartType;
            selectedTopic.path = platformsPanelItemsStore.findTopicInTree(selectedTopic.topic);
            selectedTopic.max = this.state.max;
            selectedTopic.min = this.state.min;

            if (selectedTopic.path && selectedTopic.path.length > 1) {
                selectedTopic.parentUuid = selectedTopic.path[selectedTopic.path.length - 2];
            }
        }

        var notifyRouter = false;

        platformChartActionCreators.addToChart(selectedTopic, notifyRouter);

        if (selectedTopic.path) {
            platformsPanelActionCreators.checkItem(selectedTopic.path, true);
        }

        modalActionCreators.closeModal();
    },
    render: function render() {
        var topicsSelector;

        if (this.state.topics.length) {
            topicsSelector = React.createElement(ComboBox, { items: this.state.topics, itemskey: 'key', itemsvalue: 'value', itemslabel: 'label', onselect: this._onTopicChange });
        } else {
            topicsSelector = React.createElement(
                'div',
                null,
                'Loading topics ...'
            );
        }

        return React.createElement(
            'form',
            { className: 'edit-chart-form', onSubmit: this._onSubmit },
            React.createElement(
                'h1',
                null,
                'Add Chart'
            ),
            this.state.error && React.createElement(
                'div',
                { className: 'error' },
                this.state.error.message
            ),
            React.createElement(
                'div',
                { className: 'form__control-group' },
                React.createElement(
                    'label',
                    { htmlFor: 'topic' },
                    'Topics'
                ),
                topicsSelector
            ),
            React.createElement(
                'div',
                { className: 'form__control-group' },
                React.createElement(
                    'label',
                    null,
                    'Dashboard'
                ),
                React.createElement('input', {
                    className: 'form__control form__control--inline',
                    type: 'checkbox',
                    id: 'pin',
                    onChange: this._onPropChange,
                    checked: this.state.pin
                }),
                ' ',
                React.createElement(
                    'label',
                    { htmlFor: 'pin' },
                    'Pin to dashboard'
                )
            ),
            React.createElement(
                'div',
                { className: 'form__control-group' },
                React.createElement(
                    'label',
                    { htmlFor: 'refreshInterval' },
                    'Refresh interval (ms)'
                ),
                React.createElement('input', {
                    className: 'form__control form__control--inline',
                    type: 'number',
                    id: 'refreshInterval',
                    onChange: this._onPropChange,
                    value: this.state.refreshInterval,
                    min: '250',
                    step: '1',
                    placeholder: 'disabled'
                }),
                React.createElement(
                    'span',
                    { className: 'form__control-help' },
                    'Omit to disable'
                )
            ),
            React.createElement(
                'div',
                { className: 'form__control-group' },
                React.createElement(
                    'label',
                    { htmlFor: 'chartType' },
                    'Chart type'
                ),
                React.createElement(
                    'select',
                    {
                        id: 'chartType',
                        onChange: this._onPropChange,
                        value: this.state.chartType,
                        autoFocus: true,
                        required: true
                    },
                    React.createElement(
                        'option',
                        { value: '' },
                        '-- Select type --'
                    ),
                    React.createElement(
                        'option',
                        { value: 'line' },
                        'Line'
                    ),
                    React.createElement(
                        'option',
                        { value: 'lineWithFocus' },
                        'Line with View Finder'
                    ),
                    React.createElement(
                        'option',
                        { value: 'stackedArea' },
                        'Stacked Area'
                    ),
                    React.createElement(
                        'option',
                        { value: 'cumulativeLine' },
                        'Cumulative Line'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'form__control-group' },
                React.createElement(
                    'label',
                    null,
                    'Y-axis range'
                ),
                React.createElement(
                    'label',
                    { htmlFor: 'min' },
                    'Min:'
                ),
                ' ',
                React.createElement('input', {
                    className: 'form__control form__control--inline',
                    type: 'number',
                    id: 'min',
                    onChange: this._onPropChange,
                    value: this.state.min,
                    placeholder: 'auto'
                }),
                ' ',
                React.createElement(
                    'label',
                    { htmlFor: 'max' },
                    'Max:'
                ),
                ' ',
                React.createElement('input', {
                    className: 'form__control form__control--inline',
                    type: 'number',
                    id: 'max',
                    onChange: this._onPropChange,
                    value: this.state.max,
                    placeholder: 'auto'
                }),
                React.createElement('br', null),
                React.createElement(
                    'span',
                    { className: 'form__control-help' },
                    'Omit either to determine from data'
                )
            ),
            React.createElement(
                'div',
                { className: 'form__actions' },
                React.createElement(
                    'button',
                    {
                        className: 'button button--secondary',
                        type: 'button',
                        onClick: this._onCancelClick
                    },
                    'Cancel'
                ),
                React.createElement(
                    'button',
                    {
                        className: 'button',
                        disabled: !this.state.selectedTopic || !this.state.chartType
                    },
                    'Load Chart'
                )
            )
        );
    }
});

module.exports = NewChartForm;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-action-creators":6,"../action-creators/platform-chart-action-creators":7,"../action-creators/platforms-panel-action-creators":9,"../stores/platform-chart-store":61,"../stores/platforms-panel-items-store":62,"./combo-box":13,"react":undefined}],36:[function(require,module,exports){
'use strict';

var React = require('react');

var PageNotFound = React.createClass({
    displayName: 'PageNotFound',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'h2',
                null,
                'Page not found'
            )
        );
    }
});

module.exports = PageNotFound;

},{"react":undefined}],37:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var d3 = require('d3');
var nv = require('nvd3');
var moment = require('moment');
var OutsideClick = require('react-click-outside');

var chartStore = require('../stores/platform-chart-store');
var platformChartStore = require('../stores/platform-chart-store');
var platformChartActionCreators = require('../action-creators/platform-chart-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');
var modalActionCreators = require('../action-creators/modal-action-creators');
var ConfirmForm = require('./confirm-form');
var ControlButton = require('./control-button');

var PlatformChart = React.createClass({
    displayName: 'PlatformChart',

    getInitialState: function getInitialState() {
        var state = {};

        state.refreshInterval = this.props.chart.refreshInterval;
        state.pinned = this.props.chart.pinned;

        state.refreshing = false;

        return state;
    },
    componentDidMount: function componentDidMount() {
        this._refreshChartTimeout = setTimeout(this._refreshChart, 0);
        platformChartStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        clearTimeout(this._refreshChartTimeout);
        platformChartStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {

        this.setState({ refreshing: false });

        if (this.props.chart.data.length > 0) {

            var refreshInterval = platformChartStore.getRefreshRate(this.props.chart.data[0].name);

            if (refreshInterval !== this.state.refreshInterval) {
                this.setState({ refreshInterval: refreshInterval });

                clearTimeout(this._refreshChartTimeout);
                this._refreshChartTimeout = setTimeout(this._refreshChart, refreshInterval);
            }
        }
    },
    _refreshChart: function _refreshChart() {

        if (this.props.hasOwnProperty("chart")) {
            this.setState({ refreshing: true });

            platformChartActionCreators.refreshChart(this.props.chart.series);

            if (this.state.refreshInterval) {
                this._refreshChartTimeout = setTimeout(this._refreshChart, this.state.refreshInterval);
            }
        }
    },
    _removeChart: function _removeChart() {

        var deleteChart = function deleteChart() {
            modalActionCreators.closeModal();

            this.props.chart.series.forEach(function (series) {
                if (series.hasOwnProperty("path")) {
                    platformsPanelActionCreators.checkItem(series.path, false);
                }
            });

            platformChartActionCreators.removeChart(this.props.chartKey);
            platformActionCreators.saveCharts();
        };

        modalActionCreators.openModal(React.createElement(ConfirmForm, {
            promptTitle: 'Delete chart',
            preText: 'Remove ',
            promptText: this.props.chartKey,
            postText: ' chart from here and from Dashboard?',
            confirmText: 'Delete',
            onConfirm: deleteChart.bind(this) }));
    },
    render: function render() {
        var chartData = this.props.chart;
        var platformChart;

        var removeButton;

        if (!this.props.hideControls) {
            removeButton = React.createElement(
                'div',
                { className: 'remove-chart',
                    onClick: this._removeChart },
                React.createElement('i', { className: 'fa fa-remove' })
            );
        }

        var refreshingIcon;

        if (this.state.refreshing) {
            refreshingIcon = React.createElement(
                'span',
                { className: 'refreshIcon' },
                React.createElement('i', { className: 'fa fa-refresh fa-spin fa-fw' })
            );
        }

        var containerStyle = {
            width: "100%",
            textAlign: "center"
        };

        var innerStyle = {
            width: (chartData.data[0].name.length > 10 ? chartData.data[0].name.length * 10 : 100) + "px",
            marginLeft: "auto",
            marginRight: "auto"
        };

        if (chartData) {
            if (chartData.data.length > 0) {
                platformChart = React.createElement(
                    'div',
                    { className: 'platform-chart with-3d-shadow with-transitions absolute_anchor' },
                    React.createElement(
                        'div',
                        { style: containerStyle },
                        React.createElement(
                            'div',
                            { className: 'absolute_anchor', style: innerStyle },
                            React.createElement(
                                'label',
                                { className: 'chart-title' },
                                chartData.data[0].name
                            ),
                            refreshingIcon
                        )
                    ),
                    removeButton,
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            { className: 'viz' },
                            chartData.data.length != 0 ? React.createElement(GraphLineChart, {
                                key: this.props.chartKey,
                                data: chartData.data,
                                name: this.props.chartKey,
                                hideControls: this.props.hideControls,
                                refreshInterval: this.props.chart.refreshInterval,
                                max: chartData.max,
                                min: chartData.min,
                                pinned: this.props.chart.pinned,
                                chartType: this.props.chart.type }) : null
                        ),
                        React.createElement('br', null)
                    )
                );
            }
        }

        return React.createElement(
            'div',
            null,
            platformChart
        );
    }
});

var GraphLineChart = OutsideClick(React.createClass({
    displayName: 'GraphLineChart',

    getInitialState: function getInitialState() {

        var pattern = /[!@#$%^&*()+\-=\[\]{};':"\\|, .<>\/?]/g;

        var state = {};

        state.chartName = this.props.name.replace(" / ", "_") + '_chart';
        state.chartName = state.chartName.replace(pattern, "_");
        state.lineChart = null;
        state.pinned = this.props.pinned;
        state.chartType = this.props.chartType;
        state.showTaptip = false;
        state.taptipX = 0;
        state.taptipY = 0;
        state.min = this.props.min ? this.props.min : d3.min(this.props.data, function (d) {
            return d["1"];
        });
        state.max = this.props.max ? this.props.max : d3.max(this.props.data, function (d) {
            return d["1"];
        });

        return state;
    },
    componentDidMount: function componentDidMount() {
        platformChartStore.addChangeListener(this._onStoresChange);
        var lineChart = this._drawLineChart(this.state.chartName, this.state.chartType, this._lineData(this._getNested(this.props.data)), this.state.min, this.state.max);
        this.setState({ lineChart: lineChart });

        this.chart = ReactDOM.findDOMNode(this.refs[this.state.chartName]);
    },
    componentWillUnmount: function componentWillUnmount() {
        platformChartStore.removeChangeListener(this._onStoresChange);
        if (this.lineChart) {
            delete this.lineChart;
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        if (this.state.lineChart) {
            this._updateLineChart(this.state.lineChart, this.state.chartName, this._lineData(this._getNested(this.props.data)));
        }
    },
    _onStoresChange: function _onStoresChange() {
        this.setState({ pinned: platformChartStore.getPinned(this.props.name) });
        this.setState({ chartType: platformChartStore.getType(this.props.name) });

        var min = platformChartStore.getMin(this.props.name);
        var max = platformChartStore.getMax(this.props.name);

        this.setState({ min: min ? min : d3.min(this.props.data, function (d) {
                return d["1"];
            }) });
        this.setState({ max: max ? max : d3.max(this.props.data, function (d) {
                return d["1"];
            }) });
    },
    handleClickOutside: function handleClickOutside() {

        if (this.chart) {
            this.nvtooltip = this.chart.querySelector(".nvtooltip");

            if (this.nvtooltip) {
                this.nvtooltip.style.opacity = 0;
            }
        }
    },
    _onChartChange: function _onChartChange(e) {
        var chartType = e.target.value;

        var lineChart = this._drawLineChart(this.state.chartName, chartType, this._lineData(this._getNested(this.props.data)), this.state.min, this.state.max);

        this.setState({ lineChart: lineChart });
        this.setState({ showTaptip: false });

        platformChartActionCreators.setType(this.props.name, chartType);

        if (this.state.pinned) {
            platformActionCreators.saveCharts();
        }
    },
    _onPinToggle: function _onPinToggle() {

        var pinned = !this.state.pinned;

        platformChartActionCreators.pinChart(this.props.name);

        platformActionCreators.saveCharts();
    },
    _onRefreshChange: function _onRefreshChange(e) {
        platformChartActionCreators.changeRefreshRate(e.target.value, this.props.name);

        if (this.state.pinned) {
            platformActionCreators.saveCharts();
        }
    },
    _onMinChange: function _onMinChange(e) {
        var min = e.target.value;
        var lineChart = this._drawLineChart(this.state.chartName, this.state.chartType, this._lineData(this._getNested(this.props.data)), min, this.state.max);

        this.setState({ lineChart: lineChart });

        platformChartActionCreators.setMin(min, this.props.name);

        if (this.state.pinned) {
            platformActionCreators.saveCharts();
        }
    },
    _onMaxChange: function _onMaxChange(e) {
        var max = e.target.value;
        var lineChart = this._drawLineChart(this.state.chartName, this.state.chartType, this._lineData(this._getNested(this.props.data)), this.state.min, max);

        this.setState({ lineChart: lineChart });

        platformChartActionCreators.setMax(max, this.props.name);

        if (this.state.pinned) {
            platformActionCreators.saveCharts();
        }
    },
    render: function render() {

        var chartStyle = {
            width: "90%"
        };

        var svgStyle = {
            padding: "0px 50px"
        };

        var controlStyle = {
            width: "100%",
            textAlign: "left"
        };

        var pinClasses = ["chart-pin inlineBlock"];
        pinClasses.push(this.state.pinned ? "pinned-chart" : "unpinned-chart");

        var controlButtons;

        if (!this.props.hideControls) {
            var taptipX = 0;
            var taptipY = 40;

            var tooltipX = 0;
            var tooltipY = 80;

            var chartTypeSelect = React.createElement(
                'select',
                {
                    onChange: this._onChartChange,
                    value: this.state.chartType,
                    autoFocus: true,
                    required: true
                },
                React.createElement(
                    'option',
                    { value: 'line' },
                    'Line'
                ),
                React.createElement(
                    'option',
                    { value: 'lineWithFocus' },
                    'Line with View Finder'
                ),
                React.createElement(
                    'option',
                    { value: 'stackedArea' },
                    'Stacked Area'
                ),
                React.createElement(
                    'option',
                    { value: 'cumulativeLine' },
                    'Cumulative Line'
                )
            );

            var chartTypeTaptip = {
                "title": "Chart Type",
                "content": chartTypeSelect,
                "x": taptipX,
                "y": taptipY
            };
            var chartTypeIcon = React.createElement('i', { className: 'fa fa-line-chart' });
            var chartTypeTooltip = {
                "content": "Chart Type",
                "x": tooltipX,
                "y": tooltipY
            };

            var chartTypeControlButton = React.createElement(ControlButton, {
                name: this.state.chartName + "_chartTypeControlButton",
                taptip: chartTypeTaptip,
                tooltip: chartTypeTooltip,
                icon: chartTypeIcon });

            var pinChartIcon = React.createElement(
                'div',
                { className: pinClasses.join(' ') },
                React.createElement('i', { className: 'fa fa-thumb-tack' })
            );
            var pinChartTooltip = {
                "content": "Pin to Dashboard",
                "x": tooltipX,
                "y": tooltipY
            };

            var pinChartControlButton = React.createElement(ControlButton, {
                name: this.state.chartName + "_pinChartControlButton",
                icon: pinChartIcon,
                tooltip: pinChartTooltip,
                clickAction: this._onPinToggle });

            var refreshChart = React.createElement(
                'div',
                null,
                React.createElement('input', {
                    type: 'number',
                    onChange: this._onRefreshChange,
                    value: this.props.refreshInterval,
                    min: '15000',
                    step: '1000',
                    placeholder: 'disabled'
                }),
                ' (ms)',
                React.createElement('br', null),
                React.createElement(
                    'span',
                    null,
                    'Omit to disable'
                )
            );

            var refreshChartTaptip = {
                "title": "Refresh Rate",
                "content": refreshChart,
                "x": taptipX,
                "y": taptipY
            };
            var refreshChartIcon = React.createElement('i', { className: 'fa fa-hourglass' });
            var refreshChartTooltip = {
                "content": "Refresh Rate",
                "x": tooltipX,
                "y": tooltipY
            };

            var refreshChartControlButton = React.createElement(ControlButton, {
                name: this.state.chartName + "_refreshChartControlButton",
                taptip: refreshChartTaptip,
                tooltip: refreshChartTooltip,
                icon: refreshChartIcon });

            var chartMin = React.createElement(
                'div',
                null,
                React.createElement('input', {
                    type: 'number',
                    onChange: this._onMinChange,
                    value: this.state.min,
                    step: '1'
                })
            );

            var chartMinTaptip = {
                "title": "Y Axis Min",
                "content": chartMin,
                "x": taptipX,
                "y": taptipY
            };
            var chartMinIcon = React.createElement(
                'div',
                { className: 'moveMin' },
                React.createElement(
                    'span',
                    null,
                    '▬'
                )
            );

            tooltipX = tooltipX + 20;

            var chartMinTooltip = {
                "content": "Y Axis Min",
                "x": tooltipX,
                "y": tooltipY
            };

            var chartMinControlButton = React.createElement(ControlButton, {
                name: this.state.chartName + "_chartMinControlButton",
                taptip: chartMinTaptip,
                tooltip: chartMinTooltip,
                icon: chartMinIcon });

            var chartMax = React.createElement(
                'div',
                null,
                React.createElement('input', {
                    type: 'number',
                    onChange: this._onMaxChange,
                    value: this.state.max,
                    step: '1'
                })
            );

            var chartMaxTaptip = {
                "title": "Y Axis Max",
                "content": chartMax,
                "x": taptipX,
                "y": taptipY
            };
            var chartMaxIcon = React.createElement(
                'div',
                { className: 'moveMax' },
                React.createElement(
                    'span',
                    null,
                    '▬'
                )
            );

            tooltipX = tooltipX + 20;

            var chartMaxTooltip = {
                "content": "Y Axis Max",
                "x": tooltipX,
                "y": tooltipY
            };

            var chartMaxControlButton = React.createElement(ControlButton, {
                name: this.state.chartName + "_chartMaxControlButton",
                taptip: chartMaxTaptip,
                tooltip: chartMaxTooltip,
                icon: chartMaxIcon });

            var spaceStyle = {
                width: "20px",
                height: "2px"
            };

            controlButtons = React.createElement(
                'div',
                { className: 'displayBlock',
                    style: controlStyle },
                pinChartControlButton,
                chartTypeControlButton,
                refreshChartControlButton,
                chartMinControlButton,
                chartMaxControlButton,
                React.createElement('div', { className: 'inlineBlock',
                    style: spaceStyle })
            );
        }

        return React.createElement(
            'div',
            { className: 'platform-line-chart',
                style: chartStyle,
                ref: this.state.chartName },
            React.createElement('svg', { id: this.state.chartName, style: svgStyle }),
            controlButtons
        );
    },
    _drawLineChart: function _drawLineChart(elementParent, chartType, data, yMin, yMax) {

        var tickCount = 0;
        // var lineChart;

        switch (chartType) {
            case "line":
                this.lineChart = nv.models.lineChart();
                break;
            case "lineWithFocus":
                this.lineChart = nv.models.lineWithFocusChart();
                break;
            case "stackedArea":
                this.lineChart = nv.models.stackedAreaChart();
                break;
            case "cumulativeLine":
                this.lineChart = nv.models.cumulativeLineChart();
                break;
        }

        this.lineChart.margin({ left: 25, right: 25 }).x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).useInteractiveGuideline(true).showYAxis(true).showXAxis(true);
        this.lineChart.xAxis.tickFormat(function (d, i) {

            var tickValue;

            if (typeof i === "undefined") {
                if (tickCount === 0) {
                    tickValue = moment(d).fromNow();
                    tickCount++;
                } else if (tickCount === 1) {
                    tickValue = moment(d).fromNow();
                    tickCount = 0;
                }
            } else {
                tickValue = "";
            }

            return tickValue;
        }).staggerLabels(false);
        this.lineChart.yAxis.tickFormat(d3.format('.1f'));
        this.lineChart.forceY([yMin, yMax]);

        switch (chartType) {
            case "lineWithFocus":
                this.lineChart.x2Axis.tickFormat(function (d) {
                    return d3.time.format('%X')(new Date(d));
                });
                break;
        }

        d3.selectAll('#' + elementParent + ' > *').remove();
        d3.select('#' + elementParent).datum(data).call(this.lineChart);
        nv.utils.windowResize(function () {
            if (this.lineChart) {
                this.lineChart.update();
            }
        });

        nv.addGraph(function () {
            return this.lineChart;
        });

        return this.lineChart;
    },
    _updateLineChart: function _updateLineChart(lineChart, elementParent, data) {
        d3.select('#' + elementParent).datum(data).call(lineChart);
    },
    _getNested: function _getNested(data) {
        var keyYearMonth = d3.nest().key(function (d) {
            return d.parent;
        }).key(function (d) {
            return d["0"];
        });
        var keyedData = keyYearMonth.entries(data.map(function (d) {
            return d;
        }));
        return keyedData;
    },
    _lineData: function _lineData(data) {
        var colors = ['DarkOrange', 'ForestGreen', 'DeepPink', 'DarkViolet', 'Teal', 'Maroon', 'RoyalBlue', 'Silver', 'MediumPurple', 'Red', 'Lime', 'Tan', 'LightGoldenrodYellow', 'Turquoise', 'Pink', 'DeepSkyBlue', 'OrangeRed', 'LightGrey', 'Olive'];
        data = data.sort(function (a, b) {
            return a.key > b.key;
        });
        var lineDataArr = [];
        for (var i = 0; i <= data.length - 1; i++) {
            var lineDataElement = [];
            var currentValues = data[i].values.sort(function (a, b) {
                return +a.key - +b.key;
            });
            for (var j = 0; j <= currentValues.length - 1; j++) {
                lineDataElement.push({
                    'x': +currentValues[j].key,
                    'y': +currentValues[j].values[0][1]
                });
            }
            lineDataArr.push({
                key: data[i].key,
                color: colors[i],
                values: lineDataElement
            });
        }
        return lineDataArr;
    }

}));

module.exports = PlatformChart;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-action-creators":6,"../action-creators/platform-chart-action-creators":7,"../action-creators/platforms-panel-action-creators":9,"../stores/platform-chart-store":61,"./confirm-form":18,"./control-button":20,"d3":undefined,"moment":undefined,"nvd3":undefined,"react":undefined,"react-click-outside":undefined,"react-dom":undefined,"react-router":undefined}],38:[function(require,module,exports){
'use strict';

var React = require('react');
var PlatformChart = require('./platform-chart');
var modalActionCreators = require('../action-creators/modal-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');
var NewChartForm = require('./new-chart-form');
var chartStore = require('../stores/platform-chart-store');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');

var PlatformCharts = React.createClass({
    displayName: 'PlatformCharts',

    getInitialState: function getInitialState() {

        var state = {
            chartData: chartStore.getData()
        };

        return state;
    },
    componentDidMount: function componentDidMount() {
        chartStore.addChangeListener(this._onChartStoreChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        chartStore.removeChangeListener(this._onChartStoreChange);
    },
    _onChartStoreChange: function _onChartStoreChange() {
        this.setState({ chartData: chartStore.getData() });
    },
    _onAddChartClick: function _onAddChartClick() {

        platformActionCreators.loadChartTopics();
        modalActionCreators.openModal(React.createElement(NewChartForm, null));
    },
    render: function render() {

        var chartData = this.state.chartData;

        var platformCharts = [];

        for (var key in chartData) {
            if (chartData[key].data.length > 0) {
                var platformChart = React.createElement(PlatformChart, { key: key,
                    chart: chartData[key],
                    chartKey: key,
                    hideControls: false });
                platformCharts.push(platformChart);
            }
        }

        if (platformCharts.length === 0) {
            var noCharts = React.createElement(
                'p',
                { className: 'empty-help' },
                'No charts have been loaded.'
            );
            platformCharts.push(noCharts);
        }

        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'div',
                { className: 'absolute_anchor' },
                React.createElement(
                    'div',
                    { className: 'view__actions' },
                    React.createElement(
                        'button',
                        {
                            className: 'button',
                            onClick: this._onAddChartClick
                        },
                        'Add Chart'
                    )
                ),
                React.createElement(
                    'h2',
                    null,
                    'Charts'
                ),
                platformCharts
            )
        );
    }
});

module.exports = PlatformCharts;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-action-creators":6,"../action-creators/platform-manager-action-creators":8,"../action-creators/status-indicator-action-creators":10,"../stores/platform-chart-store":61,"./new-chart-form":35,"./platform-chart":37,"react":undefined}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');

var ReactDOM = require('react-dom');
var Router = require('react-router');

var authorizationStore = require('../stores/authorization-store');
var Console = require('./console');
var consoleActionCreators = require('../action-creators/console-action-creators');
var consoleStore = require('../stores/console-store');
var Modal = require('./modal');
var modalActionCreators = require('../action-creators/modal-action-creators');
var modalStore = require('../stores/modal-store');
var Navigation = require('./navigation');
var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');
var PlatformsPanel = require('./platforms-panel');
var platformsPanelStore = require('../stores/platforms-panel-store');
var StatusIndicator = require('./status-indicator');
var statusIndicatorStore = require('../stores/status-indicator-store');
var platformsStore = require('../stores/platforms-store');

var PlatformManager = function (_React$Component) {
    _inherits(PlatformManager, _React$Component);

    function PlatformManager(props) {
        _classCallCheck(this, PlatformManager);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlatformManager).call(this, props));

        _this._doModalBindings = _this._doModalBindings.bind(_this);
        _this._onStoreChange = _this._onStoreChange.bind(_this);

        _this.state = getStateFromStores();
        return _this;
    }

    _createClass(PlatformManager, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (!this.state.initialized) {
                platformManagerActionCreators.initialize();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            authorizationStore.addChangeListener(this._onStoreChange);
            consoleStore.addChangeListener(this._onStoreChange);
            modalStore.addChangeListener(this._onStoreChange);
            platformsPanelStore.addChangeListener(this._onStoreChange);
            platformsStore.addChangeListener(this._onStoreChange);
            statusIndicatorStore.addChangeListener(this._onStoreChange);
            this._doModalBindings();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this._doModalBindings();

            if (this.state.expanded) {
                var handle = document.querySelector(".resize-handle");

                var onMouseDown = function onMouseDown(evt) {
                    var exteriorPanel = this.parentNode;
                    var children = exteriorPanel.parentNode.childNodes;
                    var platformsPanel;

                    for (var i = 0; i < children.length; i++) {
                        if (children[i].classList.contains("platform-statuses")) {
                            platformsPanel = children[i];
                            break;
                        }
                    }

                    var target = evt.target.setCapture ? evt.target : document;

                    if (target.setCapture) {
                        target.setCapture();
                    }

                    var onMouseMove = function onMouseMove(evt) {
                        var newWidth = Math.min(window.innerWidth, evt.clientX);

                        platformsPanel.style.width = newWidth + "px";
                        exteriorPanel.style.width = window.innerWidth - newWidth - 100 + "px";
                    };

                    var onMouseUp = function onMouseUp(evt) {
                        target.removeEventListener("mousemove", onMouseMove);
                        target.removeEventListener("mouseup", onMouseUp);
                    };

                    target.addEventListener("mousemove", onMouseMove);
                    target.addEventListener("mouseup", onMouseUp);

                    evt.preventDefault();
                };

                handle.addEventListener("mousedown", onMouseDown);
            }
        }
    }, {
        key: '_doModalBindings',
        value: function _doModalBindings() {
            if (this.state.modalContent) {
                window.addEventListener('keydown', this._closeModal);
                this._focusDisabled = $('input,select,textarea,button,a', ReactDOM.findDOMNode(this.refs.main)).attr('tabIndex', -1);
            } else {
                window.removeEventListener('keydown', this._closeModal);
                if (this._focusDisabled) {
                    this._focusDisabled.removeAttr('tabIndex');
                    delete this._focusDisabled;
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            authorizationStore.removeChangeListener(this._onStoreChange);
            consoleStore.removeChangeListener(this._onStoreChange);
            modalStore.removeChangeListener(this._onStoreChange);
            platformsPanelStore.removeChangeListener(this._onStoreChange);
            platformsStore.removeChangeListener(this._onStoreChange);
            statusIndicatorStore.removeChangeListener(this._onStoreChange);
        }
    }, {
        key: '_onStoreChange',
        value: function _onStoreChange() {
            this.setState(getStateFromStores());
        }
    }, {
        key: '_onToggleClick',
        value: function _onToggleClick() {
            consoleActionCreators.toggleConsole();
        }
    }, {
        key: '_closeModal',
        value: function _closeModal(e) {
            if (e.keyCode === 27) {
                modalActionCreators.closeModal();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var classes = ['platform-manager'];
            var modal;
            var exteriorClasses = ["panel-exterior"];

            if (this.state.expanded === true) {
                exteriorClasses.push("narrow-exterior");
                exteriorClasses.push("slow-narrow");
            } else if (this.state.expanded === false) {
                exteriorClasses.push("wide-exterior");
                exteriorClasses.push("slow-wide");
            } else if (this.state.expanded === null) {
                exteriorClasses.push("wide-exterior");
            }

            var statusIndicator;

            if (this.state.consoleShown) {
                classes.push('console-open');
            }

            classes.push(this.state.loggedIn ? 'logged-in' : 'not-logged-in');

            if (this.state.modalContent) {
                classes.push('modal-open');
                modal = _react2.default.createElement(
                    Modal,
                    null,
                    this.state.modalContent
                );
            }

            if (this.state.status) {
                statusIndicator = _react2.default.createElement(StatusIndicator, null);
            }

            var resizeHandle;

            if (this.state.expanded === true) {
                resizeHandle = _react2.default.createElement('div', { className: 'resize-handle' });

                exteriorClasses.push("absolute_anchor");
            }

            return _react2.default.createElement(
                'div',
                { className: classes.join(' ') },
                statusIndicator,
                modal,
                _react2.default.createElement(
                    'div',
                    { ref: 'main', className: 'main' },
                    _react2.default.createElement(Navigation, null),
                    _react2.default.createElement(PlatformsPanel, null),
                    _react2.default.createElement(
                        'div',
                        { className: exteriorClasses.join(' ') },
                        resizeHandle,
                        this.props.children
                    )
                ),
                _react2.default.createElement('input', {
                    className: 'toggle',
                    type: 'button',
                    value: 'Console ' + (this.state.consoleShown ? '▼' : '▲'),
                    onClick: this._onToggleClick
                }),
                this.state.consoleShown && _react2.default.createElement(Console, { className: 'console' })
            );
        }
    }]);

    return PlatformManager;
}(_react2.default.Component);

function getStateFromStores() {
    return {
        consoleShown: consoleStore.getConsoleShown(),
        loggedIn: !!authorizationStore.getAuthorization(),
        modalContent: modalStore.getModalContent(),
        expanded: platformsPanelStore.getExpanded(),
        status: statusIndicatorStore.getStatus(),
        initialized: platformsStore.getInitialized()
    };
}

exports.default = PlatformManager;

},{"../action-creators/console-action-creators":2,"../action-creators/modal-action-creators":5,"../action-creators/platform-manager-action-creators":8,"../stores/authorization-store":56,"../stores/console-store":57,"../stores/modal-store":60,"../stores/platforms-panel-store":63,"../stores/platforms-store":64,"../stores/status-indicator-store":65,"./console":19,"./modal":33,"./navigation":34,"./platforms-panel":42,"./status-indicator":46,"jquery":undefined,"react":undefined,"react-dom":undefined,"react-router":undefined}],40:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var AgentRow = require('./agent-row');
var platformActionCreators = require('../action-creators/platform-action-creators');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var platformsStore = require('../stores/platforms-store');

var Platform = React.createClass({
    displayName: 'Platform',

    mixins: [Router.State],
    getInitialState: function getInitialState() {
        return getStateFromStores(this);
    },
    componentDidMount: function componentDidMount() {
        platformsStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        platformsStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState(getStateFromStores(this));
    },
    _onFileChange: function _onFileChange(e) {
        if (!e.target.files.length) {
            return;
        }

        var reader = new FileReader();
        var platform = this.state.platform;
        var files = e.target.files;
        var parsedFiles = [];

        function doFile(index) {
            if (index === files.length) {
                platformActionCreators.installAgents(platform, parsedFiles);
                return;
            }

            reader.onload = function () {
                parsedFiles.push({
                    file_name: files[index].name,
                    file: reader.result
                });
                doFile(index + 1);
            };

            reader.readAsDataURL(files[index]);
        }

        doFile(0);
    },
    render: function render() {
        var platform = this.state.platform;

        if (!platform) {
            return React.createElement(
                'div',
                { className: 'view' },
                React.createElement(
                    'h2',
                    null,
                    React.createElement(
                        Router.Link,
                        { to: 'platforms' },
                        'Platforms'
                    ),
                    ' / ',
                    this.props.params.uuid
                ),
                React.createElement(
                    'p',
                    null,
                    'Platform not found.'
                )
            );
        }

        var agents;

        if (!platform.agents) {
            agents = React.createElement(
                'p',
                null,
                'Loading agents...'
            );
        } else if (!platform.agents.length) {
            agents = React.createElement(
                'p',
                null,
                'No agents installed.'
            );
        } else {
            agents = React.createElement(
                'table',
                null,
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            'Name'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'UUID'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Status'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Action'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    platform.agents.sort(function (a, b) {
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        return 0;
                    }).map(function (agent) {
                        return React.createElement(AgentRow, {
                            key: agent.uuid,
                            platform: platform,
                            agent: agent });
                    })
                )
            );
        }

        return React.createElement(
            'div',
            { className: 'platform-view' },
            React.createElement(
                'h2',
                null,
                React.createElement(
                    Router.Link,
                    { to: 'platforms' },
                    'Platforms'
                ),
                ' / ',
                platform.name,
                ' (',
                platform.uuid,
                ')'
            ),
            React.createElement('br', null),
            React.createElement('br', null),
            React.createElement(
                'h3',
                null,
                'Agents'
            ),
            React.createElement(
                'div',
                { className: 'agents-container' },
                agents
            ),
            React.createElement(
                'h3',
                null,
                'Install agents'
            ),
            React.createElement('input', { type: 'file', multiple: true, onChange: this._onFileChange })
        );
    }
});

function getStateFromStores(component) {

    return {
        platform: platformsStore.getPlatform(component.props.params.uuid)
    };
}

module.exports = Platform;

},{"../action-creators/platform-action-creators":6,"../action-creators/status-indicator-action-creators":10,"../stores/platforms-store":64,"./agent-row":11,"react":undefined,"react-router":undefined}],41:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');
var platformChartActionCreators = require('../action-creators/platform-chart-action-creators');
var controlButtonActionCreators = require('../action-creators/control-button-action-creators');
var devicesActionCreators = require('../action-creators/devices-action-creators');
var ControlButton = require('./control-button');

var PlatformsPanelItem = React.createClass({
    displayName: 'PlatformsPanelItem',

    getInitialState: function getInitialState() {
        var state = {};

        state.showTooltip = false;
        state.tooltipX = null;
        state.tooltipY = null;
        state.checked = this.props.panelItem.hasOwnProperty("checked") ? this.props.panelItem.checked : false;
        state.panelItem = this.props.panelItem;
        state.children = this.props.panelChildren;

        if (this.props.panelItem.type === "platform") {
            state.notInitialized = true;
            state.loading = false;
            state.cancelButton = false;
        }

        return state;
    },
    componentDidMount: function componentDidMount() {
        platformsPanelItemsStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        platformsPanelItemsStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {

        var panelItem = platformsPanelItemsStore.getItem(this.props.itemPath);
        var panelChildren = platformsPanelItemsStore.getChildren(this.props.panelItem, this.props.itemPath);

        var loadingComplete = platformsPanelItemsStore.getLoadingComplete(this.props.panelItem);

        if (loadingComplete === true || loadingComplete === null) {
            this.setState({ panelItem: panelItem });
            this.setState({ children: panelChildren });
            this.setState({ checked: panelItem.checked });

            if (this.props.panelItem.type === "platform") {
                if (loadingComplete === true) {
                    this.setState({ loading: false });
                    this.setState({ notInitialized: false });
                } else if (loadingComplete === null) {
                    this.setState({ loading: false });
                    this.setState({ notInitialized: true });
                }
            }
        }
    },
    _expandAll: function _expandAll() {

        platformsPanelActionCreators.expandAll(this.props.itemPath);
    },
    _handleArrowClick: function _handleArrowClick() {

        if (!this.state.loading) // If not loading, treat it as just a regular toggle button
            {
                if (this.state.panelItem.expanded === null && this.state.panelItem.type === "platform") {
                    this.setState({ loading: true });
                    platformsPanelActionCreators.loadChildren(this.props.panelItem.type, this.props.panelItem);
                } else {
                    if (this.state.panelItem.expanded) {
                        platformsPanelActionCreators.expandAll(this.props.itemPath);
                    } else {
                        platformsPanelActionCreators.toggleItem(this.props.itemPath);
                    }
                }
            } else if (this.state.hasOwnProperty("loading")) // it's a platform and it's loading
            {
                if (this.state.loading || this.state.cancelButton) // if either loading or cancelButton is still
                    {
                        // true, either way, the user wants to 
                        this.setState({ loading: false }); // get out of the loading state, so turn
                        this.setState({ cancelButton: false }); // the toggle button back to an arrow icon
                    }
            }
    },
    _showCancel: function _showCancel() {

        if (this.state.hasOwnProperty("loading") && this.state.loading === true) {
            this.setState({ cancelButton: true });
        }
    },
    _resumeLoad: function _resumeLoad() {

        if (this.state.hasOwnProperty("loading")) {
            this.setState({ cancelButton: false });
        }
    },
    _checkItem: function _checkItem(e) {

        var checked = e.target.checked;

        if (checked) {
            this.setState({ checked: null });
            platformChartActionCreators.addToChart(this.props.panelItem);
        } else {
            this.setState({ checked: null });
            platformChartActionCreators.removeFromChart(this.props.panelItem);
        }
    },
    _showTooltip: function _showTooltip(evt) {
        this.setState({ showTooltip: true });
        this.setState({ tooltipX: evt.clientX - 60 });
        this.setState({ tooltipY: evt.clientY - 70 });
    },
    _hideTooltip: function _hideTooltip() {
        this.setState({ showTooltip: false });
    },
    _moveTooltip: function _moveTooltip(evt) {
        this.setState({ tooltipX: evt.clientX - 60 });
        this.setState({ tooltipY: evt.clientY - 70 });
    },
    _onAddDevices: function _onAddDevices(evt) {
        devicesActionCreators.configureDevices(this.state.panelItem);
    },
    _onDeviceMethodChange: function _onDeviceMethodChange(evt) {

        var deviceMethod = evt.target.value;

        this.setState({ deviceMethod: deviceMethod });

        if (deviceMethod) {
            devicesActionCreators.addDevices(this.state.panelItem, deviceMethod);
            controlButtonActionCreators.hideTaptip("addDevicesButton");
        }
    },
    render: function render() {
        var panelItem = this.state.panelItem;
        var itemPath = this.props.itemPath;
        var propChildren = this.state.children;
        var children;

        var visibleStyle = {};

        if (panelItem.visible !== true) {
            visibleStyle = {
                display: "none"
            };
        }

        var childClass;
        var arrowClasses = ["arrowButton", "noRotate"];
        var arrowContent;
        var arrowContentStyle = {
            width: "14px"
        };

        if (this.state.hasOwnProperty("loading")) {
            if (this.state.cancelButton) {
                arrowClasses.push("cancelLoading");
            } else if (this.state.loading) {
                arrowClasses.push("loadingSpinner");
            }
        }

        var DevicesButton;

        if (["platform"].indexOf(panelItem.type) > -1) {
            var taptipX = 20;
            var taptipY = 100;

            var tooltipX = 20;
            var tooltipY = 70;

            var devicesSelect = React.createElement(
                'select',
                {
                    onChange: this._onDeviceMethodChange,
                    value: this.state.deviceMethod,
                    autoFocus: true,
                    required: true
                },
                React.createElement(
                    'option',
                    { value: '' },
                    '-- Select method --'
                ),
                React.createElement(
                    'option',
                    { value: 'scanForDevices' },
                    'Scan for Devices'
                ),
                React.createElement(
                    'option',
                    { value: 'addDevicesManually' },
                    'Add Manually'
                )
            );

            var devicesTaptip = {
                "title": "Add Devices",
                "content": devicesSelect,
                "xOffset": taptipX,
                "yOffset": taptipY
            };

            var devicesTooltip = {
                "content": "Add Devices",
                "xOffset": tooltipX,
                "yOffset": tooltipY
            };

            DevicesButton = React.createElement(ControlButton, {
                name: 'addDevicesButton',
                tooltip: devicesTooltip,
                controlclass: 'panelItemButton',
                nocentering: true,
                floatleft: true,
                fontAwesomeIcon: 'cogs',
                clickAction: this._onAddDevices });
        }

        var ChartCheckbox;

        if (["point"].indexOf(panelItem.type) > -1) {
            if (this.state.checked !== null) {
                ChartCheckbox = React.createElement('input', { className: 'panelItemCheckbox',
                    type: 'checkbox',
                    onChange: this._checkItem,
                    checked: this.state.checked });
            } else {
                ChartCheckbox = React.createElement(
                    'div',
                    { className: 'checkboxSpinner arrowButton' },
                    React.createElement(
                        'span',
                        { style: arrowContentStyle },
                        React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' })
                    )
                );
            }
        }

        var tooltipStyle = {
            display: panelItem.type !== "type" ? this.state.showTooltip ? "block" : "none" : "none",
            position: "absolute",
            top: this.state.tooltipY + "px",
            left: this.state.tooltipX + "px"
        };

        var toolTipClasses = this.state.showTooltip ? "tooltip_outer delayed-show-slow" : "tooltip_outer";

        if (!this.state.loading) {
            arrowClasses.push(panelItem.status === "GOOD" ? "status-good" : panelItem.status === "BAD" ? "status-bad" : "status-unknown");
        }

        if (this.state.cancelButton) {
            arrowContent = React.createElement(
                'span',
                { style: arrowContentStyle },
                React.createElement('i', { className: 'fa fa-remove' })
            );
        } else if (this.state.loading) {
            arrowContent = React.createElement(
                'span',
                { style: arrowContentStyle },
                React.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw' })
            );
        } else if (panelItem.status === "GOOD") {
            arrowContent = React.createElement(
                'span',
                { style: arrowContentStyle },
                '▶'
            );
        } else if (panelItem.status === "BAD") {
            arrowContent = React.createElement(
                'span',
                { style: arrowContentStyle },
                React.createElement('i', { className: 'fa fa-minus-circle' })
            );
        } else {
            arrowContent = React.createElement(
                'span',
                { style: arrowContentStyle },
                '▬'
            );
        }

        if (this.state.panelItem.expanded === true && propChildren) {
            children = propChildren.sort(function (a, b) {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1;
                }
                return 0;
            }).sort(function (a, b) {
                if (a.sortOrder > b.sortOrder) {
                    return 1;
                }
                if (a.sortOrder < b.sortOrder) {
                    return -1;
                }
                return 0;
            }).map(function (propChild) {

                var grandchildren = [];
                propChild.children.forEach(function (childString) {
                    grandchildren.push(propChild[childString]);
                });

                var itemKey = propChild.hasOwnProperty("uuid") ? propChild.uuid : propChild.name + this.uuid;

                return React.createElement(PlatformsPanelItem, { key: itemKey,
                    panelItem: propChild,
                    itemPath: propChild.path,
                    panelChildren: grandchildren });
            }, this.state.panelItem);

            if (children.length > 0) {
                var classIndex = arrowClasses.indexOf("noRotate");

                if (classIndex > -1) {
                    arrowClasses.splice(classIndex, 1);
                }

                arrowClasses.push("rotateDown");
                childClass = "showItems";
            }
        }

        var itemClasses = [];

        if (!panelItem.hasOwnProperty("uuid")) {
            itemClasses.push("item_type");
        } else {
            itemClasses.push("item_label");
        }

        if (panelItem.type === "platform" && this.state.notInitialized) {
            itemClasses.push("not_initialized");
        }

        var listItem = React.createElement(
            'div',
            { className: itemClasses.join(' ') },
            panelItem.name
        );

        return React.createElement(
            'li',
            {
                key: panelItem.uuid,
                className: 'panel-item',
                style: visibleStyle
            },
            React.createElement(
                'div',
                { className: 'platform-info' },
                React.createElement(
                    'div',
                    { className: arrowClasses.join(' '),
                        onDoubleClick: this._expandAll,
                        onClick: this._handleArrowClick,
                        onMouseEnter: this._showCancel,
                        onMouseLeave: this._resumeLoad },
                    arrowContent
                ),
                DevicesButton,
                ChartCheckbox,
                React.createElement(
                    'div',
                    { className: toolTipClasses,
                        style: tooltipStyle },
                    React.createElement(
                        'div',
                        { className: 'tooltip_inner' },
                        React.createElement(
                            'div',
                            { className: 'opaque_inner' },
                            panelItem.name,
                            ': ',
                            panelItem.context ? panelItem.context : panelItem.statusLabel
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'tooltip_target',
                        onMouseEnter: this._showTooltip,
                        onMouseLeave: this._hideTooltip,
                        onMouseMove: this._moveTooltip },
                    listItem
                )
            ),
            React.createElement(
                'div',
                { className: childClass },
                React.createElement(
                    'ul',
                    { className: 'platform-panel-list' },
                    children
                )
            )
        );
    }
});

module.exports = PlatformsPanelItem;

},{"../action-creators/control-button-action-creators":3,"../action-creators/devices-action-creators":4,"../action-creators/platform-chart-action-creators":7,"../action-creators/platforms-panel-action-creators":9,"../stores/platforms-panel-items-store":62,"./control-button":20,"react":undefined,"react-router":undefined}],42:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var platformsPanelStore = require('../stores/platforms-panel-store');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var platformsPanelActionCreators = require('../action-creators/platforms-panel-action-creators');
var PlatformsPanelItem = require('./platforms-panel-item');
var ControlButton = require('./control-button');

var PlatformsPanel = React.createClass({
    displayName: 'PlatformsPanel',

    getInitialState: function getInitialState() {
        var state = {};
        state.platforms = [];
        state.expanded = platformsPanelStore.getExpanded();
        state.filterValue = "";
        state.filterStatus = "";

        return state;
    },
    componentDidMount: function componentDidMount() {
        platformsPanelStore.addChangeListener(this._onPanelStoreChange);
        platformsPanelItemsStore.addChangeListener(this._onPanelItemsStoreChange);

        this.exteriorPanel = document.querySelector(".panel-exterior");
        var children = this.exteriorPanel.parentNode.childNodes;

        for (var i = 0; i < children.length; i++) {
            if (children[i].classList.contains("platform-statuses")) {
                this.platformsPanel = children[i];
                break;
            }
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        platformsPanelStore.removeChangeListener(this._onPanelStoreChange);
        platformsPanelItemsStore.removeChangeListener(this._onPanelItemsStoreChange);
    },
    _onPanelStoreChange: function _onPanelStoreChange() {
        var expanded = platformsPanelStore.getExpanded();

        if (expanded !== this.state.expanded) {
            this.setState({ expanded: expanded });
        }

        if (expanded !== null) {
            if (expanded === false) {
                this.platformsPanel.style.width = "";
                this.exteriorPanel.style.width = "";
            }

            var platformsList = platformsPanelItemsStore.getChildren("platforms", null);
            this.setState({ platforms: platformsList });
        } else {
            this.setState({ filterValue: "" });
            this.setState({ filterStatus: "" });
            this.platformsPanel.style.width = "";
            this.exteriorPanel.style.width = "";
        }
    },
    _onPanelItemsStoreChange: function _onPanelItemsStoreChange() {
        if (this.state.expanded !== null) {
            this.setState({ platforms: platformsPanelItemsStore.getChildren("platforms", null) });
        }
    },
    _onFilterBoxChange: function _onFilterBoxChange(e) {
        this.setState({ filterValue: e.target.value });
        platformsPanelActionCreators.loadFilteredItems(e.target.value, "");
        this.setState({ filterStatus: "" });
    },
    _onFilterGood: function _onFilterGood(e) {
        platformsPanelActionCreators.loadFilteredItems("", "GOOD");
        this.setState({ filterStatus: "GOOD" });
        this.setState({ filterValue: "" });
    },
    _onFilterBad: function _onFilterBad(e) {
        platformsPanelActionCreators.loadFilteredItems("", "BAD");
        this.setState({ filterStatus: "BAD" });
        this.setState({ filterValue: "" });
    },
    _onFilterUnknown: function _onFilterUnknown(e) {
        platformsPanelActionCreators.loadFilteredItems("", "UNKNOWN");
        this.setState({ filterStatus: "UNKNOWN" });
        this.setState({ filterValue: "" });
    },
    _onFilterOff: function _onFilterOff(e) {
        platformsPanelActionCreators.loadFilteredItems("", "");
        this.setState({ filterValue: "" });
        this.setState({ filterStatus: "" });
    },
    _togglePanel: function _togglePanel() {
        platformsPanelActionCreators.togglePanel();
    },
    render: function render() {
        var platforms;

        var classes = this.state.expanded === null ? ["platform-statuses", "platform-collapsed"] : this.state.expanded ? ["platform-statuses", "slow-open", "platform-expanded"] : ["platform-statuses", "slow-shut", "platform-collapsed"];

        var contentsStyle = {
            display: this.state.expanded ? "block" : "none",
            padding: "0px 0px 20px 10px",
            clear: "right",
            width: "100%"
        };

        var filterBoxContainer = {
            textAlign: "left"
        };

        var filterGood, filterBad, filterUnknown;
        filterGood = filterBad = filterUnknown = false;

        switch (this.state.filterStatus) {
            case "GOOD":
                filterGood = true;
                break;
            case "BAD":
                filterBad = true;
                break;
            case "UNKNOWN":
                filterUnknown = true;
                break;
        }

        var tooltipX = 80;
        var tooltipY = 220;

        var filterGoodIcon = React.createElement(
            'div',
            { className: 'status-good' },
            React.createElement(
                'span',
                null,
                '▶'
            )
        );
        var filterGoodTooltip = {
            "content": "Healthy",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };
        var filterGoodControlButton = React.createElement(ControlButton, {
            name: 'filterGoodControlButton',
            icon: filterGoodIcon,
            selected: filterGood,
            tooltip: filterGoodTooltip,
            clickAction: this._onFilterGood });

        var filterBadIcon = React.createElement(
            'div',
            { className: 'status-bad' },
            React.createElement('i', { className: 'fa fa-minus-circle' })
        );
        var filterBadTooltip = {
            "content": "Unhealthy",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };
        var filterBadControlButton = React.createElement(ControlButton, {
            name: 'filterBadControlButton',
            icon: filterBadIcon,
            selected: filterBad,
            tooltip: filterBadTooltip,
            clickAction: this._onFilterBad });

        var filterUnknownIcon = React.createElement(
            'div',
            { className: 'status-unknown moveDown' },
            React.createElement(
                'span',
                null,
                '▬'
            )
        );
        var filterUnknownTooltip = {
            "content": "Unknown Status",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };
        var filterUnknownControlButton = React.createElement(ControlButton, {
            name: 'filterUnknownControlButton',
            icon: filterUnknownIcon,
            selected: filterUnknown,
            tooltip: filterUnknownTooltip,
            clickAction: this._onFilterUnknown });

        var filterOffIcon = React.createElement('i', { className: 'fa fa-ban' });
        var filterOffTooltip = {
            "content": "Clear Filter",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };
        var filterOffControlButton = React.createElement(ControlButton, {
            name: 'filterOffControlButton',
            icon: filterOffIcon,
            tooltip: filterOffTooltip,
            clickAction: this._onFilterOff });

        if (!this.state.platforms) {
            platforms = React.createElement(
                'p',
                null,
                'Loading platforms panel ...'
            );
        } else if (!this.state.platforms.length) {
            platforms = React.createElement(
                'p',
                null,
                'No platforms found.'
            );
        } else {
            platforms = this.state.platforms.sort(function (a, b) {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1;
                }
                return 0;
            }).map(function (platform) {
                return React.createElement(PlatformsPanelItem, { key: platform.uuid, panelItem: platform, itemPath: platform.path });
            });
        }

        return React.createElement(
            'div',
            { className: classes.join(" ") },
            React.createElement(
                'div',
                { className: 'extend-panel',
                    onClick: this._togglePanel },
                this.state.expanded ? '◀' : '▶'
            ),
            React.createElement(
                'div',
                { style: contentsStyle },
                React.createElement('br', null),
                React.createElement(
                    'div',
                    { className: 'filter_box', style: filterBoxContainer },
                    React.createElement('span', { className: 'fa fa-search' }),
                    React.createElement('input', {
                        type: 'search',
                        onChange: this._onFilterBoxChange,
                        value: this.state.filterValue
                    }),
                    React.createElement(
                        'div',
                        { className: 'inlineBlock' },
                        filterGoodControlButton,
                        filterBadControlButton,
                        filterUnknownControlButton,
                        filterOffControlButton
                    )
                ),
                React.createElement(
                    'ul',
                    { className: 'platform-panel-list' },
                    platforms
                )
            )
        );
    }
});

module.exports = PlatformsPanel;

},{"../action-creators/platforms-panel-action-creators":9,"../stores/platforms-panel-items-store":62,"../stores/platforms-panel-store":63,"./control-button":20,"./platforms-panel-item":41,"react":undefined,"react-router":undefined}],43:[function(require,module,exports){
'use strict';

var React = require('react');
var Router = require('react-router');

var modalActionCreators = require('../action-creators/modal-action-creators');
var platformsStore = require('../stores/platforms-store');
var RegisterPlatformForm = require('../components/register-platform-form');
var DeregisterPlatformConfirmation = require('../components/deregister-platform-confirmation');

var Platforms = React.createClass({
    displayName: 'Platforms',

    getInitialState: function getInitialState() {
        return getStateFromStores();
    },
    componentDidMount: function componentDidMount() {
        platformsStore.addChangeListener(this._onStoresChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        platformsStore.removeChangeListener(this._onStoresChange);
    },
    _onStoresChange: function _onStoresChange() {
        this.setState(getStateFromStores());
    },
    _onRegisterClick: function _onRegisterClick() {
        modalActionCreators.openModal(React.createElement(RegisterPlatformForm, null));
    },
    _onDeregisterClick: function _onDeregisterClick(platform) {
        modalActionCreators.openModal(React.createElement(DeregisterPlatformConfirmation, { platform: platform }));
    },
    render: function render() {
        var platforms;

        if (!this.state.platforms) {
            platforms = React.createElement(
                'p',
                null,
                'Loading platforms...'
            );
        } else if (!this.state.platforms.length) {
            platforms = React.createElement(
                'p',
                null,
                'No platforms found.'
            );
        } else {
            platforms = this.state.platforms.sort(function (a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                return 0;
            }).map(function (platform) {
                var status = [platform.uuid];

                if (platform.agents) {
                    var running = 0;
                    var stopped = 0;

                    platform.agents.forEach(function (agent) {
                        if (agent.process_id !== null) {
                            if (agent.return_code === null) {
                                running++;
                            } else {
                                stopped++;
                            }
                        }
                    });

                    status.push('Agents: ' + running + ' running, ' + stopped + ' stopped, ' + platform.agents.length + ' installed');
                }

                return React.createElement(
                    'div',
                    {
                        key: platform.uuid,
                        className: 'view__item view__item--list'
                    },
                    React.createElement(
                        'h3',
                        null,
                        React.createElement(
                            Router.Link,
                            {
                                to: "platform/" + platform.uuid
                            },
                            platform.name
                        )
                    ),
                    React.createElement(
                        'button',
                        {
                            className: 'deregister-platform',
                            onClick: this._onDeregisterClick.bind(this, platform),
                            title: 'Deregister platform'
                        },
                        '×'
                    ),
                    React.createElement(
                        'code',
                        null,
                        status.join(' | ')
                    )
                );
            }, this);
        }

        return React.createElement(
            'div',
            { className: 'view' },
            React.createElement(
                'div',
                { className: 'absolute_anchor' },
                React.createElement(
                    'h2',
                    null,
                    'Platforms'
                ),
                React.createElement(
                    'div',
                    { className: 'view__actions' },
                    React.createElement(
                        'button',
                        { className: 'button', onClick: this._onRegisterClick },
                        'Register platform'
                    )
                ),
                platforms
            )
        );
    }
});

function getStateFromStores() {
    return {
        platforms: platformsStore.getPlatforms()
    };
}

module.exports = Platforms;

},{"../action-creators/modal-action-creators":5,"../components/deregister-platform-confirmation":26,"../components/register-platform-form":44,"../stores/platforms-store":64,"react":undefined,"react-router":undefined}],44:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');
var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');

var RegisterPlatformForm = React.createClass({
    displayName: 'RegisterPlatformForm',

    getInitialState: function getInitialState() {
        var state = {};

        state.method = 'discovery';
        state.registering = false;

        state.name = state.discovery_address = state.ipaddress = state.serverKey = state.publicKey = state.secretKey = '';
        state.protocol = 'tcp';

        return state;
    },
    _onNameChange: function _onNameChange(e) {
        this.setState({ name: e.target.value });
    },
    _onAddressChange: function _onAddressChange(e) {
        this.setState({ ipaddress: e.target.value });
        this.setState({ discovery_address: e.target.value });
    },
    _onProtocolChange: function _onProtocolChange(e) {
        this.setState({ protocol: e.target.value });
    },
    _onServerKeyChange: function _onServerKeyChange(e) {
        this.setState({ serverKey: e.target.value });
    },
    _onPublicKeyChange: function _onPublicKeyChange(e) {
        this.setState({ publicKey: e.target.value });
    },
    _onSecretKeyChange: function _onSecretKeyChange(e) {
        this.setState({ secretKey: e.target.value });
    },
    _toggleMethod: function _toggleMethod(e) {
        this.setState({ method: this.state.method === "discovery" ? "advanced" : "discovery" });
    },
    _onCancelClick: function _onCancelClick(e) {
        this.setState({ registering: false });
        modalActionCreators.closeModal();
    },
    _onSubmit: function _onSubmit(e) {
        e.preventDefault();
        var address = this.state.method === "discovery" ? this.state.discovery_address : this._formatAddress();

        this.setState({ registering: true });
        platformManagerActionCreators.registerPlatform(this.state.name, address, this.state.method);
    },
    _formatAddress: function _formatAddress() {

        var fullAddress = this.state.protocol + "://" + this.state.ipaddress;

        if (this.state.serverKey) {
            fullAddress = fullAddress + "?serverkey=" + this.state.serverKey;
        }

        if (this.state.publicKey) {
            fullAddress = fullAddress + "&publickey=" + this.state.publicKey;
        }

        if (this.state.secretKey) {
            fullAddress = fullAddress + "&secretkey=" + this.state.secretKey;
        }

        return fullAddress;
    },
    render: function render() {

        var fullAddress = this._formatAddress();

        var registerForm;

        var submitMethod;

        var progress;

        if (this.state.registering) {
            var progressStyle = {
                textAlign: "center",
                width: "100%"
            };
            progress = React.createElement(
                'div',
                { style: progressStyle },
                React.createElement('progress', null)
            );
        }

        switch (this.state.method) {
            case "discovery":
                registerForm = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv firstCell' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Name'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block inputField',
                                    type: 'text',
                                    onChange: this._onNameChange,
                                    value: this.state.name,
                                    autoFocus: true,
                                    required: true
                                })
                            ),
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '70%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Address'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block inputField',
                                    type: 'text',
                                    onChange: this._onAddressChange,
                                    value: this.state.discovery_address,
                                    required: true
                                })
                            )
                        )
                    ),
                    progress,
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv firstCell' },
                                React.createElement(
                                    'div',
                                    { className: 'form__link',
                                        onClick: this._toggleMethod },
                                    React.createElement(
                                        'a',
                                        null,
                                        'Advanced'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '70%' },
                                React.createElement(
                                    'div',
                                    { className: 'form__actions' },
                                    React.createElement(
                                        'button',
                                        {
                                            className: 'button button--secondary',
                                            type: 'button',
                                            onClick: this._onCancelClick
                                        },
                                        'Cancel'
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            className: 'button',
                                            disabled: !this.state.name || !this.state.discovery_address
                                        },
                                        'Register'
                                    )
                                )
                            )
                        )
                    )
                );
                break;
            case "advanced":

                registerForm = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv firstCell' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Name'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block',
                                    type: 'text',
                                    onChange: this._onNameChange,
                                    value: this.state.name,
                                    autoFocus: true,
                                    required: true
                                })
                            ),
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '10%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Protocol'
                                ),
                                React.createElement('br', null),
                                React.createElement(
                                    'select',
                                    {
                                        className: 'form__control',
                                        onChange: this._onProtocolChange,
                                        value: this.state.protocol,
                                        required: true
                                    },
                                    React.createElement(
                                        'option',
                                        { value: 'tcp' },
                                        'TCP'
                                    ),
                                    React.createElement(
                                        'option',
                                        { value: 'ipc' },
                                        'IPC'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '56%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'VIP address'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block',
                                    type: 'text',
                                    onChange: this._onAddressChange,
                                    value: this.state.ipaddress,
                                    required: true
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '80%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Server Key'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block',
                                    type: 'text',
                                    onChange: this._onServerKeyChange,
                                    value: this.state.serverKey
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '80%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Public Key'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block',
                                    type: 'text',
                                    onChange: this._onPublicKeyChange,
                                    value: this.state.publicKey
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '80%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Secret Key'
                                ),
                                React.createElement('input', {
                                    className: 'form__control form__control--block',
                                    type: 'text',
                                    onChange: this._onSecretKeyChange,
                                    value: this.state.secretKey
                                })
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '100%' },
                                React.createElement(
                                    'label',
                                    { className: 'formLabel' },
                                    'Preview'
                                ),
                                React.createElement(
                                    'div',
                                    {
                                        className: 'preview' },
                                    fullAddress
                                )
                            )
                        )
                    ),
                    progress,
                    React.createElement(
                        'div',
                        { className: 'tableDiv' },
                        React.createElement(
                            'div',
                            { className: 'rowDiv' },
                            React.createElement(
                                'div',
                                { className: 'cellDiv firstCell' },
                                React.createElement(
                                    'div',
                                    { className: 'form__link',
                                        onClick: this._toggleMethod },
                                    React.createElement(
                                        'a',
                                        null,
                                        'Discover'
                                    )
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'cellDiv',
                                    width: '70%' },
                                React.createElement(
                                    'div',
                                    { className: 'form__actions' },
                                    React.createElement(
                                        'button',
                                        {
                                            className: 'button button--secondary',
                                            type: 'button',
                                            onClick: this._onCancelClick
                                        },
                                        'Cancel'
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            className: 'button',
                                            disabled: !this.state.name || !this.state.protocol || !this.state.ipaddress || !(this.state.serverKey && this.state.publicKey && this.state.secretKey || !this.state.publicKey && !this.state.secretKey)
                                        },
                                        'Register'
                                    )
                                )
                            )
                        )
                    )
                );
                break;
        }

        return React.createElement(
            'form',
            { className: 'register-platform-form', onSubmit: this._onSubmit },
            React.createElement(
                'h1',
                null,
                'Register platform'
            ),
            registerForm
        );
    }
});

module.exports = RegisterPlatformForm;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-manager-action-creators":8,"react":undefined}],45:[function(require,module,exports){
'use strict';

var React = require('react');

var modalActionCreators = require('../action-creators/modal-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');

var RemoveAgentForm = React.createClass({
    displayName: 'RemoveAgentForm',

    getInitialState: function getInitialState() {
        var state = {};

        for (var prop in this.props.agent) {
            state[prop] = this.props.agent[prop];
        }

        return state;
    },
    _onPropChange: function _onPropChange(e) {
        var state = {};

        this.setState(state);
    },
    _onCancelClick: modalActionCreators.closeModal,
    _onSubmit: function _onSubmit(e) {
        e.preventDefault();
        platformActionCreators.removeAgent(this.props.platform, this.props.agent);
    },
    render: function render() {

        var removeMsg = 'Remove agent ' + this.props.agent.uuid + ' (' + this.props.agent.name + ', ' + this.props.agent.tag + ')?';

        return React.createElement(
            'form',
            { className: 'remove-agent-form', onSubmit: this._onSubmit },
            React.createElement(
                'div',
                null,
                removeMsg
            ),
            React.createElement(
                'div',
                { className: 'form__actions' },
                React.createElement(
                    'button',
                    {
                        className: 'button button--secondary',
                        type: 'button',
                        onClick: this._onCancelClick
                    },
                    'Cancel'
                ),
                React.createElement(
                    'button',
                    {
                        className: 'button',
                        type: 'submit',
                        disabled: !this.props.agent.uuid
                    },
                    'Remove'
                )
            )
        );
    }
});

module.exports = RemoveAgentForm;

},{"../action-creators/modal-action-creators":5,"../action-creators/platform-action-creators":6,"react":undefined}],46:[function(require,module,exports){
'use strict';

var React = require('react');

var statusIndicatorCreators = require('../action-creators/status-indicator-action-creators');
var statusIndicatorStore = require('../stores/status-indicator-store');

var StatusIndicator = React.createClass({
    displayName: 'StatusIndicator',


    getInitialState: function getInitialState() {
        var state = statusIndicatorStore.getStatusMessage();

        state.errors = state.status === "error";
        state.fadeOut = false;

        return state;
    },
    componentDidMount: function componentDidMount() {
        if (!this.state.errors) {
            this.fadeTimer = setTimeout(this._fadeForClose, 4000);
            this.closeTimer = setTimeout(this._autoCloseOnSuccess, 5000);
        }
    },
    _fadeForClose: function _fadeForClose() {
        this.setState({ fadeOut: true });
    },
    _keepVisible: function _keepVisible(evt) {
        if (this.fadeTimer) {
            this.setState({ fadeOut: false });

            clearTimeout(this.fadeTimer);
            clearTimeout(this.closeTimer);

            evt.currentTarget.addEventListener("mouseleave", this._closeOnMouseOut);
        }
    },
    _closeOnMouseOut: function _closeOnMouseOut() {
        if (!this.state.errors) {
            this.fadeTimer = setTimeout(this._fadeForClose, 0);
            this.closeTimer = setTimeout(this._autoCloseOnSuccess, 1000);
        }
    },
    _autoCloseOnSuccess: function _autoCloseOnSuccess() {
        statusIndicatorCreators.closeStatusIndicator();
    },
    _onCloseClick: function _onCloseClick() {
        statusIndicatorCreators.closeStatusIndicator();
    },

    render: function render() {
        var classes = ["status-indicator"];

        var green = "#35B809";
        var red = "#FC0516";

        var displayButton = "none";
        var color = green;

        if (this.state.errors) {
            displayButton = "block";
            color = red;
        } else if (this.state.fadeOut) {
            classes.push("hide-slow");
        }

        var buttonStyle = {
            margin: "auto"
        };

        var colorStyle = {
            background: color,
            width: "100%",
            height: "2rem",
            margin: "0"
        };

        var buttonDivStyle = {
            width: "100%",
            height: "3rem",
            display: displayButton
        };

        var spacerStyle = {
            width: "100%",
            height: "2rem"
        };

        var messageStyle = {
            padding: "0px 20px"
        };

        var statusMessage = React.createElement(
            'b',
            null,
            this.state.statusMessage
        );

        if (this.state.hasOwnProperty("highlight")) {
            var highlight = this.state.highlight;
            var wholeMessage = this.state.statusMessage;

            var startIndex = wholeMessage.indexOf(highlight);

            if (startIndex > -1) {
                var newMessage = [];

                if (startIndex === 0) {
                    newMessage.push(React.createElement(
                        'b',
                        { key: 'b1' },
                        wholeMessage.substring(0, highlight.length)
                    ));
                    newMessage.push(React.createElement(
                        'span',
                        { key: 'span1' },
                        wholeMessage.substring(highlight.length)
                    ));
                } else {
                    newMessage.push(React.createElement(
                        'span',
                        { key: 'span1' },
                        wholeMessage.substring(0, startIndex)
                    ));
                    newMessage.push(React.createElement(
                        'b',
                        { key: 'b1' },
                        wholeMessage.substring(startIndex, startIndex + highlight.length)
                    ));
                    newMessage.push(React.createElement(
                        'span',
                        { key: 'span2' },
                        wholeMessage.substring(startIndex + highlight.length)
                    ));
                }

                statusMessage = newMessage;
            }
        }

        messageStyle.textAlign = this.state.hasOwnProperty("align") ? this.state.align : "left";

        return React.createElement(
            'div',
            {
                className: classes.join(' '),
                onMouseEnter: this._keepVisible
            },
            React.createElement('div', { style: colorStyle }),
            React.createElement('br', null),
            React.createElement(
                'div',
                { style: messageStyle },
                statusMessage
            ),
            React.createElement('div', { style: spacerStyle }),
            React.createElement(
                'div',
                { style: buttonDivStyle },
                React.createElement(
                    'button',
                    {
                        className: 'button',
                        style: buttonStyle,
                        onClick: this._onCloseClick
                    },
                    'Close'
                )
            )
        );
    }
});

module.exports = StatusIndicator;

},{"../action-creators/status-indicator-action-creators":10,"../stores/status-indicator-store":65,"react":undefined}],47:[function(require,module,exports){
'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
    OPEN_MODAL: null,
    CLOSE_MODAL: null,

    OPEN_STATUS: null,
    CLOSE_STATUS: null,

    TOGGLE_CONSOLE: null,

    UPDATE_COMPOSER_VALUE: null,

    MAKE_REQUEST: null,
    FAIL_REQUEST: null,
    RECEIVE_RESPONSE: null,

    RECEIVE_AUTHORIZATION: null,
    RECEIVE_UNAUTHORIZED: null,
    CLEAR_AUTHORIZATION: null,

    WILL_INITIALIZE_PLATFORMS: null,
    RECEIVE_PLATFORMS: null,
    RECEIVE_PLATFORM: null,

    RECEIVE_PLATFORM_STATUSES: null,
    TOGGLE_PLATFORMS_PANEL: null,

    RECEIVE_AGENT_STATUSES: null,
    RECEIVE_DEVICE_STATUSES: null,
    RECEIVE_PERFORMANCE_STATS: null,

    START_LOADING_DATA: null,
    END_LOADING_DATA: null,

    SHOW_CHARTS: null,
    ADD_TO_CHART: null,
    REMOVE_FROM_CHART: null,
    PIN_CHART: null,
    CHANGE_CHART_TYPE: null,
    CHANGE_CHART_MIN: null,
    CHANGE_CHART_MAX: null,
    CHANGE_CHART_REFRESH: null,
    REFRESH_CHART: null,
    REMOVE_CHART: null,
    LOAD_CHARTS: null,
    REMOVE_PLATFORM_CHARTS: null,

    EXPAND_ALL: null,
    TOGGLE_ITEM: null,
    CHECK_ITEM: null,
    FILTER_ITEMS: null,

    CONFIGURE_DEVICES: null,
    ADD_DEVICES: null,
    SCAN_FOR_DEVICES: null,
    LISTEN_FOR_IAMS: null,
    CANCEL_SCANNING: null,
    LIST_DETECTED_DEVICES: null,
    CONFIGURE_DEVICE: null,
    EDIT_REGISTRY: null,
    LOAD_REGISTRY: null,
    GENERATE_REGISTRY: null,
    CANCEL_REGISTRY: null,
    SAVE_REGISTRY: null,

    // ADD_CONTROL_BUTTON: null,
    // REMOVE_CONTROL_BUTTON: null,
    TOGGLE_TAPTIP: null,
    HIDE_TAPTIP: null,
    SHOW_TAPTIP: null,
    CLEAR_BUTTON: null,

    RECEIVE_CHART_TOPICS: null
});

},{"keymirror":undefined}],48:[function(require,module,exports){
'use strict';

var Dispatcher = require('flux').Dispatcher;

var ACTION_TYPES = require('../constants/action-types');

var dispatcher = new Dispatcher();

dispatcher.dispatch = function (action) {
    if (action.type in ACTION_TYPES) {
        return Object.getPrototypeOf(this).dispatch.call(this, action);
    }

    throw 'Dispatch error: invalid action type ' + action.type;
};

module.exports = dispatcher;

},{"../constants/action-types":47,"flux":undefined}],49:[function(require,module,exports){
'use strict';

function RpcError(error) {
    this.name = 'RpcError';
    this.code = error.code;
    this.message = error.message;
    this.data = error.data;
    this.response = error.response;
}
RpcError.prototype = Object.create(Error.prototype);
RpcError.prototype.constructor = RpcError;

module.exports = RpcError;

},{}],50:[function(require,module,exports){
'use strict';

var uuid = require('node-uuid');

var ACTION_TYPES = require('../../constants/action-types');
var dispatcher = require('../../dispatcher');
var RpcError = require('./error');
var xhr = require('../xhr');

function RpcExchange(request, redactedParams) {
    if (!(this instanceof RpcExchange)) {
        return new RpcExchange(request);
    }

    var exchange = this;

    // TODO: validate request
    request.jsonrpc = '2.0';
    request.id = uuid.v1();

    // stringify before redacting params
    var data = JSON.stringify(request);

    if (redactedParams && redactedParams.length) {
        redactedParams.forEach(function (paramPath) {
            paramPath = paramPath.split('.');

            var paramParent = request.params;

            while (paramPath.length > 1) {
                paramParent = paramParent[paramPath.shift()];
            }

            paramParent[paramPath[0]] = '[REDACTED]';
        });
    }

    exchange.initiated = Date.now();
    exchange.request = request;

    dispatcher.dispatch({
        type: ACTION_TYPES.MAKE_REQUEST,
        exchange: exchange,
        request: exchange.request
    });

    exchange.promise = new xhr.Request({
        method: 'POST',
        url: '/jsonrpc',
        contentType: 'application/json',
        data: data,
        timeout: 60000
    }).finally(function () {
        exchange.completed = Date.now();
    }).then(function (response) {
        exchange.response = response;

        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_RESPONSE,
            exchange: exchange,
            response: response
        });

        if (response.error) {
            throw new RpcError(response.error);
        }

        return JSON.parse(JSON.stringify(response.result));
    }).catch(xhr.Error, function (error) {
        exchange.error = error;

        dispatcher.dispatch({
            type: ACTION_TYPES.FAIL_REQUEST,
            exchange: exchange,
            error: error
        });

        throw new RpcError(error);
    });
}

module.exports = RpcExchange;

},{"../../constants/action-types":47,"../../dispatcher":48,"../xhr":54,"./error":49,"node-uuid":undefined}],51:[function(require,module,exports){
'use strict';

module.exports = {
    Error: require('./error'),
    Exchange: require('./exchange')
};

},{"./error":49,"./exchange":50}],52:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

function Store() {
    EventEmitter.call(this);
    this.setMaxListeners(0);
}
Store.prototype = EventEmitter.prototype;

Store.prototype.emitChange = function () {
    this.emit(CHANGE_EVENT);
};

Store.prototype.addChangeListener = function (callback) {
    this.on(CHANGE_EVENT, callback);
};

Store.prototype.removeChangeListener = function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
};

module.exports = Store;

},{"events":undefined}],53:[function(require,module,exports){
'use strict';

function XhrError(message, response) {
    this.name = 'XhrError';
    this.message = message;
    this.response = response;
}
XhrError.prototype = Object.create(Error.prototype);
XhrError.prototype.constructor = XhrError;

module.exports = XhrError;

},{}],54:[function(require,module,exports){
'use strict';

module.exports = {
    Request: require('./request'),
    Error: require('./error')
};

},{"./error":53,"./request":55}],55:[function(require,module,exports){
'use strict';

var jQuery = require('jquery');
var Promise = require('bluebird');

var XhrError = require('./error');

function XhrRequest(opts) {
    return new Promise(function (resolve, reject) {
        opts.success = resolve;
        opts.error = function (response, type) {
            switch (type) {
                case 'error':
                    reject(new XhrError('Server returned ' + response.status + ' status', response));
                    break;
                case 'timeout':
                    reject(new XhrError('Request timed out', response));
                    break;
                default:
                    reject(new XhrError('Request failed: ' + type, response));
            }
        };

        jQuery.ajax(opts);
    });
}

module.exports = XhrRequest;

},{"./error":53,"bluebird":undefined,"jquery":undefined}],56:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _authorization = sessionStorage.getItem('authorization');
var _username = sessionStorage.getItem('username');

var authorizationStore = new Store();

authorizationStore.getAuthorization = function () {
    return _authorization;
};

authorizationStore.getUsername = function () {
    return _username;
};

authorizationStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {
        case ACTION_TYPES.RECEIVE_AUTHORIZATION:
            _authorization = action.authorization;
            _username = action.name;
            sessionStorage.setItem('authorization', _authorization);
            sessionStorage.setItem('username', _username);
            authorizationStore.emitChange();
            break;

        case ACTION_TYPES.RECEIVE_UNAUTHORIZED:
            authorizationStore.emitChange();
            break;

        case ACTION_TYPES.CLEAR_AUTHORIZATION:
            _authorization = null;
            _username = null;
            sessionStorage.removeItem('authorization');
            sessionStorage.removeItem('username');
            authorizationStore.emitChange();
            break;
    }
});

module.exports = authorizationStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52}],57:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var authorizationStore = require('../stores/authorization-store');
var Store = require('../lib/store');

var _composerId = Date.now();
var _composerValue = '';
var _consoleShown = false;
var _exchanges = [];

var consoleStore = new Store();

consoleStore.getComposerId = function () {
    return _composerId;
};

consoleStore.getComposerValue = function () {
    return _composerValue;
};

consoleStore.getConsoleShown = function () {
    return _consoleShown;
};

consoleStore.getExchanges = function () {
    return _exchanges;
};

function _resetComposerValue() {
    var authorization = authorizationStore.getAuthorization();
    var parsed;

    try {
        parsed = JSON.parse(_composerValue);
    } catch (e) {
        parsed = { method: '' };
    }

    if (authorization) {
        parsed.authorization = authorization;
    } else {
        delete parsed.authorization;
    }

    _composerValue = JSON.stringify(parsed, null, '    ');
}

_resetComposerValue();

consoleStore.dispatchToken = dispatcher.register(function (action) {
    dispatcher.waitFor([authorizationStore.dispatchToken]);

    switch (action.type) {
        case ACTION_TYPES.TOGGLE_CONSOLE:
            _consoleShown = !_consoleShown;
            consoleStore.emitChange();
            break;

        case ACTION_TYPES.UPDATE_COMPOSER_VALUE:
            _composerValue = action.value;
            consoleStore.emitChange();
            break;

        case ACTION_TYPES.RECEIVE_AUTHORIZATION:
        case ACTION_TYPES.RECEIVE_UNAUTHORIZED:
        case ACTION_TYPES.CLEAR_AUTHORIZATION:
            _composerId = Date.now();
            _resetComposerValue();
            consoleStore.emitChange();
            break;

        case ACTION_TYPES.MAKE_REQUEST:
            if (_consoleShown) {
                _exchanges.push(action.exchange);
                consoleStore.emitChange();
            }
            break;

        case ACTION_TYPES.FAIL_REQUEST:
        case ACTION_TYPES.RECEIVE_RESPONSE:
            if (_consoleShown) {
                consoleStore.emitChange();
            }
            break;
    }
});

module.exports = consoleStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"../stores/authorization-store":56}],58:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _controlButtons = {};

var controlButtonStore = new Store();

controlButtonStore.getTaptip = function (name) {

    var showTaptip = null;

    if (_controlButtons.hasOwnProperty([name])) {
        if (_controlButtons[name].hasOwnProperty("showTaptip")) {
            showTaptip = _controlButtons[name].showTaptip;
        }
    }

    return showTaptip;
};

controlButtonStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {

        case ACTION_TYPES.TOGGLE_TAPTIP:

            var showTaptip;

            if (_controlButtons.hasOwnProperty(action.name)) {
                _controlButtons[action.name].showTaptip = showTaptip = !_controlButtons[action.name].showTaptip;
            } else {
                _controlButtons[action.name] = { "showTaptip": true };
                showTaptip = true;
            }

            if (showTaptip === true) {
                //close other taptips    
                for (var key in _controlButtons) {
                    if (key !== action.name) {
                        _controlButtons[key].showTaptip = false;
                    }
                }
            }

            controlButtonStore.emitChange();

            break;

        case ACTION_TYPES.HIDE_TAPTIP:

            if (_controlButtons.hasOwnProperty(action.name)) {
                if (_controlButtons[action.name].hasOwnProperty("showTaptip")) {
                    _controlButtons[action.name].showTaptip = false;
                }
            }

            controlButtonStore.emitChange();

            break;
    }
});

module.exports = controlButtonStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"../stores/authorization-store":56}],59:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var devicesStore = new Store();

var _action = "get_scan_settings";
var _view = "Detect Devices";
var _device = null;
var _data = {};
var _backupData = {};
var _registryFiles = {};
var _backupFileName = {};
var _platform;
var _devices = [];
var _newScan = false;

var _placeHolders = [[{ "key": "Point_Name", "value": "", "editable": true }, { "key": "Volttron_Point_Name", "value": "" }, { "key": "Units", "value": "" }, { "key": "Units_Details", "value": "" }, { "key": "Writable", "value": "" }, { "key": "Starting_Value", "value": "" }, { "key": "Type", "value": "" }, { "key": "Notes", "value": "" }]];

devicesStore.getState = function () {
    return { action: _action, view: _view, device: _device, platform: _platform };
};

devicesStore.getFilteredRegistryValues = function (device, filterStr) {

    return _data[device.deviceId].filter(function (item) {
        var pointName = item.find(function (pair) {
            return pair.key === "Point_Name";
        });

        return pointName ? pointName.value.trim().toUpperCase().indexOf(filterStr.trim().toUpperCase()) > -1 : false;
    });
};

devicesStore.getRegistryValues = function (device) {

    return _data[device.deviceId].length ? JSON.parse(JSON.stringify(_data[device.deviceId])) : JSON.parse(JSON.stringify(_placeHolders));
};

devicesStore.getDataLoaded = function (device) {
    return _data.hasOwnProperty(device.deviceId) && _data.hasOwnProperty(device.deviceId) ? _data[device.deviceId].length : false;
};

devicesStore.getRegistryFile = function (device) {

    return _registryFiles.hasOwnProperty(device.deviceId) && _data.hasOwnProperty(device.deviceId) && _data[device.deviceId].length ? _registryFiles[device.deviceId] : "";
};

devicesStore.getDevices = function (platform, bacnetUuid) {

    var devices = [];

    for (var key in _devices) {
        if (_devices[key].platformUuid === platform.uuid && _devices[key].bacnetProxyUuid === bacnetUuid) {
            devices.push(_devices[key]);
        }
    }

    return JSON.parse(JSON.stringify(devices));
};

devicesStore.getDevice = function (deviceId) {

    return JSON.parse(JSON.stringify(_devices[deviceId]));
};

devicesStore.getNewScan = function () {

    return _newScan;
};

devicesStore.dispatchToken = dispatcher.register(function (action) {
    dispatcher.waitFor([authorizationStore.dispatchToken]);

    switch (action.type) {
        case ACTION_TYPES.CONFIGURE_DEVICES:
            _platform = action.platform;
            _devices = [];
            _newScan = true;
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.ADD_DEVICES:
        case ACTION_TYPES.CANCEL_SCANNING:
            _action = "get_scan_settings";
            _view = "Detect Devices";
            _device = null;
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.SCAN_FOR_DEVICES:
            _action = "start_scan";
            _view = "Detect Devices";
            _device = null;
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.LISTEN_FOR_IAMS:
            _newScan = false;
            _devices = {
                "548": {
                    configuring: false,
                    platformUuid: action.platformUuid,
                    bacnetProxyUuid: action.bacnetProxyUuid,
                    registryConfig: [],
                    id: "548",
                    items: [{ key: "address", label: "Address", value: "Address 192.168.1.42" }, { key: "deviceId", label: "Device ID", value: "548" }, { key: "description", label: "Description", value: "Temperature sensor" }, { key: "vendorId", label: "Vendor ID", value: "18" }, { key: "vendor", label: "Vendor", value: "Siemens" }, { key: "type", label: "Type", value: "BACnet" }]
                },
                "33": {
                    configuring: false,
                    platformUuid: action.platformUuid,
                    bacnetProxyUuid: action.bacnetProxyUuid,
                    registryConfig: [],
                    id: "33",
                    items: [{ key: "address", label: "Address", value: "RemoteStation 1002:11" }, { key: "deviceId", label: "Device ID", value: "33" }, { key: "description", label: "Description", value: "Actuator 3-pt for zone control" }, { key: "vendorId", label: "Vendor ID", value: "12" }, { key: "vendor", label: "Vendor", value: "Alerton" }, { key: "type", label: "Type", value: "BACnet" }]
                }
            };

            devicesStore.emitChange();
            break;
        case ACTION_TYPES.LIST_DETECTED_DEVICES:
            _action = "show_new_devices";
            _view = "Configure Devices";
            _device = null;
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.CONFIGURE_DEVICE:
            _action = "configure_device";
            _view = "Configure Device";
            _devices[action.device.id] = action.device;
            devicesStore.emitChange();
        case ACTION_TYPES.CANCEL_REGISTRY:
            _action = "configure_device";
            _view = "Configure Device";
            _device = action.device;
            _data[_device.deviceId] = _backupData.hasOwnProperty(_device.deviceId) ? JSON.parse(JSON.stringify(_backupData[_device.deviceId])) : [];
            _registryFiles[_device.deviceId] = _backupFileName.hasOwnProperty(_device.deviceId) ? _backupFileName[_device.deviceId] : "";
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.LOAD_REGISTRY:
            _action = "configure_registry";
            _view = "Registry Configuration";
            _device = action.device;
            _backupData[_device.id] = _data.hasOwnProperty(_device.id) ? JSON.parse(JSON.stringify(_data[_device.id])) : [];
            _backupFileName[_device.id] = _registryFiles.hasOwnProperty(_device.id) ? _registryFiles[_device.id] : "";
            _data[_device.id] = JSON.parse(JSON.stringify(action.data));
            _devices[_device.id].registryConfig = JSON.parse(JSON.stringify(action.data));
            _registryFiles[_device.id] = action.file;
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.EDIT_REGISTRY:
            _action = "configure_registry";
            _view = "Registry Configuration";
            _device = action.device;
            _backupData[_device.deviceId] = _data.hasOwnProperty(_device.deviceId) ? JSON.parse(JSON.stringify(_data[_device.deviceId])) : [];
            _backupFileName[_device.deviceId] = _registryFiles.hasOwnProperty(_device.deviceId) ? _registryFiles[_device.deviceId] : "";
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.GENERATE_REGISTRY:
            _action = "configure_registry";
            _view = "Registry Configuration";
            _device = action.device;
            _backupData[_device.deviceId] = _data.hasOwnProperty(_device.deviceId) ? JSON.parse(JSON.stringify(_data[_device.deviceId])) : [];
            _backupFileName[_device.deviceId] = _registryFiles.hasOwnProperty(_device.deviceId) ? _registryFiles[_device.deviceId] : "";
            _data[_device.deviceId] = [];
            devicesStore.emitChange();
            break;
        case ACTION_TYPES.SAVE_REGISTRY:
            _action = "configure_device";
            _view = "Configure Device";
            _device = action.device;
            _data[_device.deviceId] = JSON.parse(JSON.stringify(action.data));
            devicesStore.emitChange();
            break;
    }
});

module.exports = devicesStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"../stores/authorization-store":56}],60:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _modalContent = null;

var modalStore = new Store();

modalStore.getModalContent = function () {
    return _modalContent;
};

modalStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {
        case ACTION_TYPES.OPEN_MODAL:
            _modalContent = action.content;
            modalStore.emitChange();
            break;

        case ACTION_TYPES.CLOSE_MODAL:
        case ACTION_TYPES.RECEIVE_UNAUTHORIZED:
            _modalContent = null;
            modalStore.emitChange();
            break;
    }
});

module.exports = modalStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52}],61:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');
var platformsStore = require('./platforms-store.js');

var _chartData = {};
var _showCharts = false;
var _chartTopics = {
    platforms: []
};

var chartStore = new Store();

chartStore.getPinnedCharts = function () {
    var pinnedCharts = [];

    var user = authorizationStore.getUsername();

    for (var key in _chartData) {
        if (_chartData[key].hasOwnProperty("pinned") && _chartData[key].pinned === true && _chartData[key].data.length > 0) {
            pinnedCharts.push(_chartData[key]);
        }
    }

    return JSON.parse(JSON.stringify(pinnedCharts));
};

chartStore.getData = function () {
    return JSON.parse(JSON.stringify(_chartData));
};

chartStore.getPinned = function (chartKey) {
    return _chartData.hasOwnProperty(chartKey) ? _chartData[chartKey].pinned : null;
};

chartStore.getType = function (chartKey) {
    var type = "line";

    if (_chartData.hasOwnProperty(chartKey)) {
        if (_chartData[chartKey].hasOwnProperty("type")) {
            type = _chartData[chartKey].type;
        }
    }

    return type;
};

chartStore.getMin = function (chartKey) {
    var min;

    if (_chartData.hasOwnProperty(chartKey)) {
        if (_chartData[chartKey].hasOwnProperty("min")) {
            min = _chartData[chartKey].min;
        }
    }

    return min;
};

chartStore.getMax = function (chartKey) {
    var max;

    if (_chartData.hasOwnProperty(chartKey)) {
        if (_chartData[chartKey].hasOwnProperty("max")) {
            max = _chartData[chartKey].max;
        }
    }

    return max;
};

chartStore.getRefreshRate = function (chartKey) {
    return _chartData.hasOwnProperty(chartKey) ? _chartData[chartKey].refreshInterval : null;
};

chartStore.showCharts = function () {

    var showCharts = _showCharts;

    _showCharts = false;

    return showCharts;
};

chartStore.getChartTopics = function () {

    var topics = [];

    if (_chartTopics.hasOwnProperty("platforms")) {
        topics = JSON.parse(JSON.stringify(_chartTopics.platforms));

        if (topics.length) {
            if (_chartData !== {}) {
                // Filter out any topics that are already in charts
                topics = topics.filter(function (topic) {

                    var topicInChart = false;

                    if (_chartData.hasOwnProperty(topic.name)) {
                        var path = _chartData[topic.name].series.find(function (item) {
                            return item.topic === topic.value;
                        });

                        topicInChart = path ? true : false;
                    }

                    return !topicInChart;
                });
            }

            // Filter out any orphan chart topics not associated with registered platforms
            var platformUuids = platformsStore.getPlatforms().map(function (platform) {
                return platform.uuid;
            });

            topics = topics.filter(function (topic) {

                // This filter will keep platform topics of known platforms and any topic that
                // looks like a device topic
                var platformTopic = platformUuids.filter(function (uuid) {
                    return topic.value.indexOf(uuid) > -1 || topic.value.indexOf("datalogger/platform") < 0;
                });

                return platformTopic.length ? true : false;
            });
        }
    }

    return topics;
};

chartStore.getTopicInCharts = function (topic, topicName) {
    var itemInChart;

    if (_chartData.hasOwnProperty(topicName)) {
        _chartData[topicName].series.find(function (series) {

            itemInChart = series.topic === topic;

            return itemInChart;
        });
    }

    return itemInChart;
};

chartStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {

        case ACTION_TYPES.ADD_TO_CHART:

            if (_chartData.hasOwnProperty(action.panelItem.name)) {
                insertSeries(action.panelItem);
                chartStore.emitChange();
            } else {
                if (action.panelItem.hasOwnProperty("data")) {
                    var chartObj = {
                        refreshInterval: action.panelItem.hasOwnProperty("refreshInterval") ? action.panelItem.refreshInterval : 15000,
                        pinned: action.panelItem.hasOwnProperty("pinned") ? action.panelItem.pinned : false,
                        type: action.panelItem.hasOwnProperty("chartType") ? action.panelItem.chartType : "line",
                        data: convertTimeToSeconds(action.panelItem.data),
                        chartKey: action.panelItem.name,
                        min: action.panelItem.hasOwnProperty("min") ? action.panelItem.min : null,
                        max: action.panelItem.hasOwnProperty("max") ? action.panelItem.max : null,
                        series: [setChartItem(action.panelItem)]
                    };

                    _chartData[action.panelItem.name] = chartObj;
                    chartStore.emitChange();
                }
            }

            break;

        case ACTION_TYPES.LOAD_CHARTS:

            _chartData = {};

            action.charts.forEach(function (chart) {
                _chartData[chart.chartKey] = JSON.parse(JSON.stringify(chart));
            });

            chartStore.emitChange();

            break;

        case ACTION_TYPES.REMOVE_FROM_CHART:

            if (_chartData.hasOwnProperty(action.panelItem.name)) {
                removeSeries(action.panelItem.name, action.panelItem.uuid);

                if (_chartData.hasOwnProperty(action.panelItem.name)) {
                    if (_chartData[action.panelItem.name].length === 0) {
                        delete _chartData[name];
                    }
                }

                chartStore.emitChange();
            }

            break;

        case ACTION_TYPES.REFRESH_CHART:

            removeSeries(action.item.name, action.item.uuid);
            insertSeries(action.item);
            chartStore.emitChange();

            break;

        case ACTION_TYPES.CHANGE_CHART_REFRESH:

            if (_chartData[action.chartKey].hasOwnProperty("refreshInterval")) {
                _chartData[action.chartKey].refreshInterval = action.rate;
            }

            chartStore.emitChange();

            break;

        case ACTION_TYPES.CHANGE_CHART_MIN:

            _chartData[action.chartKey].min = action.min;

            chartStore.emitChange();

            break;

        case ACTION_TYPES.CHANGE_CHART_MAX:

            _chartData[action.chartKey].max = action.max;

            chartStore.emitChange();

            break;

        case ACTION_TYPES.PIN_CHART:

            if (_chartData[action.chartKey].hasOwnProperty("pinned")) {
                _chartData[action.chartKey].pinned = !_chartData[action.chartKey].pinned;
            } else {
                _chartData[action.chartKey].pinned = true;
            }

            chartStore.emitChange();

            break;

        case ACTION_TYPES.CHANGE_CHART_TYPE:

            if (_chartData[action.chartKey].type !== action.chartType) {
                _chartData[action.chartKey].type = action.chartType;
            }

            chartStore.emitChange();

            break;

        case ACTION_TYPES.SHOW_CHARTS:

            if (action.emitChange) {
                _showCharts = true;
                chartStore.emitChange();
            }

            break;

        case ACTION_TYPES.RECEIVE_CHART_TOPICS:
            _chartTopics = {};

            var chartTopics = JSON.parse(JSON.stringify(action.topics));

            _chartTopics.platforms = chartTopics;

            chartStore.emitChange();
            break;

        case ACTION_TYPES.REMOVE_CHART:

            var name = action.name;

            if (_chartData.hasOwnProperty(name)) {

                delete _chartData[name];

                chartStore.emitChange();
            }

            break;

        case ACTION_TYPES.REMOVE_PLATFORM_CHARTS:

            var seriesToCut = [];

            for (var name in _chartData) {
                _chartData[name].series.forEach(function (series) {

                    if (series.path.indexOf(this.uuid) > -1) {
                        seriesToCut.push({ name: series.name, uuid: series.uuid });
                    }
                }, action.platform);
            }

            seriesToCut.forEach(function (series) {
                removeSeries(series.name, series.uuid);

                if (_chartData[series.name].series.length === 0) {
                    delete _chartData[series.name];
                }
            }, action.platform);

            if (seriesToCut.length) {
                chartStore.emitChange();
            }

            break;

        case ACTION_TYPES.CLEAR_AUTHORIZATION:

            _chartData = {};

            break;
    }

    function setChartItem(item) {

        var chartItem = {
            name: item.name,
            uuid: item.uuid,
            path: item.path,
            parentUuid: item.parentUuid,
            parentType: item.parentType,
            parentPath: item.parentPath,
            topic: item.topic
        };

        return chartItem;
    }

    function insertSeries(item) {

        var chartItems = _chartData[item.name].data.filter(function (datum) {
            return datum.uuid === item.uuid;
        });

        if (chartItems.length === 0) {
            if (item.hasOwnProperty("data")) {
                _chartData[item.name].data = _chartData[item.name].data.concat(convertTimeToSeconds(item.data));
                _chartData[item.name].series.push(setChartItem(item));
            }
        }
    }

    function removeSeries(name, uuid) {

        if (_chartData[name].data.length > 0) {
            for (var i = _chartData[name].data.length - 1; i >= 0; i--) {
                if (_chartData[name].data[i].uuid === uuid) {
                    _chartData[name].data.splice(i, 1);
                }
            }

            for (var i = 0; i < _chartData[name].series.length; i++) {
                if (_chartData[name].series[i].uuid === uuid) {
                    _chartData[name].series.splice(i, 1);

                    break;
                }
            }
        }
    }

    function convertTimeToSeconds(data) {
        var dataList = [];

        for (var key in data) {
            var newItem = {};

            for (var skey in data[key]) {
                var value = data[key][skey];

                if (typeof value === 'string') {
                    value = value.replace('+00:00', '');
                }

                if (skey === "0" && typeof value === 'string' && Date.parse(value + 'Z')) {
                    value = Date.parse(value + 'Z');
                }

                newItem[skey] = value;
            }

            dataList.push(newItem);
        }

        return dataList;
    }
});

module.exports = chartStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"../stores/authorization-store":56,"./platforms-store.js":64}],62:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');
var chartStore = require('../stores/platform-chart-store');

var _pointsOrder = 0;
var _devicesOrder = 1;
var _buildingsOrder = 2;
var _agentsOrder = 3;

var _items = {
    "platforms": {}
};

var _expanded = false;
var _itemTypes = ["platforms", "buildings", "agents", "devices", "points"];

var _badLabel = "Unhealthy";
var _goodLabel = "Healthy";
var _unknownLabel = "Unknown Status";

var _loadingDataComplete = {};
var _lastCheck = false;

var platformsPanelItemsStore = new Store();

platformsPanelItemsStore.getLastCheck = function (topic) {
    return _lastCheck;
};

platformsPanelItemsStore.findTopicInTree = function (topic) {
    var path = [];

    var topicParts = topic.split("/");

    if (topic.indexOf("datalogger/platforms") > -1) // if a platform instance
        {
            for (var key in _items.platforms) {
                if (key === topicParts[2]) {
                    if (_items.platforms[key].hasOwnProperty("points")) {
                        _items.platforms[key].points.children.find(function (point) {

                            var found = point === topic;

                            if (found) {
                                path = _items.platforms[key].points[point].path;
                            }

                            return found;
                        });
                    }

                    break;
                }
            }
        } else // else a device point
        {
            var buildingName = topicParts[1];

            for (var key in _items.platforms) {
                var platform = _items.platforms[key];
                var foundPlatform = false;

                if (platform.hasOwnProperty("buildings")) {
                    platform.buildings.children.find(function (buildingUuid) {

                        var foundBuilding = platform.buildings[buildingUuid].name === buildingName;

                        if (foundBuilding) {
                            var parent = platform.buildings[buildingUuid];

                            for (var i = 2; i <= topicParts.length - 2; i++) {
                                var deviceName = topicParts[i];

                                if (parent.hasOwnProperty("devices")) {
                                    parent.devices.children.find(function (deviceUuid) {

                                        var foundDevice = parent.devices[deviceUuid].name === deviceName;

                                        if (foundDevice) {
                                            parent = parent.devices[deviceUuid];
                                        }

                                        return foundDevice;
                                    });
                                }
                            }

                            if (parent.hasOwnProperty("points")) {
                                parent.points.children.find(function (point) {
                                    var foundPoint = parent.points[point].topic === topic;

                                    if (foundPoint) {
                                        path = parent.points[point].path;

                                        foundPlatform = true;
                                    }

                                    return foundPoint;
                                });
                            }
                        }

                        return foundBuilding;
                    });
                }

                if (foundPlatform) {
                    break;
                }
            }
        }

    return JSON.parse(JSON.stringify(path));
};

platformsPanelItemsStore.getItem = function (itemPath) {
    var itemsList = [];
    var item = _items;

    for (var i = 0; i < itemPath.length; i++) {
        if (item.hasOwnProperty(itemPath[i])) {
            item = item[itemPath[i]];
        }
    }

    return item;
};

platformsPanelItemsStore.getChildren = function (parent, parentPath) {

    var itemsList = [];
    var item = _items;

    if (parentPath !== null) // for everything but the top level, drill down to the parent
        {
            var validPath = true;

            for (var i = 0; i < parentPath.length; i++) {
                if (item.hasOwnProperty(parentPath[i])) {
                    item = item[parentPath[i]];
                } else {
                    validPath = false;
                }
            }

            if (validPath) {
                for (var i = 0; i < item.children.length; i++) {
                    itemsList.push(item[item.children[i]]);
                }
            }
        } else {
        for (var key in item[parent]) {
            itemsList.push(item[parent][key]);
        }
    }

    return itemsList;
};

platformsPanelItemsStore.loadFilteredItems = function (filterTerm, filterStatus) {

    var filterItems = function filterItems(parent, filterTerm, filterStatus) {

        var notAMatch;
        var compareTerm;

        if (filterTerm === "") {
            notAMatch = function notAMatch(parent, filterStatus) {
                if (parent.hasOwnProperty("status")) {
                    return parent.status !== filterStatus;
                } else {
                    return filterStatus !== "UNKNOWN";
                }
            };

            compareTerm = filterStatus;
        } else if (filterStatus === "") {
            notAMatch = function notAMatch(parent, filterTerm) {
                var upperParent = parent.name.toUpperCase();;
                var filterStr = filterTerm;

                var filterParts = filterTerm.split(" ");
                var foundColon = filterParts[0].indexOf(":") > -1;

                if (foundColon) {
                    var index = filterTerm.indexOf(":");
                    var filterKey = filterTerm.substring(0, index);
                    filterStr = filterTerm.substring(index + 1);

                    if (parent.hasOwnProperty(filterKey)) {
                        upperParent = parent[filterKey].toUpperCase();
                    } else {
                        return true;
                    }
                }

                return upperParent.trim().indexOf(filterStr.trim().toUpperCase()) < 0;
            };

            compareTerm = filterTerm;
        }

        if (parent.children.length === 0) {
            parent.visible = !notAMatch(parent, compareTerm);
            parent.expanded = null;

            return parent;
        } else {
            var childrenToHide = 0;

            for (var i = 0; i < parent.children.length; i++) {
                var childString = parent.children[i];
                var filteredChild = filterItems(parent[childString], filterTerm, filterStatus);

                if (!filteredChild.visible) {
                    ++childrenToHide;
                }
            }

            if (childrenToHide === parent.children.length) {
                parent.visible = !notAMatch(parent, compareTerm);
                parent.expanded = false;
            } else {
                parent.visible = true;
                parent.expanded = true;
            }

            return parent;
        }
    };

    for (var key in _items.platforms) {
        if (filterTerm !== "" || filterStatus !== "") {
            filterItems(_items.platforms[key], filterTerm, filterStatus);
        } else {
            expandAllChildren(_items.platforms[key], false);
            _items.platforms[key].visible = true;
        }
    }
};

var expandAllChildren = function expandAllChildren(parent, expanded) {

    for (var i = 0; i < parent.children.length; i++) {
        var childString = parent.children[i];
        expandAllChildren(parent[childString], expanded);
    }

    if (parent.children.length > 0) {
        parent.expanded = expanded;
    } else {
        parent.expanded = null;
    }

    parent.visible = true;
};

platformsPanelItemsStore.getExpanded = function () {
    return _expanded;
};

platformsPanelItemsStore.getLoadingComplete = function (panelItem) {

    var loadingComplete = null;

    if (_loadingDataComplete.hasOwnProperty(panelItem.uuid)) {
        loadingComplete = _loadingDataComplete[panelItem.uuid];
    }

    return loadingComplete;
};

platformsPanelItemsStore.dispatchToken = dispatcher.register(function (action) {

    switch (action.type) {

        case ACTION_TYPES.CLEAR_AUTHORIZATION:

            _items.platforms = {};
            _loadingDataComplete = {};
            _expanded = false;
            _lastCheck = false;

            break;
        case ACTION_TYPES.FILTER_ITEMS:

            var filterTerm = action.filterTerm;
            var filterStatus = action.filterStatus;
            platformsPanelItemsStore.loadFilteredItems(filterTerm, filterStatus);
            _lastCheck = false;

            platformsPanelItemsStore.emitChange();

            break;
        case ACTION_TYPES.EXPAND_ALL:

            var item = platformsPanelItemsStore.getItem(action.itemPath);

            var expanded = item.expanded !== null ? !item.expanded : true;

            expandAllChildren(item, expanded);
            _lastCheck = false;

            platformsPanelItemsStore.emitChange();

            break;

        case ACTION_TYPES.TOGGLE_ITEM:

            var item = platformsPanelItemsStore.getItem(action.itemPath);
            item.expanded = !item.expanded;
            _lastCheck = false;

            platformsPanelItemsStore.emitChange();

            break;

        case ACTION_TYPES.CHECK_ITEM:

            var item = platformsPanelItemsStore.getItem(action.itemPath);
            item.checked = action.checked;
            _lastCheck = action.checked;

            platformsPanelItemsStore.emitChange();

            break;

        case ACTION_TYPES.START_LOADING_DATA:

            _loadingDataComplete[action.panelItem.uuid] = false;
            _lastCheck = false;

            break;

        case ACTION_TYPES.RECEIVE_PLATFORM_STATUSES:

            var platforms = action.platforms;

            platforms.forEach(function (platform) {
                if (!action.reload || !_items["platforms"].hasOwnProperty(platform.uuid)) {
                    _items["platforms"][platform.uuid] = platform;

                    var platformItem = _items["platforms"][platform.uuid];

                    platformItem.path = ["platforms", platform.uuid];
                    platformItem.status = platform.health.status.toUpperCase();
                    platformItem.statusLabel = getStatusLabel(platformItem.status);
                    platformItem.context = platform.health.context;
                    platformItem.children = [];
                    platformItem.type = "platform";
                    platformItem.visible = true;
                    platformItem.expanded = null;
                }
            });

            var platformsToRemove = [];

            for (var key in _items.platforms) {
                var match = platforms.find(function (platform) {
                    return key === platform.uuid;
                });

                if (!match) {
                    platformsToRemove.push(key);
                }
            }

            platformsToRemove.forEach(function (uuid) {
                delete _items.platforms[uuid];
            });

            _lastCheck = false;

            platformsPanelItemsStore.emitChange();
            break;
        case ACTION_TYPES.RECEIVE_AGENT_STATUSES:

            var platform = _items["platforms"][action.platform.uuid];

            if (action.agents.length > 0) {
                insertAgents(platform, action.agents);
            }

            break;
        case ACTION_TYPES.RECEIVE_DEVICE_STATUSES:

            var platform = _items["platforms"][action.platform.uuid];

            if (action.devices.length > 0) {
                insertDevices(platform, action.devices);
            }

            break;
        case ACTION_TYPES.RECEIVE_PERFORMANCE_STATS:

            switch (action.parent.type) {
                case "platform":

                    var platform = _items["platforms"][action.parent.uuid];

                    if (action.points.length > 0) {
                        platform.expanded = true;
                        platform.points = {};
                        platform.points.path = platform.path.slice(0);
                        platform.points.path.push("points");
                        platform.points.name = "Performance";
                        platform.points.expanded = false;
                        platform.points.visible = true;
                        platform.points.children = [];
                        platform.points.type = "type";
                        platform.points.status = platform.status;
                        platform.points.statusLabel = getStatusLabel(platform.status);
                        platform.points.sortOrder = _pointsOrder;

                        if (platform.children.indexOf("points") < 0) {
                            platform.children.push("points");
                        }

                        action.points.forEach(function (point) {
                            var pointProps = point;
                            pointProps.expanded = false;
                            pointProps.visible = true;
                            pointProps.path = platform.points.path.slice(0);

                            var uuid = point.hasOwnProperty("topic") ? point.topic : point.uuid;

                            pointProps.uuid = uuid;
                            pointProps.path.push(uuid);
                            pointProps.topic = point.topic;

                            pointProps.parentPath = getParentPath(platform);

                            pointProps.parentType = platform.type;
                            pointProps.parentUuid = platform.uuid;

                            pointProps.checked = chartStore.getTopicInCharts(pointProps.topic, pointProps.name);

                            pointProps.status = platform.status;
                            pointProps.statusLabel = getStatusLabel(platform.status);
                            pointProps.children = [];
                            pointProps.type = "point";
                            pointProps.sortOrder = 0;
                            platform.points.children.push(uuid);
                            platform.points[uuid] = pointProps;
                        });
                    }

                    break;
            }

            _lastCheck = false;

            platformsPanelItemsStore.emitChange();
            break;

        case ACTION_TYPES.END_LOADING_DATA:

            _loadingDataComplete[action.panelItem.uuid] = true;

            updatePlatformStatus(action.panelItem.uuid);

            _lastCheck = false;

            platformsPanelItemsStore.emitChange();

            break;
    }

    function insertAgents(platform, agents) {
        var agentsToInsert = JSON.parse(JSON.stringify(agents));

        platform.agents = {};
        platform.agents.path = JSON.parse(JSON.stringify(platform.path));
        platform.agents.path.push("agents");
        platform.agents.name = "Agents";
        platform.agents.expanded = false;
        platform.agents.visible = true;
        platform.agents.children = [];
        platform.agents.type = "type";
        platform.agents.sortOrder = _agentsOrder;

        if (platform.children.indexOf("agents") < 0) {
            platform.children.push("agents");
        }

        var agentsHealth;

        agentsToInsert.forEach(function (agent) {
            var agentProps = agent;
            agentProps.expanded = false;
            agentProps.visible = true;
            agentProps.path = JSON.parse(JSON.stringify(platform.agents.path));
            agentProps.path.push(agent.uuid);
            agentProps.status = agent.health.status.toUpperCase();
            agentProps.statusLabel = getStatusLabel(agentProps.status);
            agentProps.context = agent.health.context;
            agentProps.children = [];
            agentProps.type = "agent";
            agentProps.sortOrder = 0;
            platform.agents.children.push(agent.uuid);
            platform.agents[agent.uuid] = agentProps;

            agentsHealth = checkStatuses(agentsHealth, agentProps);
        });

        platform.agents.status = agentsHealth;
        platform.agents.statusLabel = getStatusLabel(agentsHealth);
    }

    function insertBuilding(platform, uuid, name) {
        if (platform.children.indexOf("buildings") < 0) {
            platform.children.push("buildings");

            platform.buildings = {};
            platform.buildings.name = "Buildings";
            platform.buildings.children = [];
            platform.buildings.path = JSON.parse(JSON.stringify(platform.path));
            platform.buildings.path.push("buildings");
            platform.buildings.expanded = false;
            platform.buildings.visible = true;
            platform.buildings.type = "type";
            platform.buildings.sortOrder = _buildingsOrder;
        }

        if (!platform.buildings.hasOwnProperty(uuid)) {
            var buildingProps = {};
            buildingProps.name = name;
            buildingProps.uuid = uuid;

            buildingProps.expanded = false;
            buildingProps.visible = true;
            buildingProps.path = JSON.parse(JSON.stringify(platform.buildings.path));
            buildingProps.path.push(buildingProps.uuid);
            buildingProps.status = "UNKNOWN";
            buildingProps.statusLabel = getStatusLabel(buildingProps.status);
            buildingProps.children = ["devices"];
            buildingProps.type = "building";
            buildingProps.sortOrder = 0;

            buildingProps.devices = {};
            buildingProps.devices.path = JSON.parse(JSON.stringify(buildingProps.path));
            buildingProps.devices.path.push("devices");
            buildingProps.devices.name = "Devices";
            buildingProps.devices.expanded = false;
            buildingProps.devices.visible = true;
            buildingProps.devices.children = [];
            buildingProps.devices.type = "type";
            buildingProps.devices.sortOrder = _devicesOrder;

            platform.buildings.children.push(buildingProps.uuid);
            platform.buildings[buildingProps.uuid] = buildingProps;
        }

        return platform.buildings[uuid];
    }

    function insertDevices(platform, devices) {
        var devicesToInsert = JSON.parse(JSON.stringify(devices));

        var buildings = [];

        if (devicesToInsert.length > 0) {
            //Make a 2D array where each row is another level 
            // of devices and subdevices in the tree
            var nestedDevices = [];
            var level = 3;
            var deviceCount = 0;

            while (deviceCount < devicesToInsert.length) {
                var levelList = [];

                devicesToInsert.forEach(function (device) {

                    var deviceParts = device.path.split("/");

                    if (deviceParts.length === level) {
                        levelList.push(device);
                        ++deviceCount;
                    }
                });

                if (levelList.length > 0) {
                    nestedDevices.push(levelList);
                }

                ++level;
            }
        }

        //Now we can add each row of devices, confident
        // that any parent devices will be added to the tree
        // before their subdevices
        nestedDevices.forEach(function (level, row) {

            level.forEach(function (device) {

                var pathParts = device.path.split("/");
                var buildingUuid = pathParts[0] + "_" + pathParts[1];
                var buildingName = pathParts[1];
                var legendInfo = pathParts[0] + " > " + buildingName;

                var building = insertBuilding(platform, buildingUuid, buildingName);

                insertDevice(device, building, legendInfo, row);

                var alreadyInTree = buildings.find(function (building) {
                    return building.uuid === buildingUuid;
                });

                if (!alreadyInTree) {
                    buildings.push(building);
                }
            });
        });

        buildings.forEach(function (blg) {

            var buildingHealth;

            blg.devices.children.forEach(function (device) {
                buildingHealth = checkStatuses(buildingHealth, blg.devices[device]);
            });

            blg.devices.status = buildingHealth;
            blg.devices.statusLabel = getStatusLabel(buildingHealth);

            blg.status = buildingHealth;
            blg.statusLabel = getStatusLabel(buildingHealth);
        });

        var buildingsHealth;

        buildings.forEach(function (blg) {
            buildingsHealth = checkStatuses(buildingsHealth, blg);
        });

        platform.buildings.status = buildingsHealth;
        platform.buildings.statusLabel = getStatusLabel(buildingsHealth);
    }

    function insertDevice(device, building, legendInfo, row) {
        switch (row) {
            case 0:
                //top-level devices

                var deviceParts = device.path.split("/");

                var deviceProps = {};
                deviceProps.name = deviceParts[deviceParts.length - 1];
                deviceProps.uuid = device.path.replace(/\//g, '_');
                deviceProps.expanded = false;
                deviceProps.visible = true;
                deviceProps.path = JSON.parse(JSON.stringify(building.devices.path));
                deviceProps.path.push(deviceProps.uuid);
                deviceProps.status = device.health.status.toUpperCase();
                deviceProps.statusLabel = getStatusLabel(deviceProps.status);
                deviceProps.context = device.health.context;
                deviceProps.children = [];
                deviceProps.type = "device";
                deviceProps.sortOrder = 0;

                deviceProps.legendInfo = legendInfo + " > " + deviceProps.name;

                checkForPoints(deviceProps, device);

                building.devices.children.push(deviceProps.uuid);
                building.devices[deviceProps.uuid] = deviceProps;

                break;
            default:
                //subdevices:
                var deviceParts = device.path.split("/");

                var subDeviceLevel = deviceParts.length - 1;

                // the top two spots in the device path are the campus and building,
                // so add 2 to the row and that should equal the subdevice's level
                if (subDeviceLevel !== row + 2) {
                    console.log("wrong level number");
                } else {
                    //Now find the subdevice's parent device by using the parts of its path
                    // to walk the tree
                    var parentPath = JSON.parse(JSON.stringify(building.path));
                    var parentDevice = building; // start at the building
                    var currentLevel = 2; // the level of the top-level devices

                    while (currentLevel < subDeviceLevel) {
                        var parentDeviceUuid = deviceParts[0];

                        for (var i = 1; i <= currentLevel; i++) {
                            parentDeviceUuid = parentDeviceUuid + "_" + deviceParts[i];
                        }

                        parentDevice = parentDevice.devices;
                        parentDevice = parentDevice[parentDeviceUuid];
                        ++currentLevel;
                    }

                    var deviceProps = {};
                    deviceProps.name = deviceParts[subDeviceLevel];
                    deviceProps.uuid = device.path.replace(/ \/ /g, '_');
                    deviceProps.expanded = false;
                    deviceProps.visible = true;
                    deviceProps.path = JSON.parse(JSON.stringify(parentDevice.path));
                    deviceProps.path.push("devices");
                    deviceProps.path.push(deviceProps.uuid);
                    deviceProps.status = device.health.status.toUpperCase();
                    deviceProps.statusLabel = getStatusLabel(deviceProps.status);
                    deviceProps.context = device.health.context;
                    deviceProps.children = [];
                    deviceProps.type = "device";
                    deviceProps.sortOrder = 0;

                    deviceProps.legendInfo = parentDevice.legendInfo + " > " + deviceProps.name;

                    checkForPoints(deviceProps, device);

                    //If we haven't added any subdevices to the parent device 
                    // yet, initialize its "devices" child
                    if (parentDevice.children.indexOf("devices") < 0) {
                        parentDevice.children.push("devices");

                        parentDevice.devices = {};
                        parentDevice.devices.path = JSON.parse(JSON.stringify(parentDevice.path));
                        parentDevice.devices.path.push("devices");
                        parentDevice.devices.name = "Devices";
                        parentDevice.devices.expanded = false;
                        parentDevice.devices.visible = true;
                        parentDevice.devices.children = [];
                        parentDevice.devices.type = "type";
                        parentDevice.devices.sortOrder = _devicesOrder;
                        parentDevice.devices.status = deviceProps.status;
                        parentDevice.devices.statusLabel = getStatusLabel(deviceProps.status);
                        parentDevice.devices.context = deviceProps.context;
                    }

                    parentDevice.devices.children.push(deviceProps.uuid);
                    parentDevice.devices[deviceProps.uuid] = deviceProps;

                    if (parentDevice.devices.children.length > 1) {
                        updateDeviceGroupStatus(parentDevice);
                    }
                }

                break;
        }
    }

    function checkForPoints(item, data) {
        if (data.hasOwnProperty("points")) {
            if (item.children.indexOf("points") < 0) {
                item.children.push("points");

                item.points = {};
                item.points.path = JSON.parse(JSON.stringify(item.path));
                item.points.path.push("points");
                item.points.name = "Points";
                item.points.expanded = false;
                item.points.visible = true;
                item.points.status = item.status;
                item.points.statusLabel = getStatusLabel(item.status);
                item.points.children = [];
                item.points.type = "type";
                item.points.sortOrder = _pointsOrder;
            }

            data.points.forEach(function (pointName) {

                var pointPath = data.path + "/" + pointName;
                var platformUuid = item.path[1];

                var pattern = /[!@#$%^&*()+\-=\[\]{};':"\\|, .<>\/?]/g;

                var pointProps = {};
                pointProps.topic = pointPath;
                pointProps.name = pointName;
                pointProps.uuid = pointPath.replace(pattern, '_');
                pointProps.expanded = false;
                pointProps.visible = true;
                pointProps.path = JSON.parse(JSON.stringify(item.points.path));
                pointProps.path.push(pointProps.uuid);
                pointProps.parentPath = item.legendInfo;
                pointProps.parentType = item.type;
                pointProps.parentUuid = platformUuid;
                pointProps.status = item.status;
                pointProps.statusLabel = getStatusLabel(item.status);
                pointProps.context = item.context;
                pointProps.children = [];
                pointProps.type = "point";
                pointProps.sortOrder = 0;
                pointProps.checked = chartStore.getTopicInCharts(pointProps.topic, pointProps.name);

                item.points.children.push(pointProps.uuid);
                item.points[pointProps.uuid] = pointProps;
            });
        }
    }

    function getParentPath(parent) {
        var path = parent.path;

        var pathParts = [];

        var item = _items;

        path.forEach(function (part) {
            item = item[part];
            if (_itemTypes.indexOf(part) < 0) {
                pathParts.push(item.name);
            }
        });

        var pathStr = pathParts.join(" > ");

        return pathStr;
    }

    function updatePlatformStatus(uuid) {
        if (_items.platforms.hasOwnProperty(uuid)) {
            var platform = JSON.parse(JSON.stringify(_items.platforms[uuid]));

            if (_items.platforms[uuid].hasOwnProperty("agents")) {
                var agentsHealth = _items.platforms[uuid].agents.status;
                platform.status = checkStatuses(agentsHealth, platform);
            }

            if (platform.status === "GOOD" || platform.status === "UNKNOWN") {
                if (_items.platforms[uuid].hasOwnProperty("buildings")) {
                    var buildingsHealth = _items.platforms[uuid].buildings.status;
                    platform.status = checkStatuses(buildingsHealth, platform);
                }
            }

            if (platform.status === "GOOD" || platform.status === "UNKNOWN") {
                if (_items.platforms[uuid].hasOwnProperty("points")) {
                    var pointsHealth = _items.platforms[uuid].points.status;
                    platform.status = checkStatuses(pointsHealth, platform);
                }
            }

            if (platform.status !== _items.platforms[uuid].status) {
                _items.platforms[uuid].status = platform.status;
                _items.platforms[uuid].statusLabel = getStatusLabel(platform.status);
                _items.platforms[uuid].context = "Status problems found.";
            }
        }
    }

    function updateDeviceGroupStatus(parent) {
        var parentDevice = JSON.parse(JSON.stringify(parent));

        if (parentDevice.hasOwnProperty("devices")) {
            parentDevice.devices.children.forEach(function (uuid) {
                var subDeviceHealth = checkStatuses(parentDevice.devices[uuid].status, parentDevice.devices);

                if (subDeviceHealth !== parent.devices.status) {
                    parent.devices.status = subDeviceHealth;
                    parent.devices.statusLabel = getStatusLabel(subDeviceHealth);
                }
            });
        }

        var deviceGroupHealth = checkStatuses(parent.devices.status, parentDevice);
        if (deviceGroupHealth !== parent.status) {
            parent.status = deviceGroupHealth;
            parent.statusLabel = getStatusLabel(deviceGroupHealth);
            parent.context = "Status problems found.";
        }
    }

    function checkStatuses(health, item) {
        if (typeof health === "undefined") {
            health = item.status;
        } else {
            switch (health) {
                case "UNKNOWN":

                    switch (item.status) {
                        case "BAD":
                            health = "BAD";
                            break;
                    }
                    break;
                case "GOOD":
                    health = item.status;
            }
        }

        return health;
    }

    function getStatusLabel(status) {
        var statusLabel;

        switch (status) {
            case "GOOD":
                statusLabel = _goodLabel;
                break;
            case "BAD":
                statusLabel = _badLabel;
                break;
            case "UNKNOWN":
                statusLabel = _unknownLabel;
                break;
        }

        return statusLabel;
    }
});

module.exports = platformsPanelItemsStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"../stores/platform-chart-store":61}],63:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _expanded = null;

var platformsPanelStore = new Store();

platformsPanelStore.getExpanded = function () {
    return _expanded;
};

platformsPanelStore.dispatchToken = dispatcher.register(function (action) {

    switch (action.type) {

        case ACTION_TYPES.TOGGLE_PLATFORMS_PANEL:
            _expanded === null ? _expanded = true : _expanded = !_expanded;
            platformsPanelStore.emitChange();
            break;
        case ACTION_TYPES.CLEAR_AUTHORIZATION:
            _expanded = null;
            platformsPanelStore.emitChange();
            break;
    }
});

module.exports = platformsPanelStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52}],64:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('./authorization-store');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _platforms = null;
var _initialized = false;

var platformsStore = new Store();

platformsStore.getPlatform = function (uuid) {
    var foundPlatform = null;

    if (_platforms) {
        _platforms.some(function (platform) {
            if (platform.uuid === uuid) {
                foundPlatform = platform;
                return true;
            }
        });
    }

    return foundPlatform;
};

platformsStore.getPlatforms = function () {
    return _platforms;
};

platformsStore.getVcInstance = function () {
    var vc;

    if (_platforms) {
        if (_platforms.length) {
            vc = _platforms.find(function (platform) {

                var hasVcAgent = false;

                if (platform.agents) {
                    if (platform.agents.length) {
                        var vcAgent = platform.agents.find(function (agent) {
                            return agent.name.toLowerCase().indexOf("volttroncentral") > -1;
                        });

                        if (vcAgent) {
                            hasVcAgent = true;
                        }
                    }
                }

                return hasVcAgent;
            });
        }
    }

    return vc;
};

platformsStore.getAgentRunning = function (platform, agentType) {

    var agentRunning = false;

    if (platform) {
        if (platform.hasOwnProperty("agents")) {
            var agentToFind = platform.agents.find(function (agent) {
                return agent.name.toLowerCase().indexOf(agentType) > -1;
            });

            if (agentToFind) {
                agentRunning = agentToFind.process_id !== null && agentToFind.return_code === null;
            }
        }
    }

    return agentRunning;
};

platformsStore.getVcHistorianRunning = function () {

    var platform = platformsStore.getVcInstance();
    var historianRunning = platformsStore.getAgentRunning(platform, "historian");

    return historianRunning;
};

platformsStore.getRunningBacnetProxies = function (uuid) {
    var bacnetProxies = [];

    if (_platforms) {
        if (_platforms.length) {
            var foundPlatform = _platforms.find(function (platform) {
                return platform.uuid === uuid;
            });

            if (foundPlatform) {
                if (foundPlatform.hasOwnProperty("agents")) {
                    bacnetProxies = foundPlatform.agents.filter(function (agent) {

                        var runningProxy = agent.name.toLowerCase().indexOf("bacnet_proxy") > -1 && agent.actionPending === false && agent.process_id !== null && agent.return_code === null;

                        return runningProxy;
                    });
                }
            }
        }
    }

    return bacnetProxies;
};

platformsStore.getForwarderRunning = function (platformUuid) {

    var platform = platformsStore.getPlatform(platformUuid);
    var forwarderRunning = platformsStore.getAgentRunning(platform, "forwarderagent");

    return forwarderRunning;
};

platformsStore.getInitialized = function () {
    return _initialized;
};

platformsStore.dispatchToken = dispatcher.register(function (action) {
    dispatcher.waitFor([authorizationStore.dispatchToken]);

    switch (action.type) {
        case ACTION_TYPES.CLEAR_AUTHORIZATION:
            _platforms = null;
            break;

        case ACTION_TYPES.WILL_INITIALIZE_PLATFORMS:
            _initialized = true;
            break;

        case ACTION_TYPES.RECEIVE_PLATFORMS:
            _platforms = action.platforms;
            platformsStore.emitChange();
            break;

        case ACTION_TYPES.RECEIVE_PLATFORM:
            platformsStore.emitChange();
            break;
    }
});

module.exports = platformsStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52,"./authorization-store":56}],65:[function(require,module,exports){
'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

var _statusMessage = null;
var _status = null;
var _highlight = null;
var _align = null;

var statusIndicatorStore = new Store();

statusIndicatorStore.getStatusMessage = function () {

    var status = {
        statusMessage: _statusMessage,
        status: _status
    };

    if (_highlight) {
        status.highlight = _highlight;
    }

    if (_align) {
        status.align = _align;
    }

    return status;
};

statusIndicatorStore.getStatus = function () {
    return _status;
};

statusIndicatorStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {
        case ACTION_TYPES.OPEN_STATUS:
            _statusMessage = action.message;
            _status = action.status;
            _highlight = action.highlight;
            _align = action.align;

            statusIndicatorStore.emitChange();
            break;

        case ACTION_TYPES.CLOSE_STATUS:
            _statusMessage = {};
            _status = null;
            statusIndicatorStore.emitChange();
            break;
    }
});

module.exports = statusIndicatorStore;

},{"../constants/action-types":47,"../dispatcher":48,"../lib/store":52}]},{},[1]);

'use strict';

var ACTION_TYPES = require('../constants/action-types');
var authorizationStore = require('../stores/authorization-store');
var platformsPanelItemsStore = require('../stores/platforms-panel-items-store');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var dispatcher = require('../dispatcher');
var rpc = require('../lib/rpc');

var platformsPanelActionCreators = {    
    togglePanel: function() {

        dispatcher.dispatch({
            type: ACTION_TYPES.TOGGLE_PLATFORMS_PANEL,
        });
    },

    closePanel: function() {

        dispatcher.dispatch({
            type: ACTION_TYPES.CLOSE_PLATFORMS_PANEL,
        });
    },

    loadChildren: function(type, parent)
    {
        if (type === "platform")
        {
            dispatcher.dispatch({
                type: ACTION_TYPES.START_LOADING_DATA
            });

            loadPanelDevices(parent);
        }        

        function loadPerformanceStats(parent) {

            if (parent.type === "platform")
            {
                var authorization = authorizationStore.getAuthorization();

                //TODO: use service to get performance for a single platform

                new rpc.Exchange({
                    method: 'list_performance',
                    authorization: authorization,
                    }).promise
                        .then(function (result) {
                            
                            var platformPerformance = result.find(function (item) {
                                return item["platform.uuid"] === parent.uuid;
                            });

                            var pointsList = [];

                            if (platformPerformance)
                            {
                                var points = platformPerformance.performance.points;

                                points.forEach(function (point) {

                                    pointsList.push({
                                        "topic": platformPerformance.performance.topic + "/" + point,
                                        "name": point.replace("/", " / ")
                                    });
                                });                                
                            }

                            dispatcher.dispatch({
                                type: ACTION_TYPES.RECEIVE_PERFORMANCE_STATS,
                                parent: parent,
                                points: pointsList
                            });
                        })
                        .catch(rpc.Error, function (error) {
                            
                            var message = error.message;

                            if (error.code === -32602)
                            {
                                if (error.message === "historian unavailable")
                                {
                                    message = "Data could not be fetched. The historian agent is unavailable."
                                }
                            }

                            statusIndicatorActionCreators.openStatusIndicator("error", message);
                            handle401(error);
                        });   
            } 
        }

        function loadPanelDevices(platform) {
            var authorization = authorizationStore.getAuthorization();

            new rpc.Exchange({
                method: 'platforms.uuid.' + platform.uuid + '.get_devices',
                authorization: authorization,
            }).promise
                .then(function (result) {
                    
                    var devicesList = [];

                    for (var key in result)
                    {
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
                    
                })
                .catch(rpc.Error, handle401);    

        }

        function loadPanelAgents(platform) {
            var authorization = authorizationStore.getAuthorization();

            new rpc.Exchange({
                method: 'platforms.uuid.' + platform.uuid + '.list_agents',
                authorization: authorization,
            }).promise
                .then(function (agentsList) {
                    
                    dispatcher.dispatch({
                        type: ACTION_TYPES.RECEIVE_AGENT_STATUSES,
                        platform: platform,
                        agents: agentsList
                    });

                    loadPerformanceStats(platform);
                })
                .catch(rpc.Error, handle401);    
        }
            // dispatcher.dispatch({
            //     type: ACTION_TYPES.RECEIVE_AGENT_STATUSES,
            //     platform: platform
            // });
        // }
    
    },

    loadFilteredItems: function (filterTerm, filterStatus)
    {
        dispatcher.dispatch({
            type: ACTION_TYPES.FILTER_ITEMS,
            filterTerm: filterTerm,
            filterStatus: filterStatus
        });
    },

    expandAll: function (itemPath) {

        dispatcher.dispatch({
            type: ACTION_TYPES.EXPAND_ALL,
            itemPath: itemPath
        });
    },

    toggleItem: function (itemPath) {

        dispatcher.dispatch({
            type: ACTION_TYPES.TOGGLE_ITEM,
            itemPath: itemPath
        });
    },

    checkItem: function (itemPath, checked) {

        dispatcher.dispatch({
            type: ACTION_TYPES.CHECK_ITEM,
            itemPath: itemPath,
            checked: checked
        });
    },

    addToChart: function(panelItem) {

        var authorization = authorizationStore.getAuthorization();

        new rpc.Exchange({
            method: 'platforms.uuid.' + panelItem.parentUuid + '.historian.query',
            params: {
                topic: panelItem.topic,
                count: 20,
                order: 'LAST_TO_FIRST',
            },
            authorization: authorization,
        }).promise
            .then(function (result) {
                panelItem.data = result.values;

                panelItem.data.forEach(function (datum) {
                    datum.name = panelItem.name;
                    datum.parent = panelItem.parentPath;
                    datum.uuid = panelItem.uuid;
                });

                dispatcher.dispatch({
                    type: ACTION_TYPES.SHOW_CHARTS
                });

                dispatcher.dispatch({
                    type: ACTION_TYPES.ADD_TO_CHART,
                    panelItem: panelItem
                });
            })
            .catch(rpc.Error, function (error) {
                
                var message = error.message;

                if (error.code === -32602)
                {
                    if (error.message === "historian unavailable")
                    {
                        message = "Data could not be fetched. The historian agent is unavailable."
                    }
                }

                statusIndicatorActionCreators.openStatusIndicator("error", message);
                handle401(error);
            });
    },

    removeFromChart: function(panelItem) {

        dispatcher.dispatch({
            type: ACTION_TYPES.REMOVE_FROM_CHART,
            panelItem: panelItem
        });  

    }
}




function handle401(error) {
    if (error.code && error.code === 401) {
        dispatcher.dispatch({
            type: ACTION_TYPES.RECEIVE_UNAUTHORIZED,
            error: error,
        });

        platformManagerActionCreators.clearAuthorization();

        statusIndicatorActionCreators.openStatusIndicator("error", error.message);
    }
};

module.exports = platformsPanelActionCreators;

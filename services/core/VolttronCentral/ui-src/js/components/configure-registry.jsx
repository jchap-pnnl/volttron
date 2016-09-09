'use strict';

import React from 'react';
import BaseComponent from './base-component';
import EditPointForm from './edit-point-form';
import ConfigDeviceForm from './config-device-form';
import EditSelectButton from './control_buttons/edit-select-button';
import EditColumnButton from './control_buttons/edit-columns-button';

var devicesActionCreators = require('../action-creators/devices-action-creators');
var devicesStore = require('../stores/devices-store');
var FilterPointsButton = require('./control_buttons/filter-points-button');
var ControlButton = require('./control-button');
var ConfirmForm = require('./confirm-form');
var modalActionCreators = require('../action-creators/modal-action-creators');

class ConfigureRegistry extends BaseComponent {    
    constructor(props) {
        super(props);
        this._bind("_onFilterBoxChange", "_onClearFilter", "_onAddPoint", "_onRemovePoints", "_removePoints", 
            "_selectForDelete", "_selectAll", "_onAddColumn", "_onCloneColumn", "_onRemoveColumn", "_removeColumn",
            "_updateCell", "_onFindNext", "_onReplace", "_onReplaceAll", "_onClearFind", "_cancelRegistry",
            "_saveRegistry", "_removeFocus", "_resetState", "_showProps", "_handleRowClick", "_getRealIndex" );

        this.state = this._resetState(this.props.device);
    }
    componentDidMount() {
        this.containerDiv = document.getElementsByClassName("fixed-table-container-inner")[0];
        this.fixedHeader = document.getElementsByClassName("header-background")[0];
        this.fixedInner = document.getElementsByClassName("fixed-table-container-inner")[0];
        this.registryTable = document.getElementsByClassName("registryConfigTable")[0];
    }
    componentDidUpdate() {

        if (this.scrollToBottom)
        {
            this.containerDiv.scrollTop = this.containerDiv.scrollHeight;

            this.scrollToBottom = false;
        }

        if (this.resizeTable)
        {
            this.fixedHeader.style.width = this.registryTable.clientWidth + "px";
            this.fixedInner.style.width = this.registryTable.clientWidth + "px";

            this.resizeTable = false;
        }

        if (this.state.selectedCellRow !== null)
        {
            var focusedCell = document.getElementsByClassName("focusedCell")[0];
            if (focusedCell)
            {
                focusedCell.focus();
            }
        }

    }
    componentWillReceiveProps(nextProps) {
        this.setState(this._resetState(nextProps.device));
    }
    _resetState(device){
    
        var state = {};    

        state.keyPropsList = device.keyProps;
        state.filterColumn = state.keyPropsList[0];

        state.registryValues = getPointsFromStore(device, state.keyPropsList);

        state.columnNames = [];
        state.pointNames = [];
        state.filteredList = [];

        state.selectedPoints = devicesStore.getSelectedPoints(device);

        if (state.registryValues.length > 0)
        {
            state.columnNames = state.registryValues[0].attributes.map(function (columns) {
                return columns.key;
            });

            state.pointNames = state.registryValues.map(function (row) {
                return row.attributes[0].value;
            });
        }

        state.pointsToDelete = [];
        state.allSelected = false;

        state.selectedCells = [];
        state.selectedCellRow = null;
        state.selectedCellColumn = null;

        state.filterOn = false;

        this.scrollToBottom = false;
        this.resizeTable = false;

        return state;
    }
    _onFilterBoxChange(filterValue, column) {
        this.setState({ filterOn: true });

        this.setState({ registryValues: getFilteredPoints(
                                            this.state.registryValues, 
                                            filterValue,
                                            column
                                        ) });
    }
    _onClearFilter() {
        this.setState({ filterOn: false });
    }
    _onAddPoint() {

        var pointNames = this.state.pointNames;

        pointNames.push("");

        this.setState({ pointNames: pointNames });

        var registryValues = this.state.registryValues;

        var pointValues = [];

        this.state.columnNames.forEach(function (columnName) {
            pointValues.push({ 
                                "key" : columnName, 
                                "value": "", 
                                "editable": true, 
                                "keyProp": (this.state.keyPropsList.indexOf(columnName) > -1) 
                            });
        }, this);

        registryValues.push({visible: true, attributes: pointValues});

        this.setState({ registryValues: registryValues });

        this.scrollToBottom = true;
    }
    _onRemovePoints() {

        var promptText, confirmText, confirmAction, cancelText;

        if (this.state.pointsToDelete.length > 0)
        {
            promptText = "Are you sure you want to delete these points? " + this.state.pointsToDelete.join(", ");
            confirmText = "Delete";
            confirmAction = this._removePoints.bind(this, this.state.pointsToDelete);
        }  
        else
        {
            promptText = "Select points to delete.";
            cancelText = "OK";
        }
        
        modalActionCreators.openModal(
            <ConfirmForm
                promptTitle="Remove Points"
                promptText={ promptText }
                confirmText={ confirmText }
                onConfirm={ confirmAction }
                cancelText={ cancelText }
            ></ConfirmForm>
        );
    }
    _removePoints(pointsToDelete) {
        
        var registryValues = JSON.parse(JSON.stringify(this.state.registryValues));
        var pointsList = JSON.parse(JSON.stringify(this.state.pointsToDelete));
        var namesList = JSON.parse(JSON.stringify(this.state.pointNames));

        pointsToDelete.forEach(function (pointToDelete) {

            var index = -1;
            var pointValue = "";

            registryValues.some(function (row, i) {
                var pointMatched = (row[0].attributes.value === pointToDelete);

                if (pointMatched)
                {
                    index = i;
                    pointValue = row[0].attributes.value;
                }

                return pointMatched;
            })

            if (index > -1)
            {
                registryValues.splice(index, 1);
                
                index = pointsList.indexOf(pointValue);

                if (index > -1)
                {
                    pointsList.splice(index, 1);
                }

                index = namesList.indexOf(pointValue);

                if (index > -1)
                {
                    namesList.splice(index, 1);
                }
            }
        });

        this.setState({ registryValues: registryValues });
        this.setState({ pointsToDelete: pointsList });
        this.setState({ pointNames: namesList });

        modalActionCreators.closeModal();
    }
    _selectForDelete(attributesList) {
        
        var pointsToDelete = this.state.pointsToDelete;

        var index = pointsToDelete.indexOf(attributesList[0].value);

        if (index < 0)
        {
            pointsToDelete.push(attributesList[0].value);
        }
        else
        {
            pointsToDelete.splice(index, 1);
        }

        this.setState({ pointsToDelete: pointsToDelete });

    }
    _selectAll() {
        var allSelected = !this.state.allSelected;

        this.setState({ allSelected: allSelected });

        this.setState({ pointsToDelete : (allSelected ? JSON.parse(JSON.stringify(this.state.pointNames)) : []) }); 
    }
    _getRealIndex(index) {



    }
    _onAddColumn(index) {

        var registryValues = JSON.parse(JSON.stringify(this.state.registryValues));
        var columnNames = JSON.parse(JSON.stringify(this.state.columnNames));
        var keyPropsList = JSON.parse(JSON.stringify(this.state.keyPropsList));

        var newColumn = columnNames[index] + "-";
        columnNames.splice(index + 1, 0, newColumn);
        keyPropsList.push(newColumn);

        this.setState({ columnNames: columnNames });
        this.setState({ keyPropsList: keyPropsList });

        var newRegistryValues = registryValues.map(function (row) {

            row.attributes.splice(index + 1, 0, { 
                                            "key": newColumn, 
                                            "value": "", 
                                            "editable": true, 
                                            "keyProp": true 
                                        });
            return row;
        });

        this.resizeTable = true;

        this.setState({ registryValues: newRegistryValues });        
    }
    _onCloneColumn(index) {

        var registryValues = JSON.parse(JSON.stringify(this.state.registryValues));
        var columnNames = JSON.parse(JSON.stringify(this.state.columnNames));
        var keyPropsList = JSON.parse(JSON.stringify(this.state.keyPropsList));
        
        var newColumn = columnNames[index] + "_";
        columnNames.splice(index + 1, 0, newColumn);
        keyPropsList.push(newColumn);

        this.setState({ columnNames: columnNames });
        this.setState({ keyPropsList: keyPropsList });

        var newRegistryValues = registryValues.map(function (row) {

            var clonedValue = {};

            for (var key in row.attributes[index])
            {
                clonedValue[key] = row.attributes[index][key];
            }

            row.attributes.splice(index + 1, 0, clonedValue);

            return row;
        });

        this.resizeTable = true;

        this.setState({ registryValues: newRegistryValues });

    }
    _onRemoveColumn(index) {

        var columnHeader = this.state.registryValues[0].attributes[index].label;
        var promptText = ("Are you sure you want to delete the column, " + columnHeader + "?");
        
        modalActionCreators.openModal(
            <ConfirmForm
                promptTitle="Remove Column"
                promptText={ promptText }
                confirmText="Delete"
                onConfirm={this._removeColumn.bind(this, index)}
            ></ConfirmForm>
        );
        
    }
    _removeColumn(index) {

        var registryValues = JSON.parse(JSON.stringify(this.state.registryValues));
        var columnNames = JSON.parse(JSON.stringify(this.state.columnNames));
        var keyPropsList = JSON.parse(JSON.stringify(this.state.keyPropsList));

        var columnName = columnNames[index];

        columnNames.splice(index, 1);

        registryValues.forEach(function (row) {
            row.attributes.splice(index, 1);
        });

        index = keyPropsList.indexOf(columnName);

        if (index > -1)
        {
            keyPropsList.splice(index, 1);
        }

        this.setState({ keyPropsList: keyPropsList });
        this.setState({ columnNames: columnNames });
        this.setState({ registryValues: registryValues });

        this.resizeTable = true;

        modalActionCreators.closeModal();

    }
    _showProps(attributesList) {
        modalActionCreators.openModal(<EditPointForm 
            device={this.props.device} 
            selectedPoints={this.state.selectedPoints}
            attributes={attributesList}/>);
    }
    _updateCell(row, column, e) {

        var currentTarget = e.currentTarget;
        var newRegistryValues = JSON.parse(JSON.stringify(this.state.registryValues));

        newRegistryValues[row].attributes[column].value = currentTarget.value;

        this.setState({ registryValues: newRegistryValues });
    }
    _removeFocus() {
        this.setState({ selectedCellRow: null});
    }
    _onFindNext(findValue, column) {

        // var registryValues = this.state.registryValues.slice();
        
        if (this.state.selectedCells.length === 0)
        {
            var selectedCells = [];

            this.setState({ registryValues: this.state.registryValues.map(function (row, index) {

                    //searching i-th column in each row, and if the cell contains the target value, select it
                    row.attributes[column].selected = (row.attributes[column].value.indexOf(findValue) > -1);

                    if (row.attributes[column].selected)
                    {
                        selectedCells.push(index);
                    }

                    return row;
                })
            });

            if (selectedCells.length > 0)
            {
                this.setState({ selectedCells: selectedCells });
                this.setState({ selectedCellColumn: column });

                //set focus to the first selected cell
                this.setState({ selectedCellRow: selectedCells[0]});
            }
        }
        else
        {
            //we've already found the selected cells, so we need to advance focus to the next one
            if (this.state.selectedCells.length > 1)
            {
                var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);

                this.setState({ selectedCellRow: selectedCellRow});
            }
        }
    }
    _onReplace(findValue, replaceValue, column) {

        if (!this.state.selectedCellRow)
        {
            this._onFindNext(findValue, column);
        }
        else
        {
            // var registryValues = this.state.registryValues.slice();
            this.state.registryValues[this.state.selectedCellRow].attributes[column].value = this.state.registryValues[this.state.selectedCellRow].attributes[column].value.replace(findValue, replaceValue);        

            //If the cell no longer has the target value, deselect it and move focus to the next selected cell
            if (this.state.registryValues[this.state.selectedCellRow].attributes[column].value.indexOf(findValue) < 0)
            {
                this.state.registryValues[this.state.selectedCellRow].attributes[column].selected = false;

                //see if there will even be another selected cell to move to
                var selectedCells = this.state.selectedCells.slice();
                var index = selectedCells.indexOf(this.state.selectedCellRow);

                if (index > -1)
                {
                    selectedCells.splice(index, 1);
                }

                if (selectedCells.length > 0)
                {
                    var selectedCellRow = this._goToNext(this.state.selectedCellRow, this.state.selectedCells);
                
                    this.setState({ selectedCellRow: selectedCellRow});
                    this.setState({ selectedCells: selectedCells });
                }
                else
                {
                    //there were no more selected cells, so clear everything out
                    this.setState({ selectedCells: [] });
                    this.setState({ selectedCellRow: null });
                    this.setState({ selectedCellColumn: null });
                }
            }

            this.setState({ registryValues: this.state.registryValues});
        }
    }
    _onReplaceAll(findValue, replaceValue, column) {

        if (!this.state.selectedCellRow)
        {
            this._onFindNext(findValue, column);
        }
        else
        {
            // var registryValues = this.state.registryValues.slice();
            // var selectedCells = this.state.selectedCells.slice();
            // var selectedCellRow = this.state.selectedCellRow;

            while (this.state.selectedCells.length > 0)
            {
                this.state.registryValues[selectedCellRow].attributes[column].value = this.state.registryValues[this.state.selectedCellRow].attributes[column].value.replace(findValue, replaceValue);        

                if (this.state.registryValues[selectedCellRow].attributes[column].value.indexOf(findValue) < 0)
                {
                    this.state.registryValues[selectedCellRow].attributes[column].selected = false;

                    var index = this.state.selectedCells.indexOf(selectedCellRow);

                    if (index > -1)
                    {
                        this.state.selectedCells.splice(index, 1);
                    }
                    else
                    {
                        //something went wrong, so stop the while loop
                        break;
                    }

                    if (this.state.selectedCells.length > 0)
                    {
                        selectedCellRow = this._goToNext(selectedCellRow, this.state.selectedCells);
                    }
                }
            }

            this.setState({ selectedCellRow: null});
            this.setState({ selectedCells: [] });
            this.setState({ selectedCellColumn: null });
            this.setState({ registryValues: this.state.registryValues});
        }
    }
    _onClearFind(column) {

        // var registryValues = this.state.registryValues.slice();

        this.state.selectedCells.map(function (row) {
            this.state.registryValues[row].attributes[column].selected = false;
        }, this);

        this.setState({ registryValues: this.state.registryValues });
        this.setState({ selectedCells: [] });
        this.setState({ selectedCellRow: null });
        this.setState({ selectedCellColumn: null });

    }
    _goToNext(selectedCellRow, selectedCells) {

        //this is the row with current focus
        var rowIndex = selectedCells.indexOf(selectedCellRow);

        if (rowIndex > -1)
        {
            //either set focus to the next one in the selected cells list
            if (rowIndex < selectedCells.length - 1)
            {
                selectedCellRow = selectedCells[++rowIndex];
            }
            else //or if we're at the end of the list, go back to the first one
            {
                selectedCellRow = selectedCells[0];
            }
        }

        return selectedCellRow;
    }
    _cancelRegistry() {
        devicesActionCreators.cancelRegistry(this.props.device);
    }
    _saveRegistry() {
        devicesActionCreators.saveRegistry(this.props.device, this.state.registryValues.map(function (row) {
            return row.attributes;
        }));
        modalActionCreators.openModal(<ConfigDeviceForm device={this.props.device}/>);
    }
    _handleRowClick(evt){

        if ((evt.target.nodeName !== "INPUT") && (evt.target.nodeName !== "I") && (evt.target.nodeName !== "DIV"))  
        {

            var target;

            if (evt.target.nodeName === "TD")
            {
                target = evt.target.parentNode;
            }
            else if (evt.target.parentNode.nodeName === "TD")
            {
                target = evt.target.parentNode.parentNode;
            }
            else
            {
                target = evt.target;
            }

            var rowIndex = target.dataset.row;

            var pointKey = this.state.registryValues[rowIndex].attributes[0].value;
            var selectedPoints = this.state.selectedPoints;

            var index = selectedPoints.indexOf(pointKey);
            
            if (index > -1)
            {
                selectedPoints.splice(index, 1);
            }
            else
            {
                selectedPoints.push(pointKey);
            }

            this.setState({selectedPoints: selectedPoints});
        }
    }
    render() {        
                
        var registryRows = this.state.registryValues.map(function (attributesList, rowIndex) {

            var registryCells = [];

            attributesList.attributes.forEach(function (item, columnIndex) {

                if (item.keyProp)
                {
                    var selectedCellStyle = (item.selected ? {backgroundColor: "#F5B49D"} : {});
                    var focusedCell = (this.state.selectedCellColumn === columnIndex && this.state.selectedCellRow === rowIndex ? "focusedCell" : "");

                    var itemCell = (!item.editable ? 
                                        <td key={item.key + "-" + rowIndex + "-" + columnIndex}><label>{ item.value }</label></td> : 
                                        <td key={item.key + "-" + rowIndex + "-" + columnIndex}><input 
                                            id={this.state.registryValues[rowIndex].attributes[columnIndex].key + "-" + columnIndex + "-" + rowIndex}
                                            type="text"
                                            className={focusedCell}
                                            style={selectedCellStyle}
                                            onChange={this._updateCell.bind(this, rowIndex, columnIndex)} 
                                            value={ this.state.registryValues[rowIndex].attributes[columnIndex].value }/>
                                        </td>);

                    registryCells.push(itemCell);
                }
            }, this);

            registryCells.push(
                <td key={"propsButton-" + rowIndex}>
                    <div className="propsButton"
                        onClick={this._showProps.bind(this, attributesList.attributes)}>
                        <i className="fa fa-ellipsis-h"></i>
                    </div>
                </td>);

            var selectedRowClass = (this.state.selectedPoints.indexOf(this.state.registryValues[rowIndex].attributes[0].value) > -1 ?
                                        "selectedRegistryPoint" : "");

            var visibleStyle = (!this.state.filterOn || attributesList.visible ? {} : {display: "none"});

            return ( 
                <tr key={"registry-row-" + rowIndex}
                    data-row={rowIndex}
                    onClick={this._handleRowClick}
                    className={selectedRowClass}
                    style={visibleStyle}>
                    <td key={"checkbox-" + rowIndex}>
                        <input type="checkbox"
                            onChange={this._selectForDelete.bind(this, attributesList.attributes)}
                            checked={this.state.pointsToDelete.indexOf(attributesList.attributes[0].value) > -1}>
                        </input>
                    </td>
                    { registryCells }                    
                </tr>
            )
        }, this);

        var wideCell = {
            width: "100%"
        }

        var registryHeader = [];

        var tableIndex = 0;

        this.state.registryValues[0].attributes.forEach(function (item, index) {
        
            if (item.keyProp)
            {
                var editSelectButton = (<EditSelectButton 
                                            onremove={this._onRemoveColumn}
                                            onadd={this._onAddColumn}
                                            onclone={this._onCloneColumn}
                                            column={index}
                                            name={this.props.device.id + "-" + item.key}/>);

                var editColumnButton = (<EditColumnButton 
                                            column={index} 
                                            tooltipMsg="Edit Column"
                                            findnext={this._onFindNext}
                                            replace={this._onReplace}
                                            replaceall={this._onReplaceAll}
                                            // onfilter={this._onFilterBoxChange} 
                                            onclear={this._onClearFind}
                                            onhide={this._removeFocus}
                                            name={this.props.device.id + "-" + item.key}/>);

                var headerCell;

                if (tableIndex === 0)
                {
                    var firstColumnWidth = {
                        width: (item.length * 10) + "px"
                    }

                    var filterPointsTooltip = {
                        content: "Filter Points",
                        "x": 80,
                        "y": -60
                    }

                    var filterButton = <FilterPointsButton 
                                            name={"filterRegistryPoints-" + this.props.device.id}
                                            tooltipMsg={filterPointsTooltip}
                                            onfilter={this._onFilterBoxChange} 
                                            onclear={this._onClearFilter}
                                            column={index}/>

                    var addPointTooltip = {
                        content: "Add New Point",
                        "x": 80,
                        "y": -60
                    }

                    var addPointButton = <ControlButton 
                                            name={"addRegistryPoint-" + this.props.device.id}
                                            tooltip={addPointTooltip}
                                            controlclass="add_point_button"
                                            fontAwesomeIcon="plus"
                                            clickAction={this._onAddPoint}/>


                    var removePointTooltip = {
                        content: "Remove Points",
                        "x": 80,
                        "y": -60
                    }

                    var removePointsButton = <ControlButton
                                            name={"removeRegistryPoints-" + this.props.device.id}
                                            fontAwesomeIcon="minus"
                                            tooltip={removePointTooltip}
                                            controlclass="remove_point_button"
                                            clickAction={this._onRemovePoints}/>

                    if (item.editable)
                    {                        
                        headerCell = ( <th key={"header-" + item.key + "-" + index} style={firstColumnWidth}>
                                            <div className="th-inner zztop">
                                                { item.label } 
                                                { filterButton } 
                                                { addPointButton } 
                                                { removePointsButton }
                                                { editSelectButton }
                                                { editColumnButton }
                                            </div>
                                        </th>);
                    }
                    else
                    {
                        headerCell = ( <th key={"header-" + item.key + "-" + index} style={firstColumnWidth}>
                                            <div className="th-inner zztop">
                                                { item.label } 
                                                { filterButton } 
                                                { addPointButton } 
                                                { removePointsButton }
                                            </div>
                                        </th>);
                    }
                }
                else
                {
                    if (item.editable)
                    {
                        headerCell = ( <th key={"header-" + item.key + "-" + index}>
                                            <div className="th-inner" style={wideCell}>
                                                { item.label }
                                                { editSelectButton }
                                                { editColumnButton }
                                            </div>
                                        </th> );
                    }
                    else
                    {
                        headerCell = ( <th key={"header-" + item.key + "-" + index}>
                                            <div className="th-inner" style={wideCell}>
                                                { item.label }
                                            </div>
                                        </th> );
                    }
                }

                ++tableIndex;
                registryHeader.push(headerCell);
            }
        }, this);        

        var wideDiv = {
            width: "100%",
            textAlign: "center",
            paddingTop: "20px"
        }

        var visibilityClass = ( this.props.device.configuring ? 
                                    "collapsible-registry-values slow-show" : 
                                        "collapsible-registry-values slow-hide" );

        var tooltipX = 320;
        var tooltipY = 150;        
        
        var saveTooltip = {
            "content": "Save Configuration",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };

        var saveButton = (
            <ControlButton 
                name="saveConfigButton"
                tooltip={saveTooltip}
                fontAwesomeIcon="save"
                clickAction={this._saveRegistry}></ControlButton>
        );

        var cancelTooltip = {
            "content": "Cancel Configuration",
            "xOffset": tooltipX,
            "yOffset": tooltipY
        };

        var cancelIcon = <span>&#10008;</span>;
        var cancelButton = (
            <ControlButton 
                name="cancelConfigButton"
                tooltip={cancelTooltip}
                icon={cancelIcon}
                clickAction={this._cancelRegistry}></ControlButton>
        );
            
        return (
            <div className={visibilityClass}>                
                <div className="fixed-table-container"> 
                    <div className="header-background"></div>      
                    <div className="fixed-table-container-inner">    
                        <table className="registryConfigTable">
                            <thead>
                                <tr key="header-values">
                                    <th key="header-checkbox">
                                        <div className="th-inner">
                                            <input type="checkbox"
                                                onChange={this._selectAll}
                                                checked={this.state.allSelected}/>
                                        </div>
                                    </th>
                                    { registryHeader }
                                </tr>
                            </thead>
                            <tbody>                            
                                { registryRows }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="registry-buttons" style={wideDiv}>
                    <div className="inlineBlock">
                        {cancelButton}
                    </div>
                    <div className="inlineBlock">
                        {saveButton}
                    </div>                    
                </div>
            </div>
        );
    }
};

function getFilteredPoints(registryValues, filterStr, column) {

    return registryValues.map(function (row) {

        row.visible = (filterStr === "" || (row.attributes[column].value.trim().toUpperCase().indexOf(filterStr.trim().toUpperCase()) > -1));

        return row;
    });
}

function getPointsFromStore(device, keyPropsList) {
    return initializeList(devicesStore.getRegistryValues(device), keyPropsList);
}

// function getRegistryHeader(registryItem) {
    
//     var header = [];

//     registryItem.forEach(function (item) {
//         if (item.keyProp)
//         {
//             header.push(item.label);
//         }
//     });

//     return header;
// }

function initializeList(registryConfig, keyPropsList)
{
    return registryConfig.map(function (row) {
        row.forEach(function (cell) {
            cell.keyProp = (keyPropsList.indexOf(cell.key) > -1); 
        });

        return { visible: true, attributes: row};
    });
}


export default ConfigureRegistry;
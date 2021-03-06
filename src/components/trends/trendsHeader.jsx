/*
 * Copyright 2017 Expedia, Inc.
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */


import React from 'react';
import PropTypes from 'prop-types';

import timeWindow from './utils/timeWindow';
import {toQuery} from '../../utils/queryParser';

import './trendsHeader.less';

export default class TrendsHeader extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        serviceName: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.fetchTrends = this.fetchTrends.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);

        const urlQuery = toQuery(this.props.location.search);

        const from = parseInt(urlQuery.from, 10);
        const until = parseInt(urlQuery.until, 10);
        const isCustomTimeRange = !!(from && until);

        let activeWindow;
        let options;
        if (isCustomTimeRange) {
            activeWindow = timeWindow.toCustomTimeRange(from, until);
            options = [...timeWindow.presets, activeWindow];
        } else {
            activeWindow = timeWindow.defaultPreset;
            options = timeWindow.presets;
        }

        this.state = {
            options,
            activeWindow,
            isCustomTimeRange
        };

        this.fetchTrends(activeWindow, isCustomTimeRange, urlQuery.operationName);
    }

    fetchTrends(window, isCustomTimeRange, operationName) {
        const granularity = timeWindow.getHigherGranularity(window.value);
        const query = {
            granularity: granularity.value,
            from: window.from,
            until: window.until
        };

        this.props.store.fetchTrendServiceResults(this.props.serviceName, query, isCustomTimeRange, operationName);
    }

    handleTimeChange(event) {
        const selectedIndex = event.target.value;
        const selectedWindow = this.state.options[selectedIndex];

        this.setState({activeWindow: selectedWindow});
        this.fetchTrends(selectedWindow, selectedWindow.isCustomTimeRange, null);
    }

    render() {
        const {
            options,
            activeWindow
        } = this.state;

        const selectedIndex = options.indexOf(activeWindow);

        return (<div className="clearfix">
                <div className="pull-right">
                    <span>Showing summary for </span>
                    <select className="trend-summary__time-range-selector" value={selectedIndex} onChange={this.handleTimeChange}>
                        {options.map((window, index) => (<option value={index}>{ window.isCustomTimeRange ? '' : 'last'} {window.longName}</option>))}
                    </select>
                </div>
            </div>
        );
    }
}

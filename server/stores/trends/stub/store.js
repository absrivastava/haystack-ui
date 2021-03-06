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

const Q = require('q');
const _ = require('lodash');

const store = {};

function getValue(min, max) {
    return _.round((Math.random() * (max - min)) + min, 0);
}

function getTimeStamp(addMin) {
    const currentTime = ((new Date()).getTime());
    return (currentTime - (addMin * 60 * 1000));
}

function getRandomValues(timeWindow, dataPoints) {
    const valuesArr = [];
    _.range(dataPoints).forEach(i => valuesArr.push({value: getValue(10, 1000), timestamp: getTimeStamp(i * timeWindow)}));
    return valuesArr;
}

store.getTrendsForService = (serviceName, granularity, from, until) => {
    const deffered = Q.defer();

    const range = until - from;
    const points = range / granularity;
    const mins = granularity / (60 * 1000);

    deffered.resolve([
        {
            operationName: 'seaworth-1',
            count: 10000,
            successPercent: getValue(10, 100),
            tp99Duration: getRandomValues(mins, points)
        },
        {
            operationName: 'bolton-1',
            count: 15000,
            successPercent: getValue(10, 100),
            tp99Duration: getRandomValues(mins, points)
        },
        {
            operationName: 'baelish-1',
            count: 5000,
            successPercent: getValue(10, 100),
            tp99Duration: getRandomValues(mins, points)
        },
        {
            operationName: 'mormont-1',
            count: 1000,
            successPercent: getValue(10, 100),
            tp99Duration: getRandomValues(mins, points)
        }
    ]);

    return deffered.promise;
};

store.getTrendsForOperation = (serviceName, operationName, granularity, from, until) => {
    const deffered = Q.defer();

    const range = until - from;
    const points = range / granularity;
    const mins = granularity / (60 * 1000);

    deffered.resolve({
        count: getRandomValues(mins, points),
        successCount: getRandomValues(mins, points),
        failureCount: getRandomValues(mins, points),
        meanDuration: getRandomValues(mins, points),
        tp95Duration: getRandomValues(mins, points),
        tp99Duration: getRandomValues(mins, points)
    });

    return deffered.promise;
};

module.exports = store;

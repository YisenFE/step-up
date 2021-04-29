import _ from 'lodash';
import React from 'react';
import obj from './common/obj';
obj.count++;
console.log('another-modules', obj.count);

_.join('1', '2');

console.log(React);

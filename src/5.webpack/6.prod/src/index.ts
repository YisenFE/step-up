// import './style/index.scss';
import _ from 'lodash';
// import Vue from 'vue';
import obj from './common/obj';
import './components/aa';
import './components/bb';
obj.count++;
console.log('index', obj.count);

debugger;
_.join('11', '22');
console.log(import('vue'));


const el = document.createElement('span');
el.innerText = '123'
document.body.appendChild(el);

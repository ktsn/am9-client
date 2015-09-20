'use strict';

import timeline from '../timeline/timeline';
import add from '../add/add';
import things from '../things/things';
import moment from 'moment';

require('./personal.scss');

module.exports = {
  template: require('./personal.html'),
  data: function() {
    return {
      resources: [],
      things: []
    };
  },

  created: function() {
    this.$on('doing-added', (idx) => {
      this.$broadcast('doing-added', idx);
    });

    this.$on('doing-updated', (doing) => {
      this.$broadcast('doing-updated', doing);
    });

    this.$on('thing-updated', (thing) => {
      this.$broadcast('thing-updated', thing);
    });

    this.$on('thing-time-set', (thing, start, end) => {
      this.$broadcast('thing-time-set', thing, start, end);
    });

    var today = moment().format('YYYY-MM-DD');

    this._resource = this.$resource('/api/v1/resources/:id');
    this._resource.get({ id: 1, date: today }, (resource) => {
      this.resources = [resource];
    });

    this._thing = this.$resource('/api/v1/things');
    this._thing.get({ date: today }, (things) => {
      this.things = things;
    });

    var thingSender = this.$sender(this._thing);
    this.$on('thing-added', (thing) => {
      thingSender.add('add', thing);
    });

    this.$on('thing-updated', (thing) => {
      thingSender.add('update', thing);
    });

    this.$on('thing-removed', (thing) => {
      thingSender.add('remove', thing);
    });
  },

  components: { timeline, add, things }
};

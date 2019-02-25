<template>
  <div id="app">
    <div v-if="table_data.length === 0">No data</div>

    <table v-else>
      <thead>
        <tr>
          <th>Function name</th>
          <th>Repository</th>
          <th>Docker image</th>
          <th>UI link</th>
          <th>Used by</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="line in table_data" :key="line.name">
          <td><a :href="'http://faas.srv.disarm.io/function/' + line['image']">{{line['image']}}</a></td>
          <td><a :href="line['repo']">{{line['repo']}}</a></td>
          <td><a :href="'https://hub.docker.com/r/' + line['image'].split(':')[0]">{{line['image']}}</a></td>
          <td><a :href="line['ui']">{{line['ui']}}</a></td>
          <td>{{line['uses'] ? line['uses'].join(' | ') : 'no uses listed'}}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>

  import {fetch_and_combine} from './fetch_and_combine';

  export default {
    data() {
      return {
        table_data: [],
      }
    },
    mounted() {
      this.update_table()
    },
    methods: {
      async update_table() {
        this.table_data = await fetch_and_combine()
      },
    },
  }
</script>

<style>
  @import "../node_modules/picnic/picnic.min.css";
</style>

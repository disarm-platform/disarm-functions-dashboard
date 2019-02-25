<template>
  <div id="app">
    <div v-if="table_data.length === 0">No data</div>

    <table v-else>
      <thead>
        <tr>
          <th>Fn</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Super</td>
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

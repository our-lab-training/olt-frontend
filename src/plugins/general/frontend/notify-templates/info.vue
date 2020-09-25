<template>
  <small>
    You can use <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">
      markdown
    </a> to stylise your message.<br>
      You can also inject specific information, <a @click="dialog=true">
      click here for more info.
    </a>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="450px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Message Injection</span>
          <v-spacer/>
          <v-btn small flat icon @click="dialog=false">
            <v-icon small>fal fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p>
            If you place the following tags into the message,
            they will automatically be replaced with the relevant
            information before the notification is sent.
          </p>
          <p>
            <code>users</code> is the grouped users if you have the option enabled.
            Otherwise <code>user</code> will either be the user that each
            notification is sent for, or the first user in users.
          </p>
          <table class="tags">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Example Injection</th>
              </tr>
            </thead>
            <tbody style="text-align:center">
              <tr><td><code>{{'\{\{user.name\}\}'}}</code></td><td>Jane Smith</td></tr>
              <tr><td><code>{{'\{\{user.firstname\}\}'}}</code></td><td>Jane</td></tr>
              <tr><td><code>{{'\{\{user.lastname\}\}'}}</code></td><td>Smith</td></tr>
              <tr><td><code>{{'\{\{user.pheme\}\}'}}</code></td><td>12345678</td></tr>
              <tr><td><code>{{'\{\{users.nameList\}\}'}}</code></td><td>
                Jane Smith, John Cena, Jo Blogs
              </td></tr>
              <tr><td><code>{{'\{\{users.firstnameList\}\}'}}</code></td><td>
                Jane, John, Jo
              </td></tr>
              <tr><td><code>{{'\{\{users.lastnameList\}\}'}}</code></td><td>
                Smith, Cena, Blogs
              </td></tr>
              <tr><td><code>{{'\{\{users.phemeList\}\}'}}</code></td><td>
                12345678, 87654321, 00098765
              </td></tr>
              <tr><td><code>{{'\{\{users.table\}\}'}}</code></td><td>
                <table>
                  <thead>
                    <tr><th>Name</th><th style="text-align:right">Pheme Number</th></tr>
                  </thead>
                  <tbody style="text-align:left">
                    <tr><td>Jane Smith</td><td style="text-align:right">12345678</td></tr>
                    <tr><td>John Cena</td><td style="text-align:right">87654321</td></tr>
                    <tr><td>Jo Blogs</td><td style="text-align:right">00098765</td></tr>
                  </tbody>
                </table>
              </td></tr>
            </tbody>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat color="primary" @click="dialog=false">
            ok, got it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </small>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped>
table,
table > * > * > th,
table > * > * > td {
  border: 1px solid lightgray;
  padding: 0.5em;
}
table {
  border-collapse: collapse;
  padding: 0;
}
</style>

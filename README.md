# to-do-list

Interactive app for scheduling your day, see it [here](https://mycolaanikeiev.github.io/todolist/). It uses browser `localStorage` for saving schedule records, but under hood it uses in-memory-web-api so a backend can be writen. To do this it enough to remove `HttpClientInMemoryWebApiModule` from `AppModule` imports and check `app.config.ts` file. 

## Build

Run `ng build` to build the project.


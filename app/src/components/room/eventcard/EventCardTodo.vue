<template
  xmlns:v-clipboard="http://www.w3.org/1999/xhtml"
  xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
>
  <v-card
    shaped
    dense
    :loading="todoList.isLoading ? 'warning' : false"
    :color="card.ui.color"
    dark
  >
    <v-card-text>
      <v-list :color="card.ui.color">
        <v-list-group value="true" color="white">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="title font-weight-light">
                {{ card.text ? card.text : "Todos" }} ({{ todos.length }} item{{
                  todos.length === 1 ? "" : "s"
                }})
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="todo in todos" :key="todo.id">
            <v-list-item-icon @click="toggleTodo(todo.id)">
              <v-icon :color="todo.completed ? 'lime' : 'white'">
                {{
                  todo.completed
                    ? "mdi-check-circle"
                    : "mdi-check-circle-outline"
                }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="todo.text"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="deleteTodo(todo.id)">
                <v-icon color="green lighten-3">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>

            <!-- TODO: Add ability to assign todos
            <v-list-item-avatar>
              <v-img></v-img>
            </v-list-item-avatar>
            -->
          </v-list-item>
        </v-list-group>
      </v-list>

      <v-form @submit="addTodo">
        <v-text-field v-model="todoInput" label="Add a todo"></v-text-field>
      </v-form>
    </v-card-text>
    <CardActions
      :card="card"
      :isAdmin="isAdmin"
      :isClosed="isClosed"
      :showAvatar="false"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FeedEvent } from "@/libs/Feed";
import CardActions from "@/components/room/eventcard/CardActions.vue";
import { Todo, TodoList } from "@/libs/TodoList";
import sharedScope from "@/libs/SharedScope";

export default Vue.extend({
  name: "EventWidgetTodo",

  props: {
    card: { type: FeedEvent, required: true },
    isAdmin: { type: Boolean, required: true },
    isClosed: { type: Boolean, required: true }
  },

  components: { CardActions },

  created() {
    this.card.subscribe(() => {
      this.$set(this, "todos", this.todoList.list());
      console.log(
        "todo list updated",
        this.card.id,
        this.todoList.isLoading,
        this.todos.length
      );
    });
  },

  beforeDestroy() {
    this.todoList.destroy();
  },

  methods: {
    addTodo(event) {
      event.preventDefault();
      if (this.todoInput) {
        this.todoList.create(this.todoInput, sharedScope.user.uid as string);
        this.todoInput = "";
      }
    },
    toggleTodo(todoId: string) {
      this.todoList.toggleCompleted(todoId);
    },
    deleteTodo(todoId: string) {
      this.todoList.delete(todoId);
    }
  },

  // Moved this into the created() method inside our change detection
  // because for some reason, the linter goes crazy here whenever we try
  // to add a computed property with lots of errors like these:
  // Property 'todoList' does not exist on type 'ComponentOptions<Vue, DefaultData<Vue>,
  // DefaultMethods<Vue>, DefaultComputed, PropsDefinition<Record<string, any>>, Record<...>>'.
  //
  // It's hacky and computed would be a better answer, but couldn't find a solution in 30m of
  // troubleshooting so gave up and did this instead.
  // computed: {
  //   todos() { return this.todoList.list() }
  // },

  data() {
    return {
      counter: 0,
      todoList: new TodoList(this.card),
      todos: [] as Todo[],
      todoInput: ""
    };
  }
});
</script>

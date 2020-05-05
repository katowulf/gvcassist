import firebase from "@/libs/firebase-init";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import DB from "@/libs/DB";
import DocumentChange = firebase.firestore.DocumentChange;
import moment = require("moment");
import DocumentData = firebase.firestore.DocumentData;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import { FeedEvent } from "@/libs/Feed";
import { burnedTheToast } from "@/libs/Toaster";

const TodoConverter = {
  toFirestore(todo: Todo): DocumentData {
    return {
      created: DB.util.timestamp(todo.created),
      creator: todo.creator,
      assignee: todo.assignee || null,
      text: todo.text,
      completed: todo.completed
    };
  },

  fromFirestore(snap: QueryDocumentSnapshot<DocumentData>): Todo {
    const data = snap.data();
    return {
      ...data,
      created: data.created ? data.created.toDate() : new Date(),
      id: snap.id
    } as Todo;
  }
};

export interface Todo {
  created: Date;
  creator: string;
  id: string;
  assignee?: string;
  text: string;
  completed: boolean;
}

export class TodoList {
  map = new Map<string, Todo>();
  public isLoading = true;
  sub: () => void;

  constructor(private event: FeedEvent) {
    this.sub = DB.todos(event.roomId, event.id)
      .orderBy("created")
      .limitToLast(1000)
      .withConverter(TodoConverter)
      .onSnapshot(ss => this.serverUpdate(ss));
  }

  list(): Todo[] {
    return [...this.map.values()].sort((a, b) =>
      moment(a.created).diff(b.created)
    );
  }

  create(todoText: string, uid: string) {
    const id = DB.util.id();
    DB.todo(this.event.roomId, this.event.id, id)
      .set({
        created: DB.util.timestamp(),
        id: id,
        text: todoText,
        completed: false,
        creator: uid
      })
      .catch(burnedTheToast("TodoList::create"));
  }

  assign(todoId: string, userId: string) {
    DB.todo(this.event.roomId, this.event.id, todoId)
      .update({ assignee: userId })
      .catch(burnedTheToast("TodoList::assign"));
  }

  toggleCompleted(todoId: string) {
    if (!this.map.has(todoId)) {
      return;
    }
    this.completed(todoId, !this.map.get(todoId)?.completed);
  }

  completed(todoId: string, newValue: boolean) {
    DB.todo(this.event.roomId, this.event.id, todoId)
      .update({ completed: newValue })
      .catch(burnedTheToast("TodoList::complete"));
  }

  delete(todoId: string) {
    DB.todo(this.event.roomId, this.event.id, todoId)
      .delete()
      .catch(burnedTheToast("TodoList::delete"));
  }

  destroy() {
    this.sub();
    this.map.clear();
  }

  private serverUpdate(snap: QuerySnapshot<Todo>) {
    this.isLoading = false;
    const ids = new Set<string>();

    // console.log("Todos updated", DB.path.todos(this.event.roomId, this.event.id), snap.docs.length);
    snap.docChanges().forEach((change: DocumentChange<Todo>) => {
      ids.add(change.doc.id);
      const data = change.doc.data();
      if (change.type === "added") {
        this.map.set(change.doc.id, data);
        // console.log("added: ", change.doc.id, data);
      } else if (change.type === "modified") {
        const todo = this.map.get(change.doc.id);
        if (todo) {
          Object.assign(todo, data);
        }
        // console.log("modified: ", change.doc.id, data);
      } else if (change.type === "removed") {
        this.map.delete(change.doc.id);
        // console.log("removed: ", change.doc.id, data);
      }
    });
    this.event.notify();
  }
}

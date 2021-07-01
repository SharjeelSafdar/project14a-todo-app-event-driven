import { Todo } from "../graphql/api";

export const reducerFunc = (
  state: ReducerState,
  action: Action
): ReducerState => {
  switch (action.id) {
    case "SET_TODOS": {
      return {
        ...state,
        todos: action.payload.todos,
      };
    }

    case "ADD_NEW_TODO": {
      const isAlreadyIncluded =
        state.todos.findIndex(todo => todo.id === action.payload.newTodo.id) !==
        -1;
      return {
        ...state,
        todos: isAlreadyIncluded
          ? state.todos
          : [...state.todos, action.payload.newTodo],
      };
    }

    case "UPDATE_TODO": {
      const newTodosArray = [...state.todos];
      const todoIndex = newTodosArray.findIndex(
        todo => todo.id === action.payload.newTodo.id
      );
      if (todoIndex !== -1) {
        newTodosArray[todoIndex].content = action.payload.newTodo.content;
        newTodosArray[todoIndex].status = action.payload.newTodo.status;
      }
      return {
        ...state,
        todos: newTodosArray,
      };
    }

    case "DELETE_TODO": {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.todoId),
      };
    }

    default: {
      return state;
    }
  }
};

export interface ReducerState {
  todos: Todo[];
}

type SetTodos = {
  readonly id: "SET_TODOS";
  readonly payload: { todos: Todo[] };
};

type AddNewTodo = {
  readonly id: "ADD_NEW_TODO";
  readonly payload: { newTodo: Todo };
};

type UpdateTodo = {
  readonly id: "UPDATE_TODO";
  readonly payload: { newTodo: Todo };
};

type DeleteTodo = {
  readonly id: "DELETE_TODO";
  readonly payload: { todoId: string };
};

export type Action = SetTodos | AddNewTodo | UpdateTodo | DeleteTodo;

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
  useReducer,
  Reducer,
} from "react";
import { API } from "aws-amplify";

import { todos as getAllTodosQuery } from "../graphql/queries";
import {
  createTodo,
  editTodoContent,
  toggleTodoStatus,
  deleteTodo,
} from "../graphql/mutations";
import { onMutationCompleted } from "../graphql/subscriptions";
import {
  TodosQuery,
  CreateTodoMutation,
  CreateTodoMutationVariables,
  EditTodoContentMutation,
  EditTodoContentMutationVariables,
  ToggleTodoStatusMutation,
  ToggleTodoStatusMutationVariables,
  DeleteTodoMutation,
  DeleteTodoMutationVariables,
  OnMutationCompletedSubscription,
  OnMutationCompletedSubscriptionVariables,
} from "../graphql/api";
import { reducerFunc, ReducerState, Action } from "./reducerFunction";
import { useAuth } from "./authContext";

const reducerInitialState: ReducerState = {
  todos: [],
};

const initialValues: ContextType = {
  ...reducerInitialState,
  isFetchingTodos: false,
  isBusy: false,
  getAllTodos: () => {},
  createNewTodo: () => {},
  updateTodoContent: () => {},
  toggleTodo: () => {},
  deleteTodoById: () => {},
};

export const TodosContext = createContext<ContextType>(initialValues);

export const useTodosContext = () => useContext(TodosContext);

export const TodosProvider: FC = ({ children }) => {
  const [reducerState, dispatch] = useReducer<Reducer<ReducerState, Action>>(
    reducerFunc,
    reducerInitialState
  );
  const [isFetchingTodos, setIsFetchingTodos] = useState(
    initialValues.isFetchingTodos
  );
  const [isBusy, setIsBusy] = useState(initialValues.isBusy);
  const { isSignedIn, user } = useAuth();

  const getAllTodos = async () => {
    setIsFetchingTodos(true);

    try {
      const response = (await API.graphql({
        query: getAllTodosQuery,
      })) as { data: TodosQuery };

      const todos = response.data.todos;
      dispatch({ id: "SET_TODOS", payload: { todos } });
    } catch (err) {
      console.log("Error fetching todo: ", JSON.stringify(err, null, 2));
    }

    setIsFetchingTodos(false);
  };

  const createNewTodo = async (content: string) => {
    setIsBusy(true);

    try {
      const variables: CreateTodoMutationVariables = { content };
      const response = (await API.graphql({
        query: createTodo,
        variables,
      })) as { data: CreateTodoMutation };

      console.log("createTodo Response: ", response);
    } catch (err) {
      console.log("Error creating new todo: ", JSON.stringify(err, null, 2));
    }

    setIsBusy(false);
  };

  const updateTodoContent = async (id: string, newContent: string) => {
    setIsBusy(true);

    try {
      const variables: EditTodoContentMutationVariables = { id, newContent };
      const response = (await API.graphql({
        query: editTodoContent,
        variables,
      })) as { data: EditTodoContentMutation };

      console.log("editTodoContent Response: ", response);
    } catch (err) {
      console.log("Error updating todo: ", err);
    }

    setIsBusy(false);
  };

  const toggleTodo = async (id: string, newStatus: boolean) => {
    setIsBusy(true);

    try {
      const variables: ToggleTodoStatusMutationVariables = { id, newStatus };
      const response = (await API.graphql({
        query: toggleTodoStatus,
        variables,
      })) as { data: ToggleTodoStatusMutation };

      console.log("toggleTodoStatus Response: ", response);
    } catch (err) {
      console.log("Error toggling the status of todo: ", err);
    }

    setIsBusy(false);
  };

  const deleteTodoById = async (id: string) => {
    setIsBusy(true);

    try {
      const variables: DeleteTodoMutationVariables = { id };
      const response = (await API.graphql({
        query: deleteTodo,
        variables,
      })) as { data: DeleteTodoMutation };

      console.log("deleteTodo Response: ", response);
    } catch (err) {
      console.log("Error deleting the todo: ", err);
    }

    setIsBusy(false);
  };

  const onMutationCompletedSub = async () => {
    const variables: OnMutationCompletedSubscriptionVariables = {
      username: isSignedIn() ? user.username : null,
    };
    const subscription = API.graphql({
      query: onMutationCompleted,
      variables,
    }) as any;

    subscription.subscribe({
      next: (status: { value: { data: OnMutationCompletedSubscription } }) => {
        if (status.value.data.onMutationCompleted) {
          const data = status.value.data.onMutationCompleted;
          console.log("Sub Data: ", data);
          const todo = data.todo;

          switch (data.mutationType) {
            case "createTodo":
              dispatch({ id: "ADD_NEW_TODO", payload: { newTodo: todo } });
              break;
            case "editTodoContent":
            case "toggleTodoStatus":
              dispatch({ id: "UPDATE_TODO", payload: { newTodo: todo } });
              break;
            case "deleteTodo":
              dispatch({ id: "DELETE_TODO", payload: { todoId: todo.id } });
              break;
            default:
              break;
          }
        }
      },
    });
  };

  useEffect(() => {
    getAllTodos();
    onMutationCompletedSub();
  }, []);

  const value: ContextType = {
    ...initialValues,
    ...reducerState,
    isFetchingTodos,
    isBusy,
    getAllTodos,
    createNewTodo,
    updateTodoContent,
    toggleTodo,
    deleteTodoById,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export interface ContextType extends ReducerState {
  isFetchingTodos: boolean;
  isBusy: boolean;
  getAllTodos: () => void;
  createNewTodo: (content: string) => void;
  updateTodoContent: (id: string, newContent: string) => void;
  toggleTodo: (id: string, newStatus: boolean) => void;
  deleteTodoById: (id: string) => void;
}

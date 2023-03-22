// @ts-nocheck

import { useState, useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { API } from 'aws-amplify';
import { Button, View, Heading, withAuthenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
	updateTodo as updateTodoMutation,
} from './graphql/mutations';
import TodoList from './components/TodoList/TodoList';
import TodoForm from './components/TodoForm/TodoForm';

const App = ({ signOut }) => {
	const [todos, setTodos] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});

	useEffect(() => {
		fetchTodos();
	}, []);

	const handleOnChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const resetFormData = () => {
		setFormData({
			name: '',
			description: '',
		});
	};

	const fetchTodos = async () => {
		const apiData = await API.graphql({ query: listTodos });
		const todosFromAPI = apiData.data.listTodos.items;
		setTodos(todosFromAPI);
	};

	const createTodo = async (e) => {
		e.preventDefault();
		await API.graphql({
			query: createTodoMutation,
			variables: { input: formData },
		});
		fetchTodos();
		resetFormData();
	};

	const editTodo = (todo) => {
		setFormData({
			id: todo.id,
			name: todo.name,
			description: todo.description,
		});
		setIsEditing(true);
	};

	const updateTodo = async (e) => {
		e.preventDefault();
		await API.graphql({
			query: updateTodoMutation,
			variables: {
				input: {
					id: formData.id,
					name: formData.name,
					description: formData.description,
				},
			},
		});
		fetchTodos();
		resetFormData();
		setIsEditing(false);
	};

	const deleteTodo = async ({ id }) => {
		const newtodos = todos.filter((todo) => todo.id !== id);
		setTodos(newtodos);
		await API.graphql({
			query: deleteTodoMutation,
			variables: { input: { id } },
		});
		resetFormData();
		setIsEditing(false);
	};

	return (
			<View className='App'>
			<Heading level={1}>My Todos App</Heading>
				<TodoForm
					formData={formData}
					createTodo={createTodo}
					updateTodo={updateTodo}
					isEditing={isEditing}
					handleOnChange={handleOnChange}
				/>
				<TodoList
					todos={todos}
					deleteTodo={deleteTodo}
					editTodo={editTodo}
				/>
				<Button onClick={signOut}>Sign Out</Button>
			</View>
	);
};

export default withAuthenticator(App);

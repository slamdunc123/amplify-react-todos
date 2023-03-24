// @ts-nocheck

import { useState, useEffect, useRef } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { API, Storage } from 'aws-amplify';
import {
	Button,
	View,
	Heading,
	withAuthenticator,
} from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
	updateTodo as updateTodoMutation,
} from './graphql/mutations';
import TodoList from './components/TodoList/TodoList';
import TodoForm from './components/TodoForm/TodoForm';

const App = ({ signOut, user }) => {
	const [todos, setTodos] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image: '',
	});
	const imageInputRef = useRef();
	const { sub } = user.attributes;

	useEffect(() => {
		fetchTodos();
	}, [sub]);

	const handleOnChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const resetFormData = () => {
		setFormData({
			name: '',
			description: '',
			image: '',
		});
	};

	const fetchTodos = async () => {
		try {
			const apiData = await API.graphql({
				query: listTodos,
				// authMode: 'AMAZON_COGNITO_USER_POOLS',
			});
			const todosFromAPI = apiData.data.listTodos.items;
			await Promise.all(
				todosFromAPI.map(async (todo) => {
					if (todo.image) {
						const url = await Storage.get(todo.name);
						todo.image = url;
					}
					return todo;
				})
			);
			setTodos(todosFromAPI);
		} catch (error) {
			console.log(error);
		}
	};

	const createTodo = async (e) => {
		e.preventDefault();

		const form = new FormData(e.target);
		const image = form.get('image');
		const data = {
			name: form.get('name'),
			description: form.get('description'),
			image: image.name,
		};
		try {
			if (!!data.image) {
				await Storage.put(data.name, image);
			}
			await API.graphql({
				query: createTodoMutation,
				variables: { input: data },
				authMode: 'AMAZON_COGNITO_USER_POOLS',
			});
			fetchTodos();
			e.target.reset();
		} catch (error) {
			console.log(error);
		}
		resetFormData();
	};

	const editTodo = (todo) => {
    imageInputRef.current.value = '';
		setFormData({
			id: todo.id,
			name: todo.name,
			description: todo.description,
			image: todo.image,
		});
		setIsEditing(true);
	};

	const updateTodo = async (e) => {
		e.preventDefault();

		const form = new FormData(e.target);
		const image = form.get('image');
		const data = {
			id: formData.id,
			name: form.get('name'),
			description: form.get('description'),
			image: image.name,
		};

		try {
			if (!!data.image) await Storage.put(data.name, image);
			await API.graphql({
				query: updateTodoMutation,
				variables: { input: data },
				authMode: 'AMAZON_COGNITO_USER_POOLS',
			});
			fetchTodos();
			e.target.reset();
		} catch (error) {
			console.log(error);
		}
		resetFormData();
		setIsEditing(false);
	};

	const deleteTodo = async ({ id, name }) => {
		try {
			await Storage.remove(name);
			await API.graphql({
				query: deleteTodoMutation,
				variables: { input: { id } },
				authMode: 'AMAZON_COGNITO_USER_POOLS',
			});
			const newtodos = todos.filter((todo) => todo.id !== id);
			setTodos(newtodos);
		} catch (error) {
			console.log(error);
		}
		resetFormData();
		setIsEditing(false);
	};

	return (
		<View className='App'>
			<Heading level={1}>Todo App</Heading>
			<Heading level={5}>{user.username}</Heading>
			<TodoForm
				formData={formData}
				createTodo={createTodo}
				updateTodo={updateTodo}
				isEditing={isEditing}
				handleOnChange={handleOnChange}
				imageInputRef={imageInputRef}
			/>
			<TodoList
				todos={todos}
				deleteTodo={deleteTodo}
				editTodo={editTodo}
				username={user.username}
			/>
			<Button onClick={signOut}>Sign Out</Button>
		</View>
	);
};

export default withAuthenticator(App);

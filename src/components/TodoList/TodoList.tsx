// @ts-nocheck

import { Button, Flex, Heading, Text, View } from '@aws-amplify/ui-react';

const TodoList = ({ todos, deleteTodo, editTodo }) => {
	return (
		<>
			<Heading level={2}>Todo List</Heading>
			<View margin='3rem 0'>
				{todos.map((todo) => (
					<Flex
						key={todo.id || todo.name}
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						<Text as='strong' fontWeight={700}>
							{todo.name}
						</Text>
						<Text as='span'>{todo.description}</Text>
						<Button
							variation='link'
							onClick={() => deleteTodo(todo)}
						>
							Delete Todo
						</Button>
						<Button onClick={() => editTodo(todo)}>
							Edit Todo
						</Button>
					</Flex>
				))}
			</View>
		</>
	);
};

export default TodoList;

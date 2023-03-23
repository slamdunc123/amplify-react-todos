// @ts-nocheck

import { Button, Flex, Heading, Text, View } from '@aws-amplify/ui-react';

const TodoList = ({ todos, deleteTodo, editTodo, username }) => {
	return (
		<>
			<Heading level={2}>Todo List</Heading>
			<View margin='3rem 0'>
				{todos.map((todo) => {
					const isTodoOwnedByLoggedInUser = username === todo.owner;
					return (
						<Flex
							key={todo.id || todo.name}
							direction='row'
							justifyContent='center'
							alignItems='center'
						>
							<Text as='strong' fontWeight={700}>
								{todo.owner}
							</Text>
							<Text as='strong' fontWeight={700}>
								{todo.name}
							</Text>
							<Text as='span'>{todo.description}</Text>
							<Button
								variation='link'
								onClick={() => deleteTodo(todo)}
								disabled={!isTodoOwnedByLoggedInUser}
							>
								Delete Todo
							</Button>
							<Button
								variation='link'
								onClick={() => editTodo(todo)}
								disabled={!isTodoOwnedByLoggedInUser}
							>
								Edit Todo
							</Button>
						</Flex>
					);
				})}
			</View>
		</>
	);
};

export default TodoList;

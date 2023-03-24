// @ts-nocheck

import {
	Button,
	Flex,
	Heading,
	TextField,
	View,
} from '@aws-amplify/ui-react';

const TodoForm = ({
	formData,
	createTodo,
	updateTodo,
	isEditing,
	handleOnChange,
  imageInputRef
}) => {
	return (
		<>
			<Heading level={2}>Todo Form</Heading>
			<View
				as='form'
				margin='3rem 0'
				onSubmit={isEditing ? updateTodo : createTodo}
			>
				<Flex direction='row' justifyContent='center'>
					<TextField
						name='name'
						placeholder='Todo Name'
						label='Todo Name'
						labelHidden
						variation='quiet'
						value={formData.name}
						onChange={handleOnChange}
						required
					/>
					<TextField
						name='description'
						placeholder='Todo Description'
						label='Todo Description'
						labelHidden
						variation='quiet'
						value={formData.description}
						onChange={handleOnChange}
						required
					/>
					<View
						name='image'
						as='input'
						type='file'
						style={{ alignSelf: 'end' }}
            ref={imageInputRef}
					/>
					<Button type='submit' variation='primary'>
						{isEditing ? 'Update Todo' : 'Create Todo'}
					</Button>
				</Flex>
			</View>
		</>
	);
};

export default TodoForm;

import { neon } from '@neondatabase/serverless';
import { stackServerApp } from '@/app/stack';
import { revalidatePath } from 'next/cache';

const handleAddTodo = async (formData: FormData) => {
  'use server';
  const newTodo = formData.get('newTodo');
  const user = await stackServerApp.getUser();

  if (!newTodo) {
    throw new Error('No newTodo');
  }

  if (!user) {
    throw new Error('No user');
  }

  const sql = neon(process.env.DATABASE_URL!);
  await sql`INSERT INTO todos (task, is_complete, owner_id) VALUES (${newTodo.toString()}, false, ${
    user.id
  })`;

  revalidatePath('/');
};

export async function AddTodoForm() {
  return (
    <form action={handleAddTodo}>
      <input required name='newTodo' placeholder='Enter a new todo' />
      <button type='submit'>Add Todo</button>
    </form>
  );
}

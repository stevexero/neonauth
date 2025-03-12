import { neon } from '@neondatabase/serverless';

export async function TodosList() {
  const sql = neon(process.env.DATABASE_URL!);

  // get the todos with the owner
  const todosWithOwner = await sql(`
    SELECT 
      todos.id,
      todos.task,
      todos.is_complete,
      users.id as "owner.id",
      users.email as "owner.email"
    FROM todos
    LEFT JOIN neon_auth.users_sync users ON todos.owner_id = users.id
    ORDER BY todos.inserted_at ASC;
  `);

  return (
    <ul>
      {todosWithOwner.map((todo) => (
        <li key={todo.id}>
          <span>{todo.task}</span>
          <span>{todo.owner?.email}</span>
        </li>
      ))}
    </ul>
  );
}

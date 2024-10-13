import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function create(data: FormData) {
  "use server";
  const title = data.get("title") as string;
  const priority = parseInt(data.get("priority") as string, 10);
  const supabase = createClient();

  if (!title || priority === undefined || priority < 1 || priority > 5) {
    console.log("Title and priority must be provided and prioriti must me 1-5");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .insert([{ title, priority, deleted: false }])
    .select("*");

  if (error) {
    console.error(error);
  }

  revalidatePath("/todo");
}

async function update(data: FormData) {
  "use server";
  const id = parseInt(data.get("id") as string, 10);
  const newTitle = data.get("newTitle") as string;
  const newPriority = parseInt(data.get("newPriority") as string, 10);
  const supabase = createClient();

  if (
    !newTitle ||
    newPriority === undefined ||
    newPriority < 1 ||
    newPriority > 5
  ) {
    console.log("Title and priority must be provided and prioriti must me 1-5");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .update({ title: newTitle, priority: newPriority })
    .eq("id", id)
    .select("*");

  if (error) {
    console.error(error);
  }

  revalidatePath("/todo");
}

async function deleteTodo(data: FormData) {
  "use server";
  const id = parseInt(data.get("id") as string, 10);

  const supabase = createClient();
  const { error } = await supabase
    .from("todos")
    .update({ deleted: true })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/todo");
}

export default async function ServerTodoComponent() {
  const supabase = createClient();

  let { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("deleted", false);

  if (!todos || todos.length === 0) return <h1>No todos found</h1>;

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1>Server-Component</h1>
        <div>
          {todos.map((todo) => (
            <div key={todo.id} className="flex justify-between items-center">
              <div className="flex flex-col justify-between items-left w-96">
                <p>Title: {todo.title}</p>
                <p>Priority: {todo.priority}</p>
              </div>
              <form action={update} method="post">
                <input type="hidden" name="id" value={todo.id} />
                <input type="text" name="newTitle" defaultValue={todo.title} />
                <input
                  type="number"
                  name="newPriority"
                  defaultValue={todo.priority}
                />
                <button type="submit">Update</button>
              </form>

              <form action={deleteTodo} method="post">
                <input type="hidden" name="id" value={todo.id} />
                <button type="submit" className="ml-2">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={create} method="post">
          <input type="text" name="title" placeholder="New Todo Title" />
          <input type="number" name="priority" placeholder="Priority" />
          <button type="submit">Insert Todo</button>
        </form>
      </main>
    </>
  );
}

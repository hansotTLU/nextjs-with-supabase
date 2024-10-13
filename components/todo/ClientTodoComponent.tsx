"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ClientTodoComponent() {
  const [todos, setTodos] = useState<any[] | null>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState();
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    getTodos();

    (() => console.log("hi"))();
  }, []);

  const getTodos = async () => {
    // local DB
    // let { data: todo, error } = await supabase.from("todo").select("*");

    // web DB
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .eq("deleted", false);
    setTodos(todos);
  };

  const handleInsert = async () => {
    if (!title || priority === undefined || priority < 1 || priority > 5) {
      alert("Please provide a valid title and priority (1-5)!");
      return;
    }

    // local DB
    // const { data, error } = await supabase
    //   .from("todo")
    //   .insert([{ title, priority, deleted: false }])
    //   .select("*");

    // web DB
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, priority, deleted: false }])
      .select("*");

    getTodos();
  };

  const handleUpdate = async (
    id: number,
    newTitle: string,
    newPriority: number
  ) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ title: newTitle, priority: newPriority })
      .eq("id", id)
      .select("*");

    getTodos();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("todos")
      .update({ deleted: true })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    getTodos();
  };

  const handlePopoverOpen = (todo: any) => {
    setEditingTodo(todo);
    setNewTitle(todo.title);
    setNewPriority(todo.priority);
    setIsOpen(true);
  };

  return (
    <>
      <main className="flex flex-col gap-10">
        <h1>Client-Component</h1>
        {todos?.map((todo) => (
          <div key={todo.id} className="flex justify-between items-center">
            <div className="flex flex-col justify-between items-left w-96">
              <p>Title: {todo.title}</p>
              <p>Priority: {todo.priority}</p>
            </div>
            <div>
              <Popover open={isOpen && editingTodo?.id === todo.id}>
                <PopoverTrigger asChild>
                  <Button onClick={() => handlePopoverOpen(todo)}>
                    Update
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-4 bg-black shadow-lg rounded-md">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title">Title</label>
                      <Input
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter new title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="priority">Priority (1-5)</label>
                      <Input
                        id="newPriority"
                        type="number"
                        min={1}
                        max={5}
                        step={1}
                        value={newPriority}
                        onChange={(e) => setNewPriority(Number(e.target.value))}
                        placeholder="Enter priority (1-5)"
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button
                        onClick={() => {
                          if (editingTodo) {
                            handleUpdate(
                              editingTodo.id,
                              newTitle,
                              newPriority || 1
                            );
                          }
                          setIsOpen(false);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={() => handleDelete(todo.id)} className="ml-2">
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Input
          placeholder="Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Priority (1-5)"
          type="number"
          min={1}
          max={5}
          step={1}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Button onClick={handleInsert}>Insert Todo</Button>
      </main>
    </>
  );
}

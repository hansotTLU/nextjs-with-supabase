import ClientTodoComponent from "@/components/todo/ClientTodoComponent";
import ServerTodoComponent from "@/components/todo/ServerTodoComponent";

export default async function Page() {
  return (
    <>
      <h1>To Do lists:</h1>
      <ServerTodoComponent />
      <ClientTodoComponent />
    </>
  );
}

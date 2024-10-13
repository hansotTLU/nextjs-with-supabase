import ClientTodoComponent from "@/components/todo/ClientTodoComponent";
import ServerTodoComponent from "@/components/todo/ServerTodoComponent";

export default async function Page() {
  return (
    <>
      <ServerTodoComponent />
      <ClientTodoComponent />
    </>
  );
}

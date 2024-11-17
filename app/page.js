import { Suspense } from "react";
import { Counter } from "./Counter";
import { Todos } from "./Todos";


export default async function App() {
  return (
    <div className="main">
      <Suspense fallback={<div>loading...</div>}>
        <Todos />
      </Suspense>
      <Counter />
    </div>
  );
}

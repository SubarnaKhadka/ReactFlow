export async function generateMetadata() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();

  return {
    title: data[0]?.title,
  };
}

export const environment = "static";

export default async function Contact() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();

  return (
    <div>
      {data?.slice(0, 10)?.map((item) => (
        <span key={item.id}>{item.title}</span>
      ))}
    </div>
  );
}

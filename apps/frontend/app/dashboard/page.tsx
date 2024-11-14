"use client";

function Page() {
  const check = async () => {
    const result = await fetch("http://localhost:4000/health", {
      method: "GET",
      credentials: "include",
    });
    console.log(await result.json());
  };

  return (
    <button onClick={check} type="button">
      Dashboard
    </button>
  );
}

export default Page;

export default function Error({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const errorMessage =
    searchParams.errorMessage ?? "Something went wrong. Please try again.";
  return <div>{errorMessage}</div>;
}

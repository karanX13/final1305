type Status = "processing" | "completed" | "failed";

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  const styles = {
    processing: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
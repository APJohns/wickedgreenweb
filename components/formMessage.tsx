export type Message = { success: string } | { error: string } | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div>
      {'success' in message && <p>{message.success}</p>}
      {'error' in message && <p>{message.error}</p>}
      {'message' in message && <p>{message.message}</p>}
    </div>
  );
}

export default function TableCell({ Editable, val, type = "text", onChanged, name }) {
  return (
    <td className="p-2 border">
      {Editable ? (
        <input
          value={val}
          name={name}
          className="text-center w-16"
          type={type}
          onChange={onChanged}
        />
      ) : (
        val
      )}
    </td>
  );
}
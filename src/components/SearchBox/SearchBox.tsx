import css from "./SearchBox.module.css";


interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}
export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.value);
  }

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={value}
      onChange={handleChange}
    />
  );
}
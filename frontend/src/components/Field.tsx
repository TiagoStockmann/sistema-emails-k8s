import { useId } from "react";
import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  icon?: ReactNode;
  /** Recebe o id gerado, para amarrar o rótulo ao controle. */
  children: (id: string) => ReactNode;
};

export default function Field({ label, icon, children }: FieldProps) {
  const id = useId();

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {icon}
        {label}
      </label>
      {children(id)}
    </div>
  );
}

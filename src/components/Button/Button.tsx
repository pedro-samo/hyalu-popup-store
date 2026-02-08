import "./styles.scss";

export const Button = ({
  text,
  onClick,
  className = "",
  type,
  disabled = false
}: {
  type?: "button" | "submit" | "reset";
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button type={type ?? "button"} className={`button ${className}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

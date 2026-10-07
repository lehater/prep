import type {
  ButtonHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

export interface TaskHeaderProps {
  readonly eyebrow: ReactNode;
  readonly title: ReactNode;
  readonly headingId?: string | undefined;
  readonly children?: ReactNode;
}

export function TaskHeader({
  eyebrow,
  title,
  headingId,
  children,
}: TaskHeaderProps) {
  return (
    <header className="task-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={headingId}>{title}</h1>
      {children}
    </header>
  );
}

export interface ActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  readonly variant?: "primary" | "secondary" | "text" | undefined;
  readonly className?: string | undefined;
}

export function ActionButton({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[`${variant}-action`, className].filter(Boolean).join(" ")}
    />
  );
}

export interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly label: ReactNode;
  readonly children: ReactNode;
}

export function Field({ label, className, children, ...props }: FieldProps) {
  return (
    <label
      {...props}
      className={["field", className].filter(Boolean).join(" ")}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

export interface SurfaceProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly ariaLabel?: string | undefined;
}

export function Surface({
  children,
  className,
  ariaLabel,
}: SurfaceProps) {
  return (
    <section
      className={["ui-surface", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

export interface OutcomeMessageProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

export function OutcomeMessage({
  children,
  className,
}: OutcomeMessageProps) {
  return (
    <p
      className={["outcome-message", className].filter(Boolean).join(" ")}
      role="status"
    >
      {children}
    </p>
  );
}

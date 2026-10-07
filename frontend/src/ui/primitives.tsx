import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
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

export interface FieldProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
  readonly controlId: string;
  readonly label: ReactNode;
  readonly children: ReactNode;
}

export function Field({
  controlId,
  label,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <label
      {...props}
      htmlFor={controlId}
      className={["field", className].filter(Boolean).join(" ")}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

export interface SectionHeaderProps {
  readonly eyebrow?: ReactNode | undefined;
  readonly title: ReactNode;
  readonly headingId?: string | undefined;
  readonly children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  headingId,
  children,
}: SectionHeaderProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={headingId}>{title}</h2>
      {children}
    </div>
  );
}

export interface ActionGroupProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

export function ActionGroup({
  className,
  children,
  ...props
}: ActionGroupProps) {
  return (
    <div
      {...props}
      className={["action-row", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
}

export function Surface({
  children,
  className,
  ...props
}: SurfaceProps) {
  return (
    <section
      {...props}
      className={["ui-surface", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}

export interface ChoiceCardProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
  readonly controlId: string;
  readonly selected: boolean;
  readonly children: ReactNode;
}

export function ChoiceCard({
  controlId,
  selected,
  className,
  children,
  ...props
}: ChoiceCardProps) {
  return (
    <label
      {...props}
      htmlFor={controlId}
      className={["choice-card", className].filter(Boolean).join(" ")}
      data-selected={selected ? "true" : "false"}
    >
      {children}
    </label>
  );
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: "positive" | "warning" | "danger" | "neutral" | "info";
}

export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      {...props}
      className={["status-badge", className].filter(Boolean).join(" ")}
      data-tone={tone}
    />
  );
}

export interface OutcomeMessageProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "role"> {
  readonly children: ReactNode;
}

export function OutcomeMessage({
  children,
  className,
  ...props
}: OutcomeMessageProps) {
  return (
    <p
      {...props}
      className={["outcome-message", className].filter(Boolean).join(" ")}
      role="status"
    >
      {children}
    </p>
  );
}

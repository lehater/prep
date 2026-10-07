import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export interface ShellBreadcrumb {
  readonly label: string;
}

export interface ShellStatusItem {
  readonly label: string;
  readonly value: ReactNode;
}

export interface ApplicationShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  readonly sidebar: ReactNode;
  readonly topBar: ReactNode;
  readonly statusBar: ReactNode;
  readonly children: ReactNode;
  readonly contentClassName?: string | undefined;
}

export function ApplicationShell({
  sidebar,
  topBar,
  statusBar,
  children,
  className,
  contentClassName,
  ...props
}: ApplicationShellProps) {
  return (
    <div
      {...props}
      className={["application-shell", className].filter(Boolean).join(" ")}
    >
      <div className="application-shell-sidebar">{sidebar}</div>
      {topBar}
      <main
        className={["application-shell-content", contentClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </main>
      {statusBar}
    </div>
  );
}

export interface ShellTopBarProps {
  readonly breadcrumbs: readonly ShellBreadcrumb[];
  readonly actions?: ReactNode;
}

export function ShellTopBar({
  breadcrumbs,
  actions,
}: ShellTopBarProps) {
  return (
    <header className="app-topbar">
      <nav className="shell-breadcrumbs" aria-label="Навигационный путь">
        <ol>
          {breadcrumbs.map((item, index) => {
            const current = index === breadcrumbs.length - 1;
            return (
              <li key={`${item.label}-${index}`} aria-current={current ? "page" : undefined}>
                {item.label}
              </li>
            );
          })}
        </ol>
      </nav>
      {actions ? <div className="app-topbar-actions">{actions}</div> : null}
    </header>
  );
}

export interface ShellStatusBarProps {
  readonly leading?: readonly ShellStatusItem[];
  readonly trailing?: readonly ShellStatusItem[];
}

function StatusItems({
  items,
}: {
  readonly items: readonly ShellStatusItem[];
}) {
  return (
    <>
      {items.map((item) => (
        <span className="shell-status-item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </span>
      ))}
    </>
  );
}

export function ShellStatusBar({
  leading = [],
  trailing = [],
}: ShellStatusBarProps) {
  return (
    <footer className="app-statusbar" aria-label="Статус приложения">
      <div className="app-statusbar-leading">
        <StatusItems items={leading} />
      </div>
      <div className="app-statusbar-trailing">
        <StatusItems items={trailing} />
      </div>
    </footer>
  );
}

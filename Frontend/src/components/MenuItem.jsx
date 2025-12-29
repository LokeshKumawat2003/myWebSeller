import React from "react"
import { Bell } from "lucide-react"

const MenuItem = ({
  item,
  isActive,
  isCollapsed,
  hasNotification,
  notificationCount,
  onClick,
  isDark
}) => {
  const { icon: IconComponent, label, id } = item

  const baseStyle = isDark
    ? "text-slate-400 hover:bg-slate-800/70"
    : "text-slate-600 hover:bg-slate-100"

  const activeStyle = isDark
    ? "bg-gradient-to-r from-blue-600/25 to-cyan-600/20 text-white border-l-4 border-blue-400 shadow-blue-500/20"
    : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-blue-500/10"

  return (
    <div
      onClick={() => onClick(id)}
      className={`
        relative w-full cursor-pointer select-none
        flex items-center rounded-xl
        ${isCollapsed ? "justify-center px-3" : "gap-3 px-4"}
        py-3 transition-all duration-300
        ${isActive ? activeStyle : baseStyle}
        hover:shadow-md
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <IconComponent
          size={20}
          className={`
            transition-colors duration-300
            ${isActive
              ? isDark
                ? "text-blue-400"
                : "text-blue-600"
              : "group-hover:text-blue-500"}
          `}
        />
      </div>

      {/* Label */}
      {!isCollapsed && (
        <div className="text-sm font-medium truncate">
          {label}
        </div>
      )}

      {/* Notification (expanded) */}
      {!isCollapsed && hasNotification && (
        <div className="ml-auto flex items-center gap-1">
          <Bell size={14} className="text-orange-500" />
          <div className="text-[11px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            {notificationCount}
          </div>
        </div>
      )}

      {/* Notification dot (collapsed) */}
      {isCollapsed && hasNotification && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
      )}

      {/* Soft hover overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  )
}

export default MenuItem

import { SairnaIcon } from "../../ui/sairna-icon";
import { cn } from "../../../lib/cn";

const fieldControlBase =
  "flex items-center gap-2.5 rounded-xl border border-border px-3.5 text-muted transition-all duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(200,138,50,0.14)]";

const inputBase =
  "w-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-text outline-none placeholder:text-[#9AA3AE]";

export function FormInputField({
  label,
  required = false,
  iconName,
  iconSize = 18,
  rightAddon,
  heightClass = "h-[50px]",
  className,
  inputClassName,
  ...inputProps
}) {
  return (
    <label className={cn("block min-w-0", className)}>
      {label && (
        <span className="mb-2 block text-[12px] font-bold text-text">
          {label} {required && <em className="not-italic text-danger">*</em>}
        </span>
      )}
      <div className={cn(fieldControlBase, heightClass)}>
        {iconName && (
          <SairnaIcon name={iconName} size={iconSize} className="text-primary" />
        )}
        <input
          required={required}
          className={cn(inputBase, inputClassName)}
          {...inputProps}
        />
        {rightAddon}
      </div>
    </label>
  );
}

export default FormInputField;

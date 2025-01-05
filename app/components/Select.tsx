import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SelectCustom = ({
  name,
  label,
  placeholder,
  description,
  id,
  options,
  selected,
  className,
  disabled,
  locale,
  onChange,
}: any) => {
  return (
    <Select
      onValueChange={(val) => {
        onChange && onChange(val);
      }}
    >
      <SelectTrigger className="  shadow-sm">
        <SelectValue placeholder={placeholder || "SELECT"}>
          {selected && typeof selected.name === "object" ? selected.name[locale] : selected?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {!disabled &&
          options &&
          options.map((option: any, i: number) => (
            <SelectItem key={i} value={option._id || option.value || option}>
              {option.name || option}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectCustom;

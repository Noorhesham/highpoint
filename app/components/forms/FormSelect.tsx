import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSelect = ({
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
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => {
        const val = form.getValues(name);
        const selected = options?.find((p: any) => p.value === val._id);

        return (
          <FormItem className={`${className || ""} flex-1 `} id={id || ""}>
            <FormLabel className=" uppercase">{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="  shadow-sm">
                  <SelectValue placeholder={placeholder || "SELECT"}>
                    {selected && typeof selected.name === "object" ? selected.name[locale] : selected?.name}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
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
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelect;

import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSelect = ({ name, label, placeholder, description, id, options, selected, className }: any) => {
  const form = useFormContext();
  const selectedValue = form.watch(name);

  // Filter out the selected value from the options
  const filteredOptions = options?.filter((p) => !selected?.includes(p._id));
  console.log(form.getValues(name), options);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = options?.find((p) => p._id === form.getValues(name)._id);
        console.log(selected);
        return (
          <FormItem className={`${className || ""} flex-1 `} id={id || ""}>
            <FormLabel className=" uppercase">{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="  shadow-sm">
                  <SelectValue placeholder={placeholder || "SELECT"}>{selected && selected.name}</SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options &&
                  options.map((option, i) => (
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

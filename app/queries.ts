import { useQuery } from "@tanstack/react-query";
import { getEntity } from "./actions/actions";

export const useGetEntity = ({ entityName }: { entityName: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [entityName],
    queryFn: async () => {
      getEntity(entityName, "", "");
    },
  });
};

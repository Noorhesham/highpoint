"use client";
import { useQuery } from "@tanstack/react-query";
import { getEntities, getEntity } from "./actions/actions";
import { ModelProps } from "./constant";

export const useGetEntity = ({ entityName, key }: { entityName: ModelProps; key: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => await getEntities(entityName, 1, "", true),
  });
  return { data, isLoading };
};

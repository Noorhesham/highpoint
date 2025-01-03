"use client";
import { useQuery } from "@tanstack/react-query";
import { getEntities, getEntity } from "./actions/actions";
import { ModelProps } from "./constant";

export const useGetEntity = ({
  entityName,
  key,
  filter,
  searchField,
  seachTerm,
}: {
  entityName: ModelProps;
  key: string;
  filter?: Record<string, any>;
  searchField?: string;
  seachTerm?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => await getEntities(entityName, 1, filter, true, "", searchField, seachTerm),
  });
  return { data, isLoading };
};

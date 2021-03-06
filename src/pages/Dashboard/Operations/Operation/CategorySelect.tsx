import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import Input from 'components/Input';
import { useFilterCategories, useCreateCategory } from 'hooks/useCategories';
import { useOperationsFilters } from 'hooks/useOperationsFilters';
import { useUpdateOperation } from 'hooks/useOperations';
import { Operation, Categories } from 'models';
import { ALL_CATEGORY } from 'graphql/Categories';
import customStyles from './style/CategorySelect.style';

type Props = {
  CategoryId: string | null;
  operation: Operation;
};

type Option = {
  value: string;
  label: string;
};

const CategorySelect = ({ CategoryId, operation }: Props) => {
  const [value, setValue] = useState<Option | undefined>();
  const { data: allCategories, loading } = useQuery<Categories>(ALL_CATEGORY);
  const { currentTransactionType } = useOperationsFilters();
  const { createCategory } = useCreateCategory();
  const { updateOperation } = useUpdateOperation();
  const filterCategory = useFilterCategories();
  const { t } = useTranslation('categories');

  const loadOptions = debounce((value: string, callback: any) => {
    filterCategory(value).then((results: Option[]) => callback(results));
  }, 400);

  const create = async (value: string) => {
    try {
      const { data } = await createCategory({
        variables: { name: value, type: currentTransactionType },
      });

      if (data?.createOneCategory) {
        await updateOperation({
          variables: {
            ...operation,
            accountId: operation.accountId,
            categoryId: data?.createOneCategory.id,
          },
        });
        setValue({ value: data?.createOneCategory.id, label: data?.createOneCategory.name });
      }
    } catch (err) {
      toast.error(err.message, { position: toast.POSITION.BOTTOM_LEFT, draggable: false });
    }
  };

  const update = (data: { value: string; label: string }) => {
    if (CategoryId !== data.value) {
      try {
        updateOperation({
          variables: {
            ...operation,
            accountId: operation.accountId,
            categoryId: data.value,
          },
        });
        setValue(data);
      } catch (err) {
        toast.error(err.message, { position: toast.POSITION.BOTTOM_LEFT, draggable: false });
      }
    }
  };

  const defaultValues = allCategories?.categories.data
    .map((category) => ({
      value: category.id,
      label: category.name,
    }))
    .filter((category) => category.value === CategoryId);

  const defaultOptions = allCategories?.categories.data
    .filter((option) => option.type === currentTransactionType)
    .map((category) => ({
      value: category.id,
      label: category.name,
    }));

  return loading ? (
    <Input defaultValue="loading" disabled />
  ) : (
    <AsyncCreatableSelect
      cacheOptions
      value={value}
      defaultOptions={defaultOptions}
      defaultValue={defaultValues}
      aria-label={t('placeholderSelector')}
      loadOptions={loadOptions}
      placeholder={t('placeholderSelector')}
      onCreateOption={create}
      styles={customStyles}
      onChange={update}
    />
  );
};

export default CategorySelect;

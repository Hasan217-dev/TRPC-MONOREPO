import { trpc } from "~/trpc/client"

export const useCreateForm = () => {
    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation()

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    }
}

export const useListForms = () => {
    const {
        data: forms,
        error,
        isError,
        isLoading,
        isPending,
        refetch,
        status,
    } = trpc.form.listForms.useQuery(undefined, {
        retry: false,
    })

    return {
        forms,
        error,
        isError,
        isLoading,
        isPending,
        refetch,
        status,
    }
}

export const useCreateFiled = () => {
    const {
        mutateAsync: createFiledAsync,
        mutate: createFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createFiled.useMutation()

    return {
        createFiledAsync,
        createFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    }
}

export const useGetFiled = (id: string) => {
    const {
        data: field,
        error,
        isError,
        isLoading,
        isPending,
        refetch,
        status,
    } = trpc.form.getFiled.useQuery(
        { id },
        {
            enabled: Boolean(id),
            retry: false,
        },
    )

    return {
        field,
        error,
        isError,
        isLoading,
        isPending,
        refetch,
        status,
    }
}

export const useUpdateFiled = () => {
    const {
        mutateAsync: updateFiledAsync,
        mutate: updateFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.updateFiled.useMutation()

    return {
        updateFiledAsync,
        updateFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    }
}

export const useDeleteFiled = () => {
    const {
        mutateAsync: deleteFiledAsync,
        mutate: deleteFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.deleteFiled.useMutation()

    return {
        deleteFiledAsync,
        deleteFiled,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    }
}

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

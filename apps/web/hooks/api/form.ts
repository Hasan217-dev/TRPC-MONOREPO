import { trpc } from "~/trpc/client";

export function useCreateForm() {

    const {
       mutateAsync : createFormAsync ,
       mutate : createForm,
       error,
       isError,
       failureCount,
       isIdle,
       isSuccess,
       status
    } = trpc.form.createForm.useMutation()

    return {
      createForm,
      createFormAsync,
      error,
      isError,
      isIdle,
      failureCount,
      isSuccess,
      status
    };
}




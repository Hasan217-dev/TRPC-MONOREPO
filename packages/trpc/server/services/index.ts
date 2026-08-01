import FormService from "@repo/services/form";
import FormFiledService from "@repo/services/form-filed";
import FormSubmissionService from "@repo/services/form-submission";
import UserService from "@repo/services/user";

export const userService = new UserService();
export const formService = new FormService();
export const formFiledService = new FormFiledService();
export const formSubmissionService = new FormSubmissionService();
